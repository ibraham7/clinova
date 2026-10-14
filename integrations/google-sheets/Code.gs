// Google Apps Script bound to a private spreadsheet. Run setupClinovaLeads once.
var CLINOVA_TIME_ZONE = 'Europe/Istanbul';
var CLINOVA_SHEET = 'Clinova Leads';
var CLINOVA_HEADERS = ['وقت الحفظ UTC', 'وقت الحفظ المحلي', 'المنطقة الزمنية', 'نوع التواصل', 'الإيميل أو الهاتف', 'الدولة', 'لغة الموقع', 'مكان الزر', 'موافقة التواصل التسويقي', 'معرّف الطلب'];
// Trial survey answers land in their own sheet, created automatically on the first submission.
var CLINOVA_SURVEY_SHEET = 'Clinova Survey';
var CLINOVA_SURVEY_HEADERS = ['وقت الحفظ UTC', 'وقت الحفظ المحلي', 'المنطقة الزمنية', 'نوع التواصل', 'الإيميل أو الهاتف', 'الدولة', 'لغة الموقع', 'التخصص', 'المرضى الجدد شهريًا', 'إدارة المواعيد', 'الحاجة الأهم', 'المشكلة التي يريد حلها', 'موافقة التواصل التسويقي', 'معرّف الطلب'];
var CLINOVA_SURVEY_FIELDS = ['specialty', 'patients', 'workflow', 'need', 'wish'];

function setupClinovaLeads() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open this script from the imported Clinova Leads spreadsheet.');
  PropertiesService.getScriptProperties().setProperty('CLINOVA_SPREADSHEET_ID', book.getId());
  book.setSpreadsheetTimeZone(CLINOVA_TIME_ZONE);
  var sheet = book.getSheetByName(CLINOVA_SHEET);
  if (!sheet) throw new Error('Import Clinova-Leads.xlsx before setup.');
  if (!sheet.getLastRow()) sheet.getRange(1, 1, 1, CLINOVA_HEADERS.length).setValues([CLINOVA_HEADERS]);
  sheet.setFrozenRows(1);
  Logger.log(book.getUrl());
}

function clinovaJson(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  // Health only: no contact data can be read through the public web app.
  return clinovaJson({ ok: true, service: 'clinova-profile-leads' });
}
function validClinovaSurvey(answers) {
  if (!answers || typeof answers !== 'object') return false;
  for (var i = 0; i < CLINOVA_SURVEY_FIELDS.length; i++) {
    var answer = answers[CLINOVA_SURVEY_FIELDS[i]];
    var limit = CLINOVA_SURVEY_FIELDS[i] === 'wish' ? 500 : 120;
    if (answer !== undefined && (typeof answer !== 'string' || answer.length > limit)) return false;
    if (CLINOVA_SURVEY_FIELDS[i] !== 'wish' && !answer) return false;
  }
  return true;
}
function validClinovaLead(p) {
  if (!p || ['company_profile_download', 'trial_survey'].indexOf(p.purpose) < 0 || !p.contact || typeof p.contact.value !== 'string') return false;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(p.requestId || '')) return false;
  if (typeof p.marketingConsent !== 'boolean' || ['ar','en','tr','fr'].indexOf(p.language) < 0) return false;
  if (p.purpose === 'trial_survey' ? !validClinovaSurvey(p.answers) : ['hero','contact_cta'].indexOf(p.source) < 0) return false;
  if (p.contact.country && !/^[A-Z]{2}$/.test(p.contact.country)) return false;
  var value = p.contact.value;
  if (p.contact.type === 'email') return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return p.contact.type === 'phone' && /^\+[1-9]\d{6,14}$/.test(value);
}
function clinovaCell(value) {
  var text = String(value || '');
  // Preserve +phone numbers as text and prevent user-controlled formulas.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function clinovaRow(p, receivedAt) {
  return [receivedAt.toISOString(), receivedAt, CLINOVA_TIME_ZONE,
    p.contact.type, clinovaCell(p.contact.value), p.contact.country || '', p.language, p.source,
    p.marketingConsent ? 'نعم' : 'لا', p.requestId];
}
function clinovaSurveyRow(p, receivedAt) {
  var row = [receivedAt.toISOString(), receivedAt, CLINOVA_TIME_ZONE,
    p.contact.type, clinovaCell(p.contact.value), p.contact.country || '', p.language];
  CLINOVA_SURVEY_FIELDS.forEach(function (field) { row.push(clinovaCell(p.answers[field])); });
  return row.concat([p.marketingConsent ? 'نعم' : 'لا', p.requestId]);
}
function clinovaSurveySheet(book) {
  var sheet = book.getSheetByName(CLINOVA_SURVEY_SHEET);
  if (!sheet) {
    sheet = book.insertSheet(CLINOVA_SURVEY_SHEET);
    sheet.getRange(1, 1, 1, CLINOVA_SURVEY_HEADERS.length).setValues([CLINOVA_SURVEY_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function doPost(e) {
  var receivedAt = new Date();
  var lock = null;
  try {
    if (!e || !e.postData || e.postData.contents.length > 4096) return clinovaJson({ ok: false, error: 'invalid_request' });
    var lead = JSON.parse(e.postData.contents);
    if (!validClinovaLead(lead)) return clinovaJson({ ok: false, error: 'invalid_contact' });
    var id = PropertiesService.getScriptProperties().getProperty('CLINOVA_SPREADSHEET_ID');
    if (!id) return clinovaJson({ ok: false, error: 'not_configured' });
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return clinovaJson({ ok: false, error: 'busy' });
    var book = SpreadsheetApp.openById(id);
    book.setSpreadsheetTimeZone(CLINOVA_TIME_ZONE);
    var surveyLead = lead.purpose === 'trial_survey';
    var sheet = surveyLead ? clinovaSurveySheet(book) : book.getSheetByName(CLINOVA_SHEET);
    var headers = surveyLead ? CLINOVA_SURVEY_HEADERS : CLINOVA_HEADERS;
    var idColumn = headers.length;
    if (!sheet || sheet.getRange(1, idColumn).getValue() !== headers[idColumn - 1]) return clinovaJson({ ok: false, error: 'sheet_not_ready' });
    var last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2, idColumn, last - 1, 1).createTextFinder(lead.requestId).matchEntireCell(true).findNext()) {
      return clinovaJson({ ok: true, duplicate: true });
    }
    var row = surveyLead ? clinovaSurveyRow(lead, receivedAt) : clinovaRow(lead, receivedAt);
    sheet.getRange(last + 1, 1, 1, row.length).setNumberFormat('@').setValues([row]);
    sheet.getRange(last + 1, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss "+03:00"');
    SpreadsheetApp.flush();
    return clinovaJson({ ok: true });
  } catch (err) {
    // Do not log the submitted email or phone.
    return clinovaJson({ ok: false, error: 'save_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
