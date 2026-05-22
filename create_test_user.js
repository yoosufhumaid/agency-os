const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envRaw = fs.readFileSync('.env.local','utf8');
const env = envRaw.split(/\n/).filter(Boolean).reduce((a,l)=>{const idx=l.indexOf('='); if(idx===-1) return a; const k=l.slice(0,idx); const v=l.slice(idx+1); a[k]=v; return a;},{});
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!url || !serviceKey){ console.error('Missing env vars'); process.exit(2);} 
const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false } });
(async ()=>{
  try{
    const email = `test+${Date.now()}@example.com`;
    const password = 'Test1234!';
    console.log('Creating user', email);
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if(error){ console.error('createUser error', error); process.exit(2);} 
    console.log('createUser data', data);
    // try sign-in
    const tokenUrl = url + '/auth/v1/token?grant_type=password';
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'apikey': serviceKey, 'Authorization': 'Bearer ' + serviceKey },
      body: JSON.stringify({ email, password })
    });
    console.log('signin status', res.status);
    console.log('signin body', await res.text());
  }catch(e){ console.error(e); process.exit(2);} 
})();
