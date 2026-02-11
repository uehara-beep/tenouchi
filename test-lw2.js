require('dotenv').config({path:'.env.local'});
const crypto = require('crypto');
const now = Math.floor(Date.now()/1000);
const pk = process.env.LINEWORKS_PRIVATE_KEY.replace(/\\n/g,'\n');
const h = Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
const p = Buffer.from(JSON.stringify({iss:process.env.LINEWORKS_CLIENT_ID,sub:process.env.LINEWORKS_SERVICE_ACCOUNT,iat:now,exp:now+3600})).toString('base64url');
const s = crypto.createSign('RSA-SHA256');
s.update(h+'.'+p);
const sig = s.sign(pk,'base64url');

const uid = '1c08c1b7-bc51-4876-1f87-05e4bd3e95f1';
const from = '2026-02-08T00:00:00%2B09:00';
const to = '2026-02-20T23:59:59%2B09:00';

fetch('https://auth.worksmobile.com/oauth2/v2.0/token',{
  method:'POST',
  headers:{'Content-Type':'application/x-www-form-urlencoded'},
  body:new URLSearchParams({
    assertion:h+'.'+p+'.'+sig,
    grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',
    client_id:process.env.LINEWORKS_CLIENT_ID,
    client_secret:process.env.LINEWORKS_CLIENT_SECRET,
    scope:'calendar'
  })
}).then(r=>r.json()).then(async d=>{
  const token = d.access_token;

  // Check "上原拓" calendar
  const r1 = await fetch('https://www.worksapis.com/v1.0/users/'+uid+'/calendars/c_500397735_7b9fdd50-fb49-4ab3-b306-7c2b6e718f78/events?fromDateTime='+from+'&untilDateTime='+to, {headers:{Authorization:'Bearer '+token}});
  const d1 = await r1.json();
  console.log('=== 上原拓 カレンダー ===');
  console.log(JSON.stringify(d1,null,2));

  // Check "社内共有カレンダー"
  const r2 = await fetch('https://www.worksapis.com/v1.0/users/'+uid+'/calendars/c_500397735_4960955b-14ce-40bb-832f-c32e54848de1/events?fromDateTime='+from+'&untilDateTime='+to, {headers:{Authorization:'Bearer '+token}});
  const d2 = await r2.json();
  console.log('=== 社内共有カレンダー ===');
  console.log(JSON.stringify(d2,null,2));
});
