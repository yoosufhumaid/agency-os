const fs = require('fs');
const envRaw = fs.readFileSync('.env.local','utf8');
const env = envRaw.split(/\n/).filter(Boolean).reduce((a,l)=>{const idx=l.indexOf('='); if(idx===-1) return a; const k=l.slice(0,idx); const v=l.slice(idx+1); a[k]=v; return a;},{});
const url = (env.NEXT_PUBLIC_SUPABASE_URL || '') + '/auth/v1/token?grant_type=password';
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log('Using URL:', url);
(async ()=>{
  try{
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({ email: 'notreal@example.com', password: 'badpass' })
    });
    console.log('STATUS', res.status);
    const text = await res.text();
    console.log('BODY', text);
  } catch (e) {
    console.error('ERROR', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
