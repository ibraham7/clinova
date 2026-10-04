const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rows=[];let failWrite=false;let locked=false;let configured=true;let busy=false;
const sheet={getLastRow:()=>rows.length+1,getRange:(row,col,count,width)=>({
 getValue:()=>ctx.CLINOVA_HEADERS[9],
 createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.some(r=>r[9]===id)?{}:null})}),
 setNumberFormat(){return this},
 setValues(values){if(failWrite)throw Error('write failed');rows.push(...values);return this}
})};
const ctx={Date,JSON,Utilities:{formatDate(date,zone,format){assert.equal(zone,'Europe/Istanbul');assert.equal(format,'yyyy-MM-dd HH:mm:ss Z');const p=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,dateStyle:'short',timeStyle:'medium'}).format(date);return p+' +0300'}},
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>configured?'test-sheet-id':null})},
 LockService:{getScriptLock:()=>({tryLock:()=>{locked=!busy;return !busy},hasLock:()=>locked,releaseLock:()=>{locked=false}})},
 SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet,setSpreadsheetTimeZone:zone=>assert.equal(zone,'Europe/Istanbul')}),flush(){}},
 ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}
};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('integrations/google-sheets/Code.gs','utf8'),ctx);
const lead={contact:{type:'phone',value:'+905516886988',country:'TR'},language:'ar',source:'hero',marketingConsent:false,requestId:'00000000-0000-4000-8000-000000000001',purpose:'company_profile_download'};
const post=p=>ctx.doPost({postData:{contents:JSON.stringify(p)}});
assert.equal(ctx.doGet().service,'clinova-profile-leads');
assert.equal(post(lead).ok,true);assert.equal(rows.length,1);assert.equal(locked,false);
assert.equal(rows[0][2],'Europe/Istanbul');assert.equal(rows[0][4],"'+905516886988");assert.equal(rows[0][8],'لا');
assert.equal(rows[0][1].toISOString(),rows[0][0]);
const sample=ctx.clinovaRow(lead,new Date('2026-10-04T22:00:00Z'));
const local=new Intl.DateTimeFormat('sv-SE',{timeZone:sample[2],dateStyle:'short',timeStyle:'medium'}).format(sample[1]);
assert.ok(local.startsWith('2026-10-05 01:00:00'),'Istanbul rollover after midnight');assert.ok(!Number.isNaN(Date.parse(rows[0][0])));
assert.equal(post(lead).duplicate,true);assert.equal(rows.length,1,'Retry must not duplicate');
const email={...lead,contact:{type:'email',value:'test@example.com'},source:'contact_cta',marketingConsent:true,requestId:'00000000-0000-4000-8000-000000000002'};
assert.equal(post(email).ok,true);assert.equal(rows.length,2);assert.equal(rows[1][8],'نعم');assert.equal(rows[1][7],'contact_cta');
for(const change of [{purpose:'other'},{requestId:'invalid'},{marketingConsent:'true'},{source:'other'},{language:'xx'},{contact:{type:'email',value:'bad@'}},{contact:{type:'phone',value:'5516886988'}}])assert.equal(post({...lead,...change}).ok,false);
assert.equal(ctx.doPost({postData:{contents:'invalid json'}}).ok,false);
assert.equal(ctx.clinovaCell('=formula'),"'=formula");
assert.equal(ctx.clinovaCell('+number'),"'+number");
failWrite=true;assert.equal(post({...email,requestId:'00000000-0000-4000-8000-000000000003'}).ok,false);assert.equal(locked,false);failWrite=false;
configured=false;assert.equal(post(lead).error,'not_configured');configured=true;
busy=true;assert.equal(post(lead).error,'busy');
assert.equal(rows.length,2);
console.log('Sheets receiver validation, UTC/Istanbul timestamps, text phone values, consent, retry deduplication and write failures passed (mock Google services)');
