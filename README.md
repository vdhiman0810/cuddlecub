# Cuddle Cub Day Care

One-page static website for a home-based daycare, designed for Azure Storage static website hosting.

## Files

- `index.html` - one-page website
- `styles.css` - responsive visual design
- `script.js` - enquiry form behavior
- `assets/hero-daycare.png` - generated hero image
- `assets/hero-video.mp4` - optional lightweight hero background video
- `assets/cuddle-cub-logo.png` - circular logo used in the page header
- `assets/rosy-dhiman.jpeg` - owner photo for the bio section
- `api/send-enquiry` - optional Azure Function alternative, not required for the current setup

## Email setup

Azure Storage can host static files, but it cannot send email directly. The
current form uses FormSubmit, so no Azure Function is required.

Current recipients:

- Main: `rosydhiman2@gmail.com`
- CC: `varundhiman08@gmail.com`

Allowed places to use/test the form:

- `https://cuddlecubdaycareweb.z9.web.core.windows.net`
- `https://cuddlecubdaycare.ca`
- `https://www.cuddlecubdaycare.ca`

To activate:

1. Publish the site to the Azure Storage static website endpoint or `https://cuddlecubdaycare.ca`.
2. Submit one test enquiry.
3. Open the activation email sent to `rosydhiman2@gmail.com`.
4. Click the confirmation link.

After that, new enquiries will be emailed automatically. FormSubmit may also
send the first test submission after confirmation.

FormSubmit does not require domain configuration in this codebase. It will not
work from a direct `file://` browser preview, but it should work from the Azure
website endpoint and the published domain after activation.

The form endpoint is configured in `script.js`:

```js
const FORM_ENDPOINT = "https://formsubmit.co/ajax/rosydhiman2@gmail.com";
```

If you later want a private random endpoint instead of exposing the email
address in the form endpoint, use the random string FormSubmit provides after
confirmation and replace the email portion of the URL.

## Optional Azure Function alternative

If you later prefer to own the email infrastructure, deploy the included Azure
Function and set `FORM_ENDPOINT` in `script.js` to the function URL.

For the included Azure Function, configure these app settings:

- `ACS_CONNECTION_STRING`
- `ACS_SENDER_ADDRESS`
- `ENQUIRY_RECIPIENT_EMAIL` - set to `rosydhiman2@gmail.com,varundhiman08@gmail.com`
- `ALLOWED_ORIGIN`

The function uses Azure Communication Services Email.

After deploying the function, copy its public URL into `FORM_ENDPOINT` in
`script.js`, replacing the FormSubmit URL.

## Azure Storage static website deployment

### GitHub Actions

This repo includes one GitHub Actions workflow that creates the Azure Storage
account and uploads the website:

- `.github/workflows/deploy-azure-storage.yml`
- `infra/main.bicep`

Before running it, create an Azure federated credential for GitHub Actions and
add these GitHub repository secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

Then update these workflow values if needed:

- `AZURE_RESOURCE_GROUP`
- `AZURE_LOCATION`
- `AZURE_STORAGE_ACCOUNT`

Important: `AZURE_STORAGE_ACCOUNT` must be globally unique, lowercase, 3-24
characters, and contain only letters and numbers.

The workflow runs on pushes to `main` and can also be started manually from
GitHub Actions.

Manual run modes:

- `deploy_infrastructure: false` updates website files only. Use this after the
  storage account already exists.
- `deploy_infrastructure: true` creates/updates the resource group, storage
  account, static website setting, and website files.

Pushes to `main` update website files only. To create or update Azure resources,
run the workflow manually with `deploy_infrastructure: true`.

### Manual

1. In your Azure Storage account, enable **Static website**.
2. Set the index document name to `index.html`.
3. Upload these files to the `$web` container:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/hero-daycare.png`
   - `assets/hero-video.mp4` if you add a video
   - `assets/cuddle-cub-logo.png`
   - `assets/rosy-dhiman.jpeg`
4. Open the static website primary endpoint shown by Azure.
5. Point `cuddlecubdaycare.ca` and `www.cuddlecubdaycare.ca` to the Azure static website endpoint.

## Hero video

The page is already wired to use `assets/hero-video.mp4` as a muted looping
hero background. Keep the file short, ideally 8-15 seconds, compressed to 720p
or 1080p, and under about 5 MB. The existing `assets/hero-daycare.png` remains
the poster and fallback image.

Good sources to search:

- Pexels: `daycare`, `playroom`, or `kids playing in the playroom`
- Pixabay: `children playing`, `playroom`, or `childcare`
- Coverr: `daycare`, `playroom`, or `children`

## Before publishing

- Add fees, licensing details, or other policies if you want them published.
- Submit one test enquiry from `https://cuddlecubdaycare.ca` and confirm the FormSubmit activation email.
- If you switch back to the optional Azure Function, set `ALLOWED_ORIGIN` to your Azure Storage static website URL.
