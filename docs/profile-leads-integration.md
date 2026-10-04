# Company profile lead capture

The download dialog is implemented, but remains disabled until a working CRM receiver is provided. Direct downloads stay available while `src/config/profile-leads.json` has an empty endpoint. Set `endpoint` to the HTTPS URL of a public, rate-limited server endpoint after verifying it against the CRM. Never put a CRM API token in this JSON or the browser bundle.

Both buttons use one form. Email or phone is detected automatically. Local phone numbers use the selected country (default Türkiye); explicit + or 00 international prefixes are parsed without guessing local digits as country codes. Phones are submitted as E.164. Email domain casing is normalized. Marketing permission is optional and starts unchecked.

The receiver accepts POST JSON:

```json
{
  "contact": { "type": "phone", "value": "+905516886988", "country": "TR" },
  "language": "ar",
  "source": "hero",
  "marketingConsent": false,
  "requestId": "UUID",
  "purpose": "company_profile_download"
}
```

Email contacts instead contain `type: "email"` and `value`. Source is `hero` or `contact_cta`. The receiver must validate inputs, enforce limits, save the lead durably, preserve permission and purpose, and deduplicate retries using `requestId`. It must return HTTP 2xx JSON `{ "ok": true }` only after saving; other responses show an error and do not download. Requests time out after 15 seconds. No contact data is placed in URLs, analytics events or local storage; the dialog is explicitly masked for Clarity.

For cross-origin receivers, allow only the actual site origins and POST/Content-Type in CORS. Keep CRM credentials on the receiver server. No email is sent or verified by the current flow, and the PDF is not personalized. Sending email and personalizing it are future work.

The bottom WhatsApp CTA contains a translated prefilled message. It identifies the clicked CTA, not proof that the visitor read all sections. WhatsApp requires the visitor to send the message themselves.
