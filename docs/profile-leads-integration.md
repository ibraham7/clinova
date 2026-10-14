# Company profile lead capture

A Google Sheets pilot receiver is prepared under `integrations/google-sheets/`. It records authoritative server receipt times in UTC and Europe/Istanbul. The deployed receiver is connected and public POST requests are enabled.

The browser posts to the same-origin `/.netlify/functions/profile-lead` Netlify function. The function validates the body, forwards it to the configured Google Apps Script receiver, and follows Google's one-time response redirect on the server. It retries one transient network/404/408/429/5xx or busy/save failure with the same request UUID, which the Sheets receiver deduplicates under a lock. Each upstream attempt has a 24-second limit; the browser waits up to 55 seconds. Neither layer reports success before Sheets confirms the write. No contact data is logged or included in URLs. The private sheet and Google authorization remain unchanged.

`src/config/profile-leads.json` contains the public Apps Script deployment URL, not a credential. A configured HTTPS receiver enables the download form. Netlify automatically builds the function from `netlify/functions/profile-lead.mjs`; the default function route is outside the four language rewrites.

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

Email contacts instead contain `type: "email"` and `value`. Source is `hero` or `contact_cta`. The receiver must validate inputs, enforce limits, save the lead durably, preserve permission and purpose, and deduplicate retries using `requestId`. It must return HTTP 2xx JSON `{ "ok": true }` only after saving; other responses show an error and do not download. The browser times out after 55 seconds. No contact data is placed in URLs, analytics events or local storage; the dialog is explicitly masked for Clarity.

For cross-origin receivers, allow only the actual site origins and POST/Content-Type in CORS. Keep CRM credentials on the receiver server. No email is sent or verified by the current flow, and the PDF is not personalized. Sending email and personalizing it are future work.

The bottom WhatsApp CTA contains a translated prefilled message. It identifies the clicked CTA, not proof that the visitor read all sections. WhatsApp requires the visitor to send the message themselves.

## Trial survey popup

After one minute of visible browsing, a small popup offers a 7-day free trial in exchange for 5 short answers (`src/config/survey.json`) and an email or phone. Dismissing it hides it for 3 days; submitting it hides it for good. Add `?survey` to any page URL to open it after 1.5 seconds for review.

It posts to the same `/.netlify/functions/profile-lead` function with `purpose: "trial_survey"` and an `answers` object. The function only accepts listed options, plus optional free text up to 500 characters. `Code.gs` writes these rows to a separate **Clinova Survey** sheet, created on the first submission. After updating `Code.gs` in Apps Script, deploy a new version of the existing Web App deployment (Deploy → Manage deployments → Edit → New version) so the URL stays the same. Until then, survey submissions show the save error.

## Client reviews

`src/config/clientReviews.ts` holds real client reviews, published with each client's permission. The section's average rating and review count are calculated from this list. While it is empty, the production site hides the section and its footer link. Netlify deploy previews and local builds show clearly marked placeholder cards instead, so the layout can be reviewed.
