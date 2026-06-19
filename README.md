# LRFP — Investor Landlord Portfolio Portal

Demonstration prototype for investor landlords, styled to match Lloyds Banking Group branding.

**Live demo:** https://whenfresh-demos.github.io/lrfp/

**Agent / developer reference:** see [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md) for architecture, routes, data model, and conventions.

## Run locally

From this folder, start a simple static server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Demo flow

1. **Log in** — click *Log in* on the sign-in page (no real authentication).
2. **Create portfolio** — give your portfolio a name.
3. **Add properties** — choose **Manual entry** or **Bulk import**:
   - **Manual entry** — enter postcode first, pick from matching addresses, then complete the form. Use *Perfect entry* or *Entry with errors* demo scenarios. Invalid fields are highlighted in red.
   - **Bulk import** — use *Perfect import* (3 clean rows) or *Import with errors* (validation table, import valid rows only).
4. **View summary** — portfolio overview and property table.

## CSV files

| File | Purpose |
|------|---------|
| `assets/portfolio-template.csv` | Empty template with column headers |
| `assets/portfolio-sample-perfect.csv` | 3 valid properties for perfect import demo |
| `assets/portfolio-sample-errors.csv` | 5 rows with missing/invalid data for error handling demo |

### Required columns (portfolio creation)

Title/Ref, Postcode, Property number, Street, City

Additional property details (tenancy, rent, mortgage) can be added later from the portfolio view.

## Publishing to GitHub Pages

The app is static HTML/CSS/JS — enable GitHub Pages on the `main` branch with root `/` as the source.
