const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rows=[];let failWrite=false;let locked=false;let configured=true;let busy=false;
const sheet={getLastRow:()=>rows.length+1,getRange:(row,col,count,width)=>({
 getValue:()=>ctx.CLINOVA_HEADERS[9],
 createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.some(r=>r[9]===id)?{}:null})}),
 setNumberFormat(){return this},
 setValues(values){if(failWrite)throw Error('write failed');rows.push(...values);return this}
})};
// The trial survey writes to its own sheet, created on first use.
const surveyRows=[];let surveyHeaders=null;let surveyCreated=false;
const surveySheet={getLastRow:()=>surveyRows.length+1,setFrozenRows(){},getRange:(row)=>({
 getValue:()=>surveyHeaders&&surveyHeaders[13],
 createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>surveyRows.some(r=>r[13]===id)?{}:null})}),
 setNumberFormat(){return this},
 setValues(values){if(row===1)surveyHeaders=values[0];else surveyRows.push(...values);return this}
})};
const ctx={Date,JSON,Utilities:{formatDate(date,zone,format){assert.equal(zone,'Europe/Istanbul');assert.equal(format,'yyyy-MM-dd HH:mm:ss Z');const p=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,dateStyle:'short',timeStyle:'medium'}).format(date);return p+' +0300'}},
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>configured?'test-sheet-id':null})},
 LockService:{getScriptLock:()=>({tryLock:()=>{locked=!busy;return !busy},hasLock:()=>locked,releaseLock:()=>{locked=false}})},
 SpreadsheetApp:{openById:()=>({getSheetByName:name=>name===ctx.CLINOVA_SHEET?sheet:surveyCreated?surveySheet:null,insertSheet:()=>{surveyCreated=true;return surveySheet},setSpreadsheetTimeZone:zone=>assert.equal(zone,'Europe/Istanbul')}),flush(){}},
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
busy=false;
const answers={specialty:'طب الأسنان',patients:'أقل من 50 مريضًا',workflow:'لا توجد طريقة ثابتة',need:'مرضى جدد أكثر',wish:'=HYPERLINK("x")'};
const surveyLead={contact:{type:'email',value:'clinic@example.com'},language:'tr',marketingConsent:true,requestId:'00000000-0000-4000-8000-000000000010',purpose:'trial_survey',answers};
assert.equal(post(surveyLead).ok,true);assert.equal(surveyCreated,true);assert.equal(surveyHeaders.length,14);assert.equal(surveyRows.length,1);
assert.equal(surveyRows[0][7],'طب الأسنان');assert.equal(surveyRows[0][11],"'=HYPERLINK(\"x\")");assert.equal(surveyRows[0][12],'نعم');assert.equal(surveyRows[0][13],surveyLead.requestId);
assert.equal(post(surveyLead).duplicate,true);assert.equal(surveyRows.length,1,'Survey retry must not duplicate');
const {wish,...noWish}=answers;assert.ok(wish);
assert.equal(post({...surveyLead,answers:noWish,requestId:'00000000-0000-4000-8000-000000000011'}).ok,true);assert.equal(surveyRows[1][11],'');
for(const change of [{answers:{...answers,need:''}},{answers:{...answers,wish:'x'.repeat(501)}},{answers:null}])assert.equal(post({...surveyLead,...change,requestId:'00000000-0000-4000-8000-000000000012'}).ok,false);
assert.equal(rows.length,2,'Survey answers stay out of the profile sheet');
console.log('Sheets receiver validation, UTC/Istanbul timestamps, text phone values, consent, retry deduplication, write failures and trial survey sheet passed (mock Google services)');
