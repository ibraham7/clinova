const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(root, 'node_modules/.profile-check-'));
(async () => {
    try {
        for (const name of ['profileLeads','contact']) fs.writeFileSync(path.join(tmp, name + '.js'), ts.transpileModule(fs.readFileSync(path.join(root, 'src/config/' + name + '.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText);
        fs.writeFileSync(path.join(tmp,'profile-leads.json'), JSON.stringify({endpoint:''}));
        const { detectContactType, parseContact, submitProfileLead, profileLeadsEnabled } = require(path.join(tmp,'profileLeads.js'));
        const { bottomBookingLinkProps, bookingLinkProps } = require(path.join(tmp,'contact.js'));
        assert.equal(profileLeadsEnabled, false, 'No collection without a configured receiver');
        delete require.cache[require.resolve(path.join(tmp,'profileLeads.js'))];
        delete require.cache[require.resolve(path.join(tmp,'profile-leads.json'))];
        fs.copyFileSync(path.join(root,'src/config/profile-leads.json'),path.join(tmp,'profile-leads.json'));
        const configured = require(path.join(tmp,'profile-leads.json'));
        assert.equal(require(path.join(tmp,'profileLeads.js')).profileLeadsEnabled, configured.endpoint.startsWith('https://'), 'Collection follows configured HTTPS receiver');
        assert.equal(detectContactType('1234'),'unknown');
        assert.equal(detectContactType('55168'),'phone');
        assert.equal(detectContactType('test@example.com'),'email');
        assert.equal(detectContactType('١٢٣٤٥'),'phone');
        assert.equal(parseContact('12345','TR'),null);
        assert.equal(parseContact('bad@','TR'),null);
        assert.equal(parseContact('test@example.com other','TR'),null);
        assert.equal(parseContact('call +905516886988','TR'),null);
        assert.equal(parseContact('Person@EXAMPLE.COM','TR').value,'Person@example.com');
        for (const value of ['5516886988','0551 688 69 88','+90 551 688 69 88','0090 5516886988','+٩٠ ٥٥١ ٦٨٨ ٦٩ ٨٨']) assert.equal(parseContact(value,'TR').value,'+905516886988', value);
        assert.equal(parseContact('+905516886988','US').country,'TR','International prefix overrides selected country');
        assert.equal(parseContact('+12025550123','TR').value,'+12025550123');
        const lead={ contact:parseContact('test@example.com','TR'), language:'ar', source:'hero', marketingConsent:false, requestId:'fixed-test-id' };
        const originalFetch=global.fetch;
        try {
            global.fetch=async (url,options) => {
                assert.equal(url,'https://receiver.example/profile');
                assert.equal(options.method,'POST');assert.equal(options.credentials,'omit');
                const payload=JSON.parse(options.body);assert.equal(payload.contact.value,'test@example.com');assert.equal(payload.marketingConsent,false);assert.equal(payload.purpose,'company_profile_download');assert.equal(payload.requestId,lead.requestId);
                return {ok:true,json:async()=>({ok:true})};
            };
            await submitProfileLead(lead,'https://receiver.example/profile');
            global.fetch=async (url,options)=>{assert.equal(url,'https://script.google.com/macros/s/test/exec');assert.equal(options.headers['Content-Type'],'text/plain;charset=UTF-8');return{ok:true,json:async()=>({ok:true})}};
            await submitProfileLead(lead,'https://script.google.com/macros/s/test/exec');
            await assert.rejects(submitProfileLead(lead,''));
            await assert.rejects(submitProfileLead(lead,'http://receiver.example/profile'));
            for (const response of [{ok:false,json:async()=>({ok:true})},{ok:true,json:async()=>({ok:false})},{ok:true,json:async()=>({})},{ok:true,json:async()=>{throw Error('not JSON')}}]) {
                global.fetch=async()=>response;
                await assert.rejects(submitProfileLead(lead,'https://receiver.example/profile'));
            }
            global.fetch=async()=>{throw Error('offline')};
            await assert.rejects(submitProfileLead(lead,'https://receiver.example/profile'));
        } finally { global.fetch=originalFetch; }
        assert.equal(new URL(bookingLinkProps.href).searchParams.has('text'),false,'Top CTA stays direct');
        const message='مرحباً، أود الحصول على معلومات حول خدمات Clinova. هل يمكنكم مساعدتي؟';
        const bottom=new URL(bottomBookingLinkProps(message).href);
        assert.equal(bottom.hostname,'wa.me');assert.equal(bottom.pathname,'/905516886988');assert.equal(bottom.searchParams.get('text'),message);
        console.log('Email/phone detection, international formats, malformed inputs, confirmed CRM responses and WhatsApp message encoding passed');
    } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
})().catch(error=>{console.error(error);process.exitCode=1});
