require('dotenv').config({path:'.env.local'});
const crypto = require('crypto');
const now = Math.floor(Date.now()/1000);
const pk = process.env.LINEWORKS_PRIVATE_KEY.replace(/\\n/g,'\n');
const h = Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
const p = Buffer.from(JSON.stringify({iss:process.env.LINEWORKS_CLIENT_ID,sub:process.env.LINEWORKS_SERVICE_ACCOUNT,iat:now,exp:now+3600})).toString('base64url');
const s = crypto.createSign('RSA-SHA256');
s.update(h+'.'+p);
const sig = s.sign(pk,'base64url');

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
}).then(r=>r.json()).then(d=>{
  console.log('TOKEN:', d.access_token ? 'OK' : 'FAIL', JSON.stringify(d).slice(0,200));
  if(d.access_token) {
    // Get calendar list
    fetch('https://www.worksapis.com/v1.0/users/1c08c1b7-bc51-4876-1f87-05e4bd3e95f1/calendar-personals',{
      headers:{Authorization:'Bearer '+d.access_token}
    }).then(r=>r.json()).then(c=>console.log('CALENDARS:', JSON.stringify(c,null,2)));

    // Also try default calendar events with wider date range
    const from = '2026-02-08T00:00:00+09:00';
    const to = '2026-02-20T23:59:59+09:00';
    fetch('https://www.worksapis.com/v1.0/users/1c08c1b7-bc51-4876-1f87-05e4bd3e95f1/calendar/events?fromDateTime='+encodeURIComponent(from)+'&untilDateTime='+encodeURIComponent(to),{
      headers:{Authorization:'Bearer '+d.access_token}
    }).then(r=>r.json()).then(e=>console.log('EVENTS:', JSON.stringify(e,null,2)));
  }
});
