# Jirando Access Counter

GitHub Pages cannot run server-side code or write files, so the production access counter runs as a Cloudflare Worker on `/api/access`.

The counter is not displayed on the site. To check the access count, open:

```text
https://www.jirando.com/access-count.json
```

The JSON includes:

- `total`: counted visits across the site.
- `lastAccessedAt`: last counted access time.

A visit is counted only when the IP is new or when the same IP accesses the site at least 24 hours after its previous counted access. IPs are stored internally for deduplication, but they are not exposed by the public JSON endpoint. Switching from one language page to another within that 24-hour window does not increment `total`.

## Setup

1. In the Cloudflare dashboard, create a D1 database named `jirando_access_counter`.
2. In GitHub, add these repository secrets:

   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

`CLOUDFLARE_API_TOKEN` must be the token value, not the token name or token ID. Create a custom token with these permissions scoped to the account/zone that owns `jirando.com`:

- Account > Cloudflare Workers Scripts > Edit
- Account > D1 > Edit
- Zone > Zone > Read
- Zone > Workers Routes > Edit

`CLOUDFLARE_ACCOUNT_ID` must be the account ID from the same Cloudflare account where the D1 database exists. The workflow resolves the D1 database ID by name during deployment, so the database must exist in that account.

## Deploy From GitHub

The repository includes `.github/workflows/deploy-cloudflare-worker.yml` so the Worker can be deployed by GitHub Actions instead of a local machine.

Push changes to `main`, or run the `Deploy Cloudflare Worker` workflow manually from the GitHub Actions tab.

Cloudflare should route `https://www.jirando.com/api/access` and `https://www.jirando.com/access-count.json` to the Worker. The static GitHub Pages site will keep loading normally, and `js/main.js` will register visits through `/api/access`.
