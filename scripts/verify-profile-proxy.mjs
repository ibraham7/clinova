import assert from 'node:assert/strict';
import handler from '../netlify/functions/profile-lead.mjs';
const payload = { purpose:'company_profile_download',contact:{type:'email',value:'proxy-test@example.com'},language:'ar',source:'hero',marketingConsent:false,requestId:'c64c83e7-a51a-46ae-8d0d-906d6eabc838' };
const request = (body=payload,origin='https://clinova.novanoai.online') => new Request('https://clinova.novanoai.online/.netlify/functions/profile-lead',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const originalFetch=globalThis.fetch;
try {
    let calls=0;
    const sent=[];
    globalThis.fetch=async(url,options)=>{
        calls++; sent.push(JSON.parse(options.body));
        assert.equal(options.redirect,'follow'); assert.equal(options.cache,'no-store');
        assert.equal(options.headers['Content-Type'],'text/plain;charset=UTF-8');
        return calls===1 ? new Response('',{status:404}) : Response.json({ok:true,duplicate:true});
    };
    let response=await handler(request());
    assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});
    assert.equal(calls,2);assert.equal(sent[0].requestId,sent[1].requestId);
    assert.equal(response.headers.get('Cache-Control'),'no-store');
    calls=0;
    assert.equal((await handler(request({...payload,requestId:'invalid'}))).status,400);
    assert.equal((await handler(request(payload,'https://untrusted.example'))).status,403);
    assert.equal((await handler(new Request('https://clinova.novanoai.online/.netlify/functions/profile-lead'))).status,405);
    assert.equal((await handler(request({...payload,extra:'x'.repeat(4096)}))).status,413);
    assert.equal(calls,0);
    globalThis.fetch=async()=>{calls++;return Response.json({ok:false,error:'busy'})};
    assert.equal((await handler(request())).status,503);assert.equal(calls,2);
    calls=0;globalThis.fetch=async()=>{calls++;return Response.json({ok:false,error:'sheet_not_ready'})};
    assert.equal((await handler(request())).status,503);assert.equal(calls,1);
    calls=0;globalThis.fetch=async()=>{calls++;if(calls===1)throw new TypeError('Network error');return Response.json({ok:true})};
    assert.equal((await handler(request())).status,200);assert.equal(calls,2);
    console.log('Proxy validation, transient 404/network retries, UUID reuse, and unconfirmed-write failure passed');
} finally {globalThis.fetch=originalFetch}
