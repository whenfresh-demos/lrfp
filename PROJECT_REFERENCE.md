# LRFP — Project Reference for AI Agents

Use this document when starting a new agent session on the **Lloyds RFP investor landlord portfolio demo**. It captures architecture, conventions, current feature set, and known gaps.

---

## Quick facts

| Item | Value |
|------|-------|
| **Project name** | LRFP (Lloyds RFP prototype) |
| **Purpose** | Branded demo for investor landlords — portfolio creation, summary, property detail |
| **GitHub** | https://github.com/whenfresh-demos/lrfp |
| **Live demo** | https://whenfresh-demos.github.io/lrfp/ |
| **Stack** | Static HTML / CSS / vanilla JS (ES modules, no build step) |
| **Entry point** | `index.html` → `scripts/app.js` |
| **State** | `sessionStorage` key `lrfp-state` |
| **Routing** | Hash-based (`#/login`, `#/portfolio/summary`, etc.) |

---

## Run locally

```bash
cd "/path/to/Lloyds RFP"
python3 -m http.server 8080
```

Open http://localhost:8080 — **must use a local server** (ES modules won't load from `file://`).

---

## User flow

1. **PriceHubble access gate** — enter PIN `777212` (validated in `data.js` → `isAccessCodeValid()`).
2. **LBG login** — click-through only; sets `state.loggedIn = true`.
3. **Dashboard** — create portfolio or view existing.
4. **Portfolio creation** — name portfolio, then manual entry or CSV bulk import.
5. **Portfolio summary** — metrics panel + property table; rows link to property detail.
6. **Property detail** — tabbed view per property (see tabs below).

---

## File structure

```
Lloyds RFP/
├── index.html              # Single-page shell, loads app.js module
├── README.md               # Short user-facing readme
├── PROJECT_REFERENCE.md    # This file — agent onboarding
├── scripts/
│   ├── app.js              # All UI, routing, property tabs, charts
│   └── data.js             # Demo data, validation, AVM enrichment, financials
├── styles/
│   └── main.css            # LBG branding + PH gate + all component styles
├── assets/
│   ├── pricehubble-logo.svg
│   ├── portfolio-template.csv
│   ├── portfolio-sample-perfect.csv
│   ├── portfolio-sample-errors.csv
│   └── portfolio-sample.csv
├── ph/                     # Saved PriceHubble login page (design reference)
└── pp/                     # Saved property page HTML (design reference)
```

**Ignored:** `webpages/` (in `.gitignore`), `node_modules/`, `.env`

---

## Key source files

### `scripts/app.js`

- **Router:** `render()` → hash routes; property routes match `/portfolio/property/:index/:tab`.
- **State:** `state` object from `loadState()` / `saveState()` — fields: `accessGranted`, `loggedIn`, `portfolio`, `draftPortfolio`.
- **Property tabs:** `PROPERTY_TABS` constant (7 tabs).
- **Card layout tabs:** `CARD_LAYOUT_TABS` — overview, financials, risk, esg, market-trends, market-demand use card layout (no hero image).
- **Demo seed:** `propertyDemoSeed(property)` — deterministic fake data from postcode + property number for charts, EPC, risks, market stats.
- **Chart helpers:** `renderSimpleLineChart`, `renderSimpleBarChart`, `renderAnalyticsStats`, `renderTrafficLightRisk`.
- **Financials edit:** modal + `bindFinancialsEdit()`; demo fill via `getDemoFinancials()`.

### `scripts/data.js`

- **Address lookup:** `ADDRESS_LOOKUP` — demo postcodes for autocomplete (e.g. `SW1A 1AA`).
- **AVM enrichment:** `enrichPropertyWithAvm()` adds `avmValue`, `marketRent` when address matches lookup.
- **Validation:** `validateProperty()`, `parseCsvDetailed()` for bulk import.
- **Financials:** `computePropertyFinancials()`, `getDemoFinancials()`, `applyFinancialsToProperty()`.
- **Portfolio metrics:** `computePortfolioMetrics()` — totals for summary panel (AVM, rent, equity, ICR, etc.).
- **Access PIN:** `777212` in `isAccessCodeValid()`.

### `styles/main.css`

- CSS variables: `--lbg-green`, `--lbg-text`, etc.
- Component families: `.access-gate`, `.overview-section`, `.financial-section`, `.risk-traffic-*`, `.esg-epc-*`, `.analytics-chart`, `.analytics-stats`, `.portfolio-table`, `.modal`.

---

## Routes

| Hash route | Screen |
|------------|--------|
| `#/login` | LBG sign-in (click-through) |
| `#/dashboard` | Main dashboard |
| `#/portfolio/create` | Name portfolio + choose add method |
| `#/portfolio/add` | Manual property entry |
| `#/portfolio/upload` | CSV bulk import |
| `#/portfolio/summary` | Portfolio summary table |
| `#/portfolio/summary/add` | Add property from summary |
| `#/portfolio/property/:index/:tab` | Property detail (tab = overview, financials, risk, etc.) |

Default route when unauthenticated: `/login`. Gate shows before any app route.

---

## Property detail tabs

| Tab ID | Label | Status / content |
|--------|-------|------------------|
| `overview` | Property overview | Key info, Rent, Sale sections. No maps. Financial fields removed from Key information. |
| `financials` | Financials | 3-column card: purchase price, current value, value change, market rent range, mortgage, LTV, etc. Only market rent pre-filled; rest show red **!** + **update**. Edit modal + **Fill demo data** button. |
| `risk` | Risk assessment | Traffic-light low/medium/high for: Flood – River Sea, Flood – Surface Water, Chancel Liability, Subsidence, Cladding. |
| `esg` | ESG & Renovation | Current EPC, potential EPC, total improvement cost. |
| `market-trends` | Market trends | Line chart: average asking prices + stats (avg price, % change 3m). Bar chart: listings by asking price band. |
| `neighbourhood` | Neighbourhood | Placeholder — map pin + amenity scores. Not yet redesigned to match overview card style. |
| `market-demand` | Market demand | Four charts: time to sell trend, sales volume by DOM, transaction price evolution, transaction price distribution. |

Tab content rendered in `renderPropertyTabContent()` switch.

---

## Data model

### Property object (core fields)

**Required at creation:** `titleRef`, `postcode`, `propertyNumber`, `street`, `city`

**Optional at creation:** `occupancy`, `rentAgreed`, `mortgageBalance`, `interestRate`, etc.

**Platform-enriched (on add):** `avmValue`, `marketRent` via `enrichPropertyWithAvm()`

**Financials edit (saved to property):** `purchasePrice`, `mortgageBalance`, `interestRate`, `mortgageProvider`, `mortgageEndDate`, `rentAgreed`, `monthlyPayments` (calculated in `applyFinancialsToProperty()`)

### Portfolio object

```js
{
  name: string,
  properties: Property[]
}
```

### Session state

```js
{
  accessGranted: boolean,
  loggedIn: boolean,
  portfolio: Portfolio | null,
  draftPortfolio?: { name, properties }  // during creation flow
}
```

---

## UI patterns

### Missing data indicator

Fields without values show red **!** and an **update** link (financials, portfolio table). Use `hasDisplayValue()` and `renderFinancialOrMissing()` pattern in financials tab.

### Portfolio summary table

Columns: Ref, Address, AVM, Market rent, Rent agreed, Occupancy, Mortgage payments, Interest rate. Click row → property overview.

### Metrics panel

Top of summary: aggregated AVM, market rent, rent agreed, equity, ICR, etc. from `computePortfolioMetrics()`.

### Design references

- `ph/` — PriceHubble Demo Centre gate styling reference
- `pp/` — Property page layout reference (saved HTML)
- Screenshots may also exist locally under `pp/` (e.g. `financials.png`, `property overview.png`) for layout matching

---

## Demo helpers

| Helper | Location | Purpose |
|--------|----------|---------|
| `DEMO_MANUAL_PERFECT` | data.js | Pre-fill valid manual entry |
| `DEMO_MANUAL_IMPERFECT` | data.js | Pre-fill entry with validation errors |
| `portfolio-sample-perfect.csv` | assets | 3 clean CSV rows |
| `portfolio-sample-errors.csv` | assets | Rows with validation errors |
| `getDemoFinancials(property)` | data.js | Fill financials tab demo values |
| `propertyDemoSeed(property)` | app.js | Seed charts/risks/EPC from address |

---

## Chart implementation

Charts are **inline SVG** generated in JS — no Chart.js or external library.

- `renderSimpleLineChart(points, { width, height })` — points: `{ label, value }[]`
- `renderSimpleBarChart(bars, { width, height })` — bars: `{ label, value }[]`
- Styled via `.analytics-chart__*` classes in `main.css`

---

## Branding

- **LBG portal:** Poppins font, green `#00864f`, LBG logo inline SVG in `app.js` (`LBG_LOGO`)
- **PH gate:** Separate `.access-gate` styles, PriceHubble logo from `assets/pricehubble-logo.svg`

---

## Publishing

GitHub Pages: enable on `main`, source `/` (root). Static files only — no build.

```bash
git push origin main
```

---

## Known gaps / future work

1. **Neighbourhood tab** — still old placeholder layout; not converted to overview card style.
2. **No real backend** — all data is client-side demo; AVM/rent from hardcoded lookup.
3. **No real auth** — gate PIN + click-through login only.
4. **Maps removed** from property overview per user request.
5. **Financials** — only market rent from platform at add time; user must edit or use demo fill for rest.

---

## Common tasks for agents

### Add a property tab field
1. Extend `propertyDemoSeed()` or property model in `data.js` if persisted.
2. Add render function or extend existing tab renderer in `app.js`.
3. Add CSS in `main.css`.
4. If card layout, ensure tab ID is in `CARD_LAYOUT_TABS`.

### Change portfolio table columns
1. Update `renderSummary()` table headers/cells in `app.js`.
2. Update `computePortfolioMetrics()` if aggregated.

### Change access PIN
1. Edit `isAccessCodeValid()` in `data.js` — array `[7,7,7,2,1,2]`.

### Fix blank page
- Check browser console for JS errors (common cause: duplicate function definitions, template literal evaluating `.toFixed()` on null).
- Ensure serving via HTTP, not file protocol.

---

## Git

```bash
git remote -v   # origin → https://github.com/whenfresh-demos/lrfp.git
git branch      # main
```

Commit only when the user asks. Do not put the access PIN in public README if sharing externally (it's in code for demo purposes).

---

## Conversation context

This prototype was built iteratively for a **Lloyds Banking Group RFP** demo, integrating **PriceHubble**-style property intelligence (AVM, rent, market analytics) in a landlord portfolio UI. Prior agent transcript may exist in Cursor agent history for this workspace if deeper change history is needed.
