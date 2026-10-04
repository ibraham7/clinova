# Google Sheets pilot receiver

This alternative receiver writes profile-download contacts into a private Google spreadsheet. It needs one Google account authorization and a Web App deployment; the repository alone cannot grant Google access.

1. Import `Clinova-Leads.xlsx` as a private native Google spreadsheet using the Google Drive plugin. Then open **Extensions → Apps Script**.
2. Paste `Code.gs` and run `setupClinovaLeads` once. Authorize access to that spreadsheet.
3. Deploy → New deployment → Web app; execute as the owner and allow public submissions (Anyone). This publishes the receiver, not the private spreadsheet. Google Workspace policies may restrict this option.
4. Copy the Web App URL ending in `/exec` into `src/config/profile-leads.json` under `endpoint`. Use the deployment URL, not the editor URL or `/dev` URL.
5. Redeploy the website and test an actual email/phone submission. Confirm the matching row is present and the browser received `{ "ok": true }` before enabling collection for visitors. Browser access to the redirected Google response must be verified; never use `no-cors` to pretend a failed/unconfirmed write succeeded.
6. When changing the Apps Script, update the deployment version. Move to the final CRM when chosen.

Columns: server receipt time as UTC ISO, sortable local receipt date/time displayed with +03:00 offset, `Europe/Istanbul`, contact type, email or E.164 phone, country, website language, button source, optional marketing permission and idempotency request UUID. Receipt time comes from the Apps Script server, not the visitor clock. Phone strings retain the + sign. Repeated POSTs with the same UUID return success without duplicate rows. Distinct requests remain distinct even for the same contact, so source and consent are not lost.

The endpoint never exposes saved contact data. JSON validation, locking, retry deduplication, text formatting and formula escaping are built in. The receiver is a public intake endpoint suitable for a low-volume pilot; Google execution limits apply. Connecting Drive may help create/manage the sheet, but it does not automatically deploy Apps Script or create a permanent site-to-Google authorization.

Official documentation:
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/content
- https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)
