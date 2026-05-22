const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const playwright = require('playwright');

async function readEnv() {
  const envRaw = fs.readFileSync('.env.local', 'utf8');
  return envRaw.split(/\n/).filter(Boolean).reduce((a, l) => {
    const idx = l.indexOf('=');
    if (idx === -1) return a;
    const k = l.slice(0, idx);
    const v = l.slice(idx + 1);
    a[k] = v;
    return a;
  }, {});
}

(async () => {
  const env = await readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE env vars');
    process.exit(2);
  }

  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false } });

  const email = `e2e+${Date.now()}@example.com`;
  const password = 'Test1234!';

  console.log('Creating test user:', email);
  const { data: createData, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    console.error('Failed to create user:', error);
    process.exit(2);
  }

  // Try to locate the created user to get their id (admin.createUser may return nested data)
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list users:', listError);
    process.exit(2);
  }

  const createdUser = (listData && listData.users || []).find((u) => u.email === email);
  if (!createdUser) {
    console.error('Created user not found in admin list');
    process.exit(2);
  }

  const userId = createdUser.id;
  console.log('User created id:', userId);

  // Ensure there's a profile row so server-side /dashboard can detect role
  const { data: profileInsert, error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userId, email, full_name: 'E2E Test', role: 'employee' });
  if (profileError) {
    console.error('Failed to create profile row:', profileError);
    process.exit(2);
  }

  // Try browsers in order: chromium, firefox, webkit
  const browsers = ['chromium', 'firefox', 'webkit'];
  for (const b of browsers) {
    let browser = null;
    try {
      console.log(`Trying ${b}...`);
      browser = await playwright[b].launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('http://localhost:3000/signin', { waitUntil: 'networkidle' });

      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await Promise.all([
        page.waitForURL('**/dashboard**', { timeout: 15000 }),
        page.click('button[type="submit"]'),
      ]);

      console.log(`E2E test succeeded on ${b}: redirected to /dashboard`);
      await browser.close();
      process.exit(0);
    } catch (err) {
      console.error(`${b} failed:`, err && err.message ? err.message : err);
      if (browser) await browser.close().catch(() => {});
      // try next browser
    }
  }

  console.error('All browsers failed to run E2E test');
  process.exit(4);
})();
