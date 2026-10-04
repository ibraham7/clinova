// Google Apps Script bound to a private spreadsheet. Run setupClinovaLeads once.
var CLINOVA_TIME_ZONE = 'Europe/Istanbul';
var CLINOVA_SHEET = 'Clinova Leads';
var CLINOVA_HEADERS = ['وقت الحفظ UTC', 'وقت الحفظ المحلي', 'المنطقة الزمنية', 'نوع التواصل', 'الإيميل أو الهاتف', 'الدولة', 'لغة الموقع', 'مكان الزر', 'موافقة التواصل التسويقي', 'معرّف الطلب'];

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
function validClinovaLead(p) {
  if (!p || p.purpose !== 'company_profile_download' || !p.contact || typeof p.contact.value !== 'string') return false;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(p.requestId || '')) return false;
  if (typeof p.marketingConsent !== 'boolean' || ['ar','en','tr','fr'].indexOf(p.language) < 0 || ['hero','contact_cta'].indexOf(p.source) < 0) return false;
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
    var sheet = book.getSheetByName(CLINOVA_SHEET);
    if (!sheet || sheet.getRange(1, 10).getValue() !== CLINOVA_HEADERS[9]) return clinovaJson({ ok: false, error: 'sheet_not_ready' });
    var last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2, 10, last - 1, 1).createTextFinder(lead.requestId).matchEntireCell(true).findNext()) {
      return clinovaJson({ ok: true, duplicate: true });
    }
    var row = clinovaRow(lead, receivedAt);
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
