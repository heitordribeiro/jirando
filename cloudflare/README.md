# Jirando Access Counter

GitHub Pages cannot run server-side code or write files, so the production access counter runs as a Cloudflare Worker on `/api/access`.

The counter is not displayed on the site. To check the access count, open:

```text
https://www.jirando.com/access-count.json
```

## Setup

1. In the Cloudflare dashboard, create a D1 database named `jirando_access_counter`.
2. In GitHub, add these repository secrets:

   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

The API token needs permission to edit Workers and D1 for the `jirando.com` account. The workflow resolves the D1 database ID by name during deployment, so the database must exist in the same Cloudflare account used by `CLOUDFLARE_ACCOUNT_ID`.

## Deploy From GitHub

The repository includes `.github/workflows/deploy-cloudflare-worker.yml` so the Worker can be deployed by GitHub Actions instead of a local machine.

Push changes to `main`, or run the `Deploy Cloudflare Worker` workflow manually from the GitHub Actions tab.

Cloudflare should route `https://www.jirando.com/api/access` and `https://www.jirando.com/access-count.json` to the Worker. The static GitHub Pages site will keep loading normally, and `js/main.js` will register visits through `/api/access`.
