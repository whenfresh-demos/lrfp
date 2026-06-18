# LRFP — Investor Landlord Portfolio Portal

Demonstration prototype for investor landlords, styled to match Lloyds Banking Group branding.

**Live demo:** https://jakesales.github.io/lrfp/

## Run locally

From this folder, start a simple static server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Demo flow

1. **Log in** — click *Log in* on the sign-in page (no real authentication).
2. **Create portfolio** — give your portfolio a name.
3. **Add properties** — either:
   - **One at a time** — use *Fill with demo data* to autocomplete all fields instantly.
   - **Bulk CSV** — download the template, or click *Load sample CSV* to import 5 demo properties.
4. **View summary** — see your portfolio dashboard with property table and totals.

## CSV files

| File | Purpose |
|------|---------|
| `assets/portfolio-template.csv` | Empty template with column headers |
| `assets/portfolio-sample.csv` | 5 sample properties for demo import |

### Required columns

Title/Ref, Postcode, Property number, Street, City

### Optional columns

Tenancy status, Start date, Monthly rent, Mortgage provider, Product type, Mortgage end date, Mortgage balance, Payment type, Monthly payments

## Publishing to GitHub Pages

The app is static HTML/CSS/JS — enable GitHub Pages on the `main` branch with root `/` as the source.
