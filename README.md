# Cuddle Cub Day Care

One-page static website for a home-based daycare, designed for Azure Static Web Apps hosting with managed HTTPS.

## Files

- `index.html` - one-page website
- `styles.css` - responsive visual design
- `script.js` - enquiry form behavior
- `assets/hero-daycare.png` - generated hero image
- `assets/hero-video.mp4` - optional lightweight hero background video
- `assets/cuddle-cub-logo.png` - circular logo used in the page header
- `assets/rosy-dhiman.jpeg` - owner photo for the bio section
- `staticwebapp.config.json` - Azure Static Web Apps routing and headers
- `api/send-enquiry` - optional Azure Function alternative, not required for the current setup

## Email setup

Azure Static Web Apps hosts the site, but it does not send email directly. The
current form uses FormSubmit, so no Azure Function is required.

Current recipients:

- Main: `rosydhiman2@gmail.com`
- CC: `varundhiman08@gmail.com`

Allowed places to use/test the form:

- The Azure Static Web Apps default URL printed by the GitHub Actions workflow
- `https://cuddlecubdaycare.ca`
- `https://www.cuddlecubdaycare.ca`

To activate:

1. Publish the site to Azure Static Web Apps or `https://cuddlecubdaycare.ca`.
2. Submit one test enquiry.
3. Open the activation email sent to `rosydhiman2@gmail.com`.
4. Click the confirmation link.

After that, new enquiries will be emailed automatically. FormSubmit may also
send the first test submission after confirmation.

FormSubmit does not require domain configuration in this codebase. It will not
work from a direct `file://` browser preview, but it should work from the Azure
Static Web Apps URL and the published domain after activation.

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

## Azure Static Web Apps deployment

### GitHub Actions

This repo includes one GitHub Actions workflow that creates the Azure Static Web
App resource and uploads the website:

- `.github/workflows/deploy-azure-static-web-app.yml`
- `infra/static-web-app.bicep`

Before running it, create an Azure federated credential for GitHub Actions and
add these GitHub repository secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

Then update these workflow values if needed:

- `AZURE_RESOURCE_GROUP`
- `AZURE_LOCATION`
- `AZURE_STATIC_WEB_APP_NAME`

The workflow uses the Azure Static Web Apps Free tier and runs on pushes to
`main`. It can also be started manually from GitHub Actions.

After the first successful deployment, the final workflow step prints the
default HTTPS URL for the site.

### Custom Domain And HTTPS

Azure Static Web Apps creates free managed SSL/TLS certificates for custom
domains.

In Azure Portal:

1. Open the Azure Static Web App resource.
2. Go to **Custom domains**.
3. Add `www.cuddlecubdaycare.ca`.
4. Add the DNS records Azure asks for in GoDaddy.
5. Wait for validation and certificate provisioning.
6. Repeat for `cuddlecubdaycare.ca` if you want the root domain too.

GoDaddy often does not support the best root-domain records directly. If root
domain setup is awkward, use `www.cuddlecubdaycare.ca` as the primary domain and
forward `cuddlecubdaycare.ca` to it.

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
- If you switch back to the optional Azure Function, set `ALLOWED_ORIGIN` to your Azure Static Web Apps URL.
