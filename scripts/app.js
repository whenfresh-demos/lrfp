import {
  DEMO_PROPERTY,
  DEMO_MANUAL_PERFECT,
  DEMO_MANUAL_IMPERFECT,
  FIELD_LABELS,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
  parseCsvDetailed,
  validateImportRows,
  searchAddressesByPostcode,
  validateProperty,
  formatAddress,
  formatCurrency,
  formatPercent,
  formatInterestRate,
  hasDisplayValue,
  computePortfolioMetrics,
  enrichPropertyWithAvm,
  enrichProperties,
  computePropertyFinancials,
  getMarketRentRange,
  formatMortgageExpiry,
  formatPurchaseDate,
  ensurePropertyFinancialBasics,
  isHmoProperty,
  getDemoFinancials,
  applyFinancialsToProperty,
  getPropertyTenancies,
  getAchievedRentTotal,
  syncAchievedRentFromTenancies,
  getMortgageProductType,
  getDemoTenancies,
  getDemoSingleTenancy,
  applyFinancialDemoScenario,
  MORTGAGE_PRODUCT_TYPES,
  TENANCY_AGREEMENT_TYPES,
  getQualifiedMarketplaceListings,
  filterMarketplaceByEpc,
  isCompliantEpcRating,
  getPortfolioMarketOpportunities,
  getMarketplaceListingById,
  buildMortgageQuote,
  buildRefinanceQuote,
  buildRentReviewQuote,
  buildEpcImprovementQuote,
  computePortfolioMetricsAfterEpcImprovement,
  getPortfolioEpcImprovementOpportunities,
  hasEpcImprovementOpportunity,
  getPropertyEpcDetails,
  ensurePropertyEpcBasics,
  computePortfolioMetricsAfterPurchase,
  computePortfolioMetricsAfterRefinance,
  computePortfolioMetricsAfterRentReview,
  getPortfolioRefinanceOpportunities,
  getPortfolioRentReviewOpportunities,
  hasCompletedMortgageDetails,
  hasRefinanceOpportunity,
  hasRentReviewOpportunity,
  getCurrentBestMortgageRate,
  REFINANCE_RATE_THRESHOLD,
  RENT_REVIEW_GAP_THRESHOLD,
  OPPORTUNITY_EQUITY_THRESHOLD,
  MARKETPLACE_MAX_ASKING_PRICE,
  loadState,
  saveState,
  isAccessCodeValid,
} from './data.js';

const PAGE_TITLES = {
  gate: 'PriceHubble Demo Centre',
  app: 'Investor Landlord Portal — Lloyds Banking Group',
};

const PROPERTY_TABS = [
  { id: 'overview', label: 'Property overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'risk', label: 'Risk assessment' },
  { id: 'esg', label: 'ESG & Renovation' },
  { id: 'market-trends', label: 'Market trends' },
  { id: 'market-demand', label: 'Market demand' },
];

const app = document.getElementById('app');
let manualEntryErrors = {};
let manualEntryDraft = {};
let pendingBulkImport = null;
let marketplaceEpcFilter = 'all';

const LBG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" height="40" viewBox="0 0 180 50" width="144">
<g>
<path d="M12.4865 48.6864L11.4788 47.9726C11.0445 42.8716 9.46354 39.7901 8.61225 38.1884C9.51566 37.5965 11.0097 36.2212 11.0097 34.2539C11.0097 32.2866 9.41142 31.2421 9.41142 28.8047C9.41142 27.4642 9.86312 26.3326 10.6102 25.4621C10.1237 24.7657 9.5504 24.4001 8.71649 24.4001C7.77834 24.4001 6.92706 25.1836 6.92706 26.3674C6.92706 27.0638 7.2224 27.8298 7.88258 28.1606C7.4135 28.8047 6.21476 28.8744 5.55458 27.8995H5.5372C5.5372 30.2323 8.00419 31.8514 8.00419 34.3235C8.00419 35.9252 6.73595 37.4747 4.8944 37.4747C3.52192 37.4747 2.23631 36.8305 1.57613 35.5596C3.07022 35.9426 4.14735 35.3507 4.14735 34.0276C4.14735 31.6077 0.134155 29.2574 0.134155 25.1488C0.134155 21.928 2.60114 20.1348 5.43297 20.1348C8.00419 20.1348 10.2974 21.3187 12.0174 24.3131C12.9034 23.6515 13.9806 23.2685 15.0751 23.0596C18.0111 22.4851 21.6247 23.0074 24.3871 21.8235C25.6206 21.3013 26.6456 20.3611 26.6456 19.2992C26.6456 18.7943 26.3502 18.4809 25.9333 18.4809C25.7248 18.4809 25.4121 18.5854 25.221 19.038C24.6824 18.568 24.5087 18.0631 24.5087 17.5756C24.5087 16.74 24.7693 16.357 25.0646 15.9566C24.7867 15.2428 23.9354 15.0687 23.3447 15.7825C22.6324 14.4593 23.0667 12.6313 24.9256 12.0742V12.0568C22.7366 11.6912 22.1633 10.3333 22.4065 8.83608C22.615 9.01017 22.8409 9.13204 23.0841 9.13204C23.4489 9.13204 23.6574 8.83608 23.6574 8.41825C23.6574 7.98301 23.4315 7.28663 22.3023 6.52062C23.2926 5.0234 25.0125 4.79708 25.8812 5.35418L25.8985 5.33677C25.4642 4.72744 25.2384 3.66546 25.9333 2.60349C26.107 2.84722 26.5066 3.178 27.1147 3.178C28.9388 3.178 29.0083 1.17591 30.3982 0.966996C30.3113 1.59374 30.485 2.46421 31.2495 2.46421C32.2571 2.46421 32.7262 0.932177 32.9868 -0.00793457C33.4211 0.235798 33.7512 0.671035 33.6817 1.47187H33.6991L34.3071 0.235798C34.811 0.671035 34.9152 1.38482 34.7415 2.02897C34.7067 2.20307 34.6372 2.32493 34.6372 2.41198C34.6372 2.89945 36.0966 3.26505 36.0966 4.34443C36.0966 4.51853 36.0445 4.72744 35.9576 4.93636L39.2759 9.13204C39.4843 9.39318 39.5538 9.67173 39.5538 9.91546C39.5538 10.7859 38.7894 11.7086 37.6949 11.7086C36.6004 11.7086 36.2356 11.1167 36.1661 10.8382L33.2821 9.428C33.1084 9.70655 32.9173 10.1592 32.9173 10.6815C32.9173 13.8674 37.4169 13.9545 38.4941 18.1153L42.9416 16.6355C46.1209 19.7344 49.4739 22.7462 51.5587 23.9823L52.879 25.6536H48.9006V24.4872L47.8061 24.1912C46.1382 21.5624 43.8624 20.1174 42.6462 19.7518C41.1695 20.6571 40.0576 21.5972 38.7547 23.0422C40.8742 22.8681 43.2369 23.077 45.2175 23.46L44.1751 32.3737L43.3238 34.6543L41.0827 36.5694V32.6348H42.2814L41.9513 31.3813C42.9242 28.7699 43.0632 27.029 43.0632 26.0889C43.0632 25.7929 43.0458 25.5144 42.959 25.4273C42.8721 25.3403 42.5246 25.4273 42.2293 25.5144C41.4301 25.7407 40.1098 26.3674 38.4246 27.7254C36.8957 28.9788 36.0792 29.5359 34.0118 29.3096C31.6838 31.7295 26.7672 32.8786 22.4587 32.8263C22.1286 36.3256 18.2543 38.3451 18.2543 40.0164C18.2543 40.6084 18.8277 41.5833 20.0612 43.4461C21.451 45.5178 22.754 47.5199 24.3871 48.1641L25.7769 49.8528H21.7811L21.7463 48.6515L20.6171 48.0248C19.3141 45.6049 17.2815 42.9586 14.5017 40.4691C15.1793 39.1111 15.5441 37.7184 15.5615 36.4127C14.3106 38.3103 12.4691 38.3277 12.139 39.7727C12.0174 40.3124 12.0869 41.357 12.3822 42.7149C12.8166 44.7692 13.1988 47.2066 15.0924 48.1467L16.4128 49.8702H12.4865V48.6864Z" fill="black"/>
<path d="M5.60667 21.2664C6.44058 21.2664 7.60458 21.4579 8.42112 22.224C6.4927 21.3361 3.60876 21.928 3.40028 24.2609C3.07019 23.8953 2.96595 23.46 2.9312 23.077C2.2189 23.4078 1.68034 24.4001 1.54135 25.4795C0.968038 22.9203 3.03544 21.2664 5.60667 21.2664ZM16.3085 24.0345C18.984 23.7038 22.6324 23.9997 25.6205 22.5199C27.0104 21.8235 28.435 20.6571 28.435 19.0903C28.435 17.1926 26.107 15.3298 26.107 11.2908C26.107 8.66198 27.271 5.63274 30.346 3.97884C28.4002 5.66756 27.4621 7.60001 27.4621 9.96769C27.4621 12.3354 28.3829 14.8249 31.51 16.061C33.7164 16.9315 35.7838 16.9663 36.6699 18.8117C35.8881 18.185 34.8804 17.9761 34.1855 17.9761C29.6859 17.9761 28.0007 26.4022 22.7192 28.7873C23.8311 25.8625 20.4607 24.9224 17.3509 24.9921C14.8144 25.0443 10.9229 25.7407 10.8881 29.7623C10.1584 27.0812 11.7046 24.6091 16.3085 24.0345ZM37.1042 10.3855C37.1042 10.1418 37.2432 9.74137 37.2432 9.41059C37.2432 9.2365 37.2084 9.01017 36.9826 8.66198C36.6699 8.17452 36.0618 7.33886 35.4711 6.71212C34.6893 5.89388 34.0118 5.65015 32.9694 5.73719C33.8207 5.26714 34.0291 4.81449 34.0291 4.32703C34.0291 3.89179 33.7859 3.43914 33.4037 3.00391C33.9596 3.10836 35.4364 3.71769 35.4364 4.51853C35.4364 4.69263 35.3495 4.8319 35.1931 5.006L38.7546 9.46282C38.633 9.65433 38.3551 9.56728 38.1118 9.56728C37.9555 9.56728 37.8686 9.67173 37.8686 9.82842C37.8686 10.1244 38.1118 10.5074 38.2508 10.7163C38.1466 10.7859 37.9381 10.873 37.7122 10.873C37.4169 10.8556 37.1042 10.7511 37.1042 10.3855Z" fill="#006A4A"/>
<path d="M60.3669 30.6327V13.9893C60.3669 13.0666 60.141 11.9872 59.8283 10.6641H65.1792C64.8665 11.9872 64.6407 13.0492 64.6407 13.9893V30.1627H70.4954C72.4586 30.1627 73.6921 30.0756 74.9951 29.71L73.6747 33.9579H59.8283C60.141 32.6174 60.3669 31.5554 60.3669 30.6327Z" fill="black"/>
<path d="M77.6358 30.6327V13.9893C77.6358 13.0666 77.4099 11.9872 77.0972 10.6641H82.4481C82.1354 11.9872 81.9096 13.0492 81.9096 13.9893V30.1627H87.7643C89.7275 30.1627 90.961 30.0756 92.264 29.71L90.9436 33.9579H77.0972C77.4099 32.6174 77.6358 31.5554 77.6358 30.6327Z" fill="black"/>
<path d="M92.8373 22.2936C92.8373 15.6432 97.7018 10.3507 104.703 10.3507C111.705 10.3507 116.569 15.6258 116.569 22.2936C116.569 28.9614 111.705 34.2365 104.703 34.2365C97.7018 34.2365 92.8373 28.9614 92.8373 22.2936ZM112.26 22.2936C112.26 17.4886 109.411 14.1808 104.703 14.1808C99.995 14.1808 97.1458 17.506 97.1458 22.2936C97.1458 27.0812 99.995 30.4064 104.703 30.4064C109.411 30.4064 112.26 27.0986 112.26 22.2936Z" fill="black"/>
<path d="M125.082 25.3229C121.52 21.6843 118.428 16.74 116.864 10.6467H121.781C121.85 11.6912 122.042 12.6488 122.441 13.7804C123.553 16.9837 125.256 19.6648 127.201 21.928C129.199 19.7518 131.058 16.9837 132.17 13.7804C132.57 12.6662 132.743 11.6912 132.83 10.6467H137.591C136.027 16.7226 132.935 21.6843 129.373 25.3229V33.9405H125.099L125.082 25.3229Z" fill="black"/>
<path d="M141.048 30.6327V13.9893C141.048 13.0666 140.822 11.9872 140.509 10.6641H148.362C155.815 10.6641 160.523 15.4343 160.523 22.311C160.523 29.1877 155.815 33.9579 148.362 33.9579H140.509C140.839 32.6174 141.048 31.5554 141.048 30.6327ZM156.197 22.2936C156.197 17.2448 153.331 14.4593 148.067 14.4593H145.322V30.1453H148.067C153.331 30.1453 156.197 27.3597 156.197 22.2936Z" fill="black"/>
<path d="M163.442 32.6348L163.372 27.9691C166.326 29.8841 168.289 30.7546 170.599 30.7546C173.205 30.7546 174.891 29.7274 174.891 27.8646C174.891 26.6285 174.178 25.671 171.833 24.7135L168.098 23.2163C164.658 21.8409 163.112 19.9259 163.112 16.9489C163.112 12.9099 166.256 10.3681 171.086 10.3681C173.622 10.3681 176.003 11.1689 177.375 11.8305V16.3047C174.769 14.5638 172.841 13.8674 170.877 13.8674C168.445 13.8674 167.229 14.8249 167.229 16.3047C167.229 17.7671 167.993 18.5157 169.835 19.2818L174.526 21.1968C177.253 22.2936 179.043 24.2957 179.043 27.3423C179.043 31.3291 175.933 34.2713 170.408 34.2713C167.507 34.2365 164.988 33.3138 163.442 32.6348Z" fill="black"/>
</g>
</svg>`;

const LBG_LOGO_APPLY = LBG_LOGO
  .replace('height="40"', 'height="18"')
  .replace('width="144"', 'width="65"')
  .replace(/fill="black"/g, 'fill="white"')
  .replace('fill="#006A4A"', 'fill="#b8e0cc"');

function renderLbgApplyButton() {
  return `
    <button type="button" class="btn btn-primary btn-apply quote-apply-btn">
      <span class="btn-apply__logo" aria-hidden="true">${LBG_LOGO_APPLY}</span>
      <span class="btn-apply__divider" aria-hidden="true">|</span>
      <span class="btn-apply__label">APPLY</span>
    </button>
  `;
}

const RENTAL_EVIDENCE_REPORT_URL = 'assets/sheffield-rental-evidence-report.pdf';

function renderDataloftReportButton() {
  return `
    <a class="btn btn-apply btn-order-report" href="${RENTAL_EVIDENCE_REPORT_URL}" target="_blank" rel="noopener noreferrer">
      <span class="btn-apply__logo">
        <img src="assets/dataloft-logo.png" alt="" class="btn-order-report__logo" width="120" height="40">
      </span>
      <span class="btn-apply__divider" aria-hidden="true">|</span>
      <span class="btn-apply__label">ORDER RENTAL EVIDENCE REPORT</span>
    </a>
  `;
}

let state = loadState();
let draftPortfolio = state.draftPortfolio || { name: '', properties: [] };

function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  const hash = window.location.hash.slice(1) || '/login';
  return hash.startsWith('/') ? hash : `/${hash}`;
}

function parseRoute(route) {
  const refinanceQuoteMatch = route.match(/^\/portfolio\/property\/(\d+)\/refinance-quote$/);
  if (refinanceQuoteMatch) {
    return { type: 'refinance-quote', index: Number(refinanceQuoteMatch[1]) };
  }

  const rentReviewMatch = route.match(/^\/portfolio\/property\/(\d+)\/rent-review$/);
  if (rentReviewMatch) {
    return { type: 'rent-review', index: Number(rentReviewMatch[1]) };
  }

  const epcImprovementMatch = route.match(/^\/portfolio\/property\/(\d+)\/epc-improvement$/);
  if (epcImprovementMatch) {
    return { type: 'epc-improvement', index: Number(epcImprovementMatch[1]) };
  }

  const propertyMatch = route.match(/^\/portfolio\/property\/(\d+)(?:\/([a-z-]+))?$/);
  if (propertyMatch) {
    return {
      type: 'property',
      index: Number(propertyMatch[1]),
      tab: propertyMatch[2] || 'overview',
    };
  }

  const quoteMatch = route.match(/^\/portfolio\/marketplace\/quote\/([a-z0-9-]+)$/);
  if (quoteMatch) {
    return { type: 'marketplace-quote', listingId: quoteMatch[1] };
  }

  return { type: 'standard', route };
}

function getPropertyTab(id) {
  return PROPERTY_TABS.find((tab) => tab.id === id) || PROPERTY_TABS[0];
}

function getPortfolioProperty(index) {
  const portfolio = state.portfolio;
  if (!portfolio || index < 0 || index >= portfolio.properties.length) return null;
  return enrichPropertyWithAvm(portfolio.properties[index]);
}

function propertyDemoSeed(property) {
  const seed = `${property.postcode || ''}${property.propertyNumber || ''}`.length;
  const marketRent = Number(property.marketRent) || 1200;
  const avm = Number(property.avmValue) || 300000;
  const sqft = 700 + (seed % 5) * 100;
  const rentLow = Math.round(marketRent * (0.88 + (seed % 3) * 0.02));
  const rentHigh = Math.round(marketRent * (1.08 + (seed % 4) * 0.02));
  const epcCurrent = ['B', 'C', 'D', 'C'][seed % 4];
  const epcPotential = epcCurrent === 'D' ? 'C' : epcCurrent === 'C' ? 'B' : 'A';

  return {
    bedrooms: 1 + (seed % 4),
    floors: 2 + (seed % 3),
    floorNumber: 1 + (seed % 2),
    propertyType: seed % 3 === 0 ? 'House' : 'Flat',
    sqft,
    builtYear: 1985 + (seed % 20) * 5,
    leasehold: seed % 4 === 0 ? 'yes' : 'no',
    newBuilding: 'no',
    epcRating: epcCurrent,
    epcPotential,
    epcScore: 62 + (seed % 18),
    riskScore: ['Low', 'Medium', 'Medium', 'Elevated'][seed % 4],
    rentDaysOnMarket: 6 + (seed % 20),
    saleDaysOnMarket: 90 + (seed % 80),
    demandScore: 55 + (seed % 35),
    rentChangePct: -4 + (seed % 3),
    saleChangePct: -2.3 + (seed % 2) * 0.5,
    medianRent: Math.round(marketRent * 0.92),
    medianSale: Math.round(avm * 0.88),
    rentLow,
    rentHigh,
    rentPerSqft: (marketRent / sqft).toFixed(2),
    salePerSqft: Math.round(avm / sqft),
    similarRent: 300 + (seed % 300),
    similarSale: 200 + (seed % 200),
    comparables: 8 + (seed % 12),
    rentTrend: [
      { label: '01.06.2023', value: marketRent * 0.94, pct: '+3.50%' },
      { label: '01.09.2023', value: marketRent * 0.97, pct: '+2.10%' },
      { label: '01.12.2023', value: marketRent * 0.95, pct: '-1.67%' },
      { label: '01.03.2024', value: marketRent * 0.98, pct: '+2.80%' },
      { label: '01.06.2024', value: marketRent * 1.0, pct: '+1.20%' },
      { label: '01.09.2024', value: marketRent * 0.99, pct: '-0.80%' },
      { label: '01.12.2024', value: marketRent * 1.02, pct: '+2.40%' },
      { label: '01.03.2025', value: marketRent, pct: '-4.00%' },
    ],
    saleTrend: [
      { label: '01.06.2023', value: avm * 0.92, pct: '-1.50%' },
      { label: '01.09.2023', value: avm * 0.94, pct: '+1.20%' },
      { label: '01.12.2023', value: avm * 0.93, pct: '-0.90%' },
      { label: '01.03.2024', value: avm * 0.96, pct: '+2.10%' },
      { label: '01.06.2024', value: avm * 0.98, pct: '+1.80%' },
      { label: '01.09.2024', value: avm * 0.99, pct: '+0.50%' },
      { label: '01.12.2024', value: avm * 1.01, pct: '+1.60%' },
      { label: '01.03.2025', value: avm, pct: '-2.30%' },
    ],
    epcImprovementCost: 6500 + (seed % 8) * 1750,
    environmentalRisks: [
      { label: 'Flood - River Sea', level: ['low', 'low', 'medium', 'high'][seed % 4] },
      { label: 'Flood - Surface Water', level: ['low', 'medium', 'medium', 'low'][(seed + 1) % 4] },
      { label: 'Chancel Liability', level: ['low', 'low', 'low', 'medium'][(seed + 2) % 4] },
      { label: 'Subsidence', level: ['low', 'medium', 'low', 'low'][(seed + 3) % 4] },
      { label: 'Cladding', level: ['low', 'low', 'low', 'medium'][seed % 4] },
    ],
    averageAskingPrice: Math.round(avm * (1.01 + (seed % 4) * 0.008)),
    askingPriceChange3m: Number((-0.6 + (seed % 6) * 0.35).toFixed(1)),
    askingPriceTrend: [
      { label: 'Oct', value: avm * 0.96 },
      { label: 'Nov', value: avm * 0.97 },
      { label: 'Dec', value: avm * 0.98 },
      { label: 'Jan', value: avm * 0.99 },
      { label: 'Feb', value: avm * 1.0 },
      { label: 'Mar', value: avm * 1.01 },
      { label: 'Apr', value: avm * 1.005 },
      { label: 'May', value: avm * 1.02 },
      { label: 'Jun', value: avm * 1.015 },
      { label: 'Jul', value: avm * 1.03 },
    ],
    listingsByAskingPrice: (() => {
      const mid = Math.round(avm / 50000) * 50;
      return [-2, -1, 0, 1, 2].map((offset, i) => ({
        label: `£${mid + offset * 50}k`,
        value: 14 + ((seed + i * 3) % 18),
      }));
    })(),
    timeToSellTrend: [
      { label: 'Oct', value: 95 + (seed % 10) },
      { label: 'Nov', value: 92 + (seed % 12) },
      { label: 'Dec', value: 88 + (seed % 8) },
      { label: 'Jan', value: 85 + (seed % 10) },
      { label: 'Feb', value: 82 + (seed % 9) },
      { label: 'Mar', value: 78 + (seed % 11) },
      { label: 'Apr', value: 80 + (seed % 8) },
      { label: 'May', value: 76 + (seed % 10) },
      { label: 'Jun', value: 74 + (seed % 7) },
      { label: 'Jul', value: 72 + (seed % 9) },
    ],
    salesVolumeByDom: [
      { label: '0-30', value: 38 + (seed % 15) },
      { label: '31-60', value: 28 + (seed % 12) },
      { label: '61-90', value: 18 + (seed % 10) },
      { label: '91-120', value: 10 + (seed % 8) },
      { label: '120+', value: 6 + (seed % 5) },
    ],
    transactionPriceTrend: [
      { label: 'Q1 24', value: avm * 0.94 },
      { label: 'Q2 24', value: avm * 0.96 },
      { label: 'Q3 24', value: avm * 0.98 },
      { label: 'Q4 24', value: avm * 0.99 },
      { label: 'Q1 25', value: avm * 1.01 },
      { label: 'Q2 25', value: avm * 1.02 },
    ],
    transactionPriceDistribution: (() => {
      const mid = Math.round(avm / 50000) * 50;
      return [-2, -1, 0, 1, 2, 3].map((offset, i) => ({
        label: `£${mid + offset * 50}k`,
        value: 8 + ((seed + i * 2) % 22),
      }));
    })(),
  };
}

function getPropertyOverviewDetails(property) {
  const seed = propertyDemoSeed(property);
  return {
    propertyType: property.propertyType ?? seed.propertyType,
    bedrooms: property.bedrooms ?? seed.bedrooms,
    epcRating: property.epcRating ?? seed.epcRating,
    epcPotential: property.epcPotential ?? seed.epcPotential,
    sqft: property.sqft ?? seed.sqft,
    builtYear: property.builtYear ?? seed.builtYear,
    leasehold: property.leasehold ?? seed.leasehold,
    floors: property.floors ?? seed.floors,
    floorNumber: property.floorNumber ?? seed.floorNumber,
    newBuilding: property.newBuilding ?? seed.newBuilding,
    occupancy: property.occupancy ?? property.tenancyStatus ?? '',
    rentPerSqft: seed.rentPerSqft,
  };
}

function formatTenancyDate(value) {
  if (!value) return '—';
  const date = new Date(String(value).trim());
  if (Number.isNaN(date.getTime())) return escapeHtml(String(value));
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderSelectOptions(options, selectedValue, includeBlank = true) {
  const blank = includeBlank ? '<option value="">Select…</option>' : '';
  return blank + options.map((option) => `
    <option value="${escapeHtml(option)}"${option === selectedValue ? ' selected' : ''}>${escapeHtml(option)}</option>
  `).join('');
}

function renderOverviewEditModal(property, details) {
  return `
    <div class="modal" id="overview-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-overview-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="overview-edit-title" aria-modal="true">
        <h2 class="modal__title" id="overview-edit-title">Edit key information</h2>
        <p class="modal__intro">Update the property characteristics held against this asset.</p>
        <form id="overview-edit-form" class="modal__form">
          <div class="form-grid form-grid--2">
            <div class="form-field">
              <label for="ov-property-type">Property type</label>
              <select id="ov-property-type" name="propertyType">${renderSelectOptions(['House', 'Flat', 'Apartment', 'HMO'], details.propertyType)}</select>
            </div>
            <div class="form-field">
              <label for="ov-bedrooms">Bedrooms</label>
              <input type="number" id="ov-bedrooms" name="bedrooms" min="0" value="${escapeHtml(String(details.bedrooms))}">
            </div>
            <div class="form-field">
              <label for="ov-epc-current">Current EPC rating</label>
              <select id="ov-epc-current" name="epcRating">${renderSelectOptions(['A', 'B', 'C', 'D', 'E', 'F', 'G'], details.epcRating)}</select>
            </div>
            <div class="form-field">
              <label for="ov-epc-potential">Potential EPC rating</label>
              <select id="ov-epc-potential" name="epcPotential">${renderSelectOptions(['A', 'B', 'C', 'D', 'E', 'F', 'G'], details.epcPotential)}</select>
            </div>
            <div class="form-field">
              <label for="ov-sqft">Net living area (sq.ft)</label>
              <input type="number" id="ov-sqft" name="sqft" min="0" value="${escapeHtml(String(details.sqft))}">
            </div>
            <div class="form-field">
              <label for="ov-built-year">Year built</label>
              <input type="number" id="ov-built-year" name="builtYear" min="1600" max="2100" value="${escapeHtml(String(details.builtYear))}">
            </div>
            <div class="form-field">
              <label for="ov-leasehold">Leasehold</label>
              <select id="ov-leasehold" name="leasehold">${renderSelectOptions(['yes', 'no'], details.leasehold, false)}</select>
            </div>
            <div class="form-field">
              <label for="ov-floors">Number of floors</label>
              <input type="number" id="ov-floors" name="floors" min="1" value="${escapeHtml(String(details.floors))}">
            </div>
            <div class="form-field">
              <label for="ov-floor-number">Floor number</label>
              <input type="number" id="ov-floor-number" name="floorNumber" min="0" value="${escapeHtml(String(details.floorNumber))}">
            </div>
            <div class="form-field">
              <label for="ov-new-building">New build</label>
              <select id="ov-new-building" name="newBuilding">${renderSelectOptions(['yes', 'no'], details.newBuilding, false)}</select>
            </div>
            <div class="form-field">
              <label for="ov-occupancy">Occupancy status</label>
              <select id="ov-occupancy" name="occupancy">${renderSelectOptions(['Let', 'Vacant', 'Under offer', 'Notice served'], details.occupancy === 'Rented' ? 'Let' : details.occupancy)}</select>
            </div>
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-overview-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindOverviewEdit(index) {
  const modal = document.getElementById('overview-edit-modal');
  const form = document.getElementById('overview-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-overview-edit"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-overview-edit"]').forEach((el) => {
    el.addEventListener('click', close);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const data = new FormData(form);
    const property = portfolio.properties[index];
    property.propertyType = String(data.get('propertyType') || '').trim();
    property.bedrooms = Number(data.get('bedrooms')) || 0;
    property.epcRating = String(data.get('epcRating') || '').trim();
    property.epcPotential = String(data.get('epcPotential') || '').trim();
    property.sqft = Number(data.get('sqft')) || 0;
    property.builtYear = Number(data.get('builtYear')) || 0;
    property.leasehold = String(data.get('leasehold') || '').trim();
    property.floors = Number(data.get('floors')) || 0;
    property.floorNumber = Number(data.get('floorNumber')) || 0;
    property.newBuilding = String(data.get('newBuilding') || '').trim();
    property.occupancy = String(data.get('occupancy') || '').trim();
    property.tenancyStatus = property.occupancy;

    saveState(state);
    close();
    render();
  });
}

function requireAuth(route) {
  if (!state.loggedIn && route !== '/login') {
    navigate('/login');
    return false;
  }
  if (state.loggedIn && route === '/login') {
    navigate('/dashboard');
    return false;
  }
  return true;
}

function renderHeader(showNav = true) {
  if (!showNav) return '';
  return `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-header__brand" href="#/dashboard">
          ${LBG_LOGO}
          <span class="site-header__product">Investor Landlord Portal</span>
        </a>
        <nav class="site-header__nav">
          <span class="site-header__user">Signed in as <strong>demo.landlord@email.com</strong></span>
          <button class="btn-link" data-action="logout">Sign out</button>
        </nav>
      </div>
    </header>
    <div class="demo-banner">Demonstration prototype — not a live banking service. All data is fictional.</div>
  `;
}

const INFO_TOOLTIP_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function renderInfoTooltip(text) {
  return `
    <span class="info-tooltip">
      <button type="button" class="info-tooltip__trigger" aria-label="More information">${INFO_TOOLTIP_ICON}</button>
      <span class="info-tooltip__content" role="tooltip">${escapeHtml(text)}</span>
    </span>
  `;
}

function renderRemovePropertyModal(property) {
  return `
    <div class="modal" id="remove-property-modal" hidden>
      <div class="modal__backdrop" data-action="close-remove-property"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="remove-property-title" aria-modal="true">
        <h2 class="modal__title" id="remove-property-title">Remove property from portfolio</h2>
        <p class="modal__intro">Are you sure you want to remove <strong>${escapeHtml(property.titleRef)}</strong> — ${escapeHtml(formatAddress(property))} — from this portfolio? This action cannot be undone.</p>
        <div class="modal__actions">
          <button type="button" class="btn btn-secondary" data-action="close-remove-property">Cancel</button>
          <button type="button" class="btn btn-danger" data-action="confirm-remove-property">Remove property</button>
        </div>
      </div>
    </div>
  `;
}

function bindRemoveProperty(index) {
  const modal = document.getElementById('remove-property-modal');
  if (!modal) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-remove-property"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-remove-property"]').forEach((el) => {
    el.addEventListener('click', close);
  });
  modal.querySelector('[data-action="confirm-remove-property"]')?.addEventListener('click', () => {
    const portfolio = state.portfolio;
    if (!portfolio || index < 0 || index >= portfolio.properties.length) return;
    portfolio.properties.splice(index, 1);
    saveState(state);
    close();
    navigate('/portfolio/summary');
  });
}

function renderMissingIndicator() {
  return `
    <span class="missing-indicator" title="Missing data — update required" aria-label="Missing data, update required">
      <svg class="missing-indicator__icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="8"/>
        <text x="9" y="12.5" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="Inter, sans-serif">!</text>
      </svg>
      <span class="missing-indicator__label">update</span>
    </span>
  `;
}

function renderRentAgreedDisplay(value, forSummary = false) {
  const num = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (num > 0) return formatCurrency(num);
  if (forSummary) return '—';
  return renderMissingIndicator();
}

function renderLineCurrency(value) {
  if (!hasDisplayValue(value) || !Number(String(value).replace(/[^0-9.]/g, ''))) {
    return renderMissingIndicator();
  }
  return `${formatCurrency(value)}<span class="cell-suffix">/mo</span>`;
}

function renderLineCurrencyPlain(value) {
  if (!hasDisplayValue(value) || !Number(String(value).replace(/[^0-9.]/g, ''))) {
    return renderMissingIndicator();
  }
  return formatCurrency(value);
}

function renderLineInterestRate(value) {
  const formatted = formatInterestRate(value);
  if (!formatted) return renderMissingIndicator();
  return formatted;
}

function renderLineOccupancy(value) {
  if (!hasDisplayValue(value)) return renderMissingIndicator();
  const label = value === 'Let' ? 'Rented' : value;
  const isRented = label === 'Rented';
  return `<span class="badge ${isRented ? 'badge-green' : 'badge-amber'}">${escapeHtml(label)}</span>`;
}

function renderDetailValue(value, type = 'text') {
  switch (type) {
    case 'currency':
      return renderLineCurrencyPlain(value);
    case 'currency-mo':
      return renderLineCurrency(value);
    case 'percent':
      return renderLineInterestRate(value) || renderMissingIndicator();
    case 'occupancy':
      return renderLineOccupancy(value);
    case 'rent-agreed':
      return renderRentAgreedDisplay(value);
    default:
      return hasDisplayValue(value) ? escapeHtml(String(value)) : renderMissingIndicator();
  }
}

function renderDetailRow(label, value, type = 'text') {
  return `
    <div class="detail-row">
      <dt class="detail-row__label">${escapeHtml(label)}</dt>
      <dd class="detail-row__value">${renderDetailValue(value, type)}</dd>
    </div>
  `;
}

function renderPropertyHero(property) {
  const seed = propertyDemoSeed(property);
  const avm = Number(property.avmValue) || 0;
  const grossYield = avm > 0 && property.marketRent
    ? ((Number(property.marketRent) * 12) / avm) * 100
    : null;

  return `
    <section class="property-hero" aria-label="Property summary">
      <div class="property-hero__main">
        <p class="property-hero__ref">${escapeHtml(property.titleRef)}</p>
        <h1 class="property-hero__address">${escapeHtml(formatAddress(property))}</h1>
        <p class="property-hero__meta">${seed.bedrooms} bedroom${seed.bedrooms === 1 ? '' : 's'} · ${seed.floors} floors · Floor ${seed.floorNumber}</p>
      </div>
      <div class="property-hero__metrics">
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderLineCurrencyPlain(property.avmValue)}</span>
          <span class="property-hero__metric-label">Estimated market value</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderLineCurrency(property.marketRent)}</span>
          <span class="property-hero__metric-label">Market rent</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${renderRentAgreedDisplay(property.rentAgreed)}</span>
          <span class="property-hero__metric-label">Achieved rent</span>
        </div>
        <div class="property-hero__metric">
          <span class="property-hero__metric-value">${grossYield != null ? formatPercent(grossYield) : '—'}</span>
          <span class="property-hero__metric-label">Gross yield</span>
        </div>
      </div>
    </section>
  `;
}

const OVERVIEW_ICONS = {
  key: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--lbg-green)"/><path d="M12 6l1.2 3.6H17l-3 2.2 1.1 3.5L12 13.8 8.9 15.3 10 11.8 7 9.6h3.8L12 6z" fill="#fff"/></svg>`,
  rent: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--lbg-green)"/><path d="M12 7v5l3.5 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  sale: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--lbg-green)"/><path d="M8 9h8l-1 8H9l-1-8zm1-2h6l.5 2h-7l.5-2z" fill="#fff"/></svg>`,
  financials: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--lbg-green)"/><path d="M7 9h10v2H7V9zm0 4h6v2H7v-2z" fill="#fff"/></svg>`,
  mortgage: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="var(--lbg-green)"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2v3l2 1" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

function formatOverviewAddress(property) {
  return `${property.street} ${property.propertyNumber}, ${property.postcode} ${property.city}`;
}

function renderOverviewAttr(label, value) {
  return `
    <div class="overview-attr">
      <span class="overview-attr__label">${escapeHtml(label)}</span>
      <span class="overview-attr__value">${value}</span>
    </div>
  `;
}

function renderFinancialMetric(label, content) {
  return `
    <div class="financial-metric">
      <span class="financial-metric__label">${escapeHtml(label)}</span>
      <div class="financial-metric__value">${content}</div>
    </div>
  `;
}

function renderFinancialOrMissing(hasValue, content) {
  if (!hasValue) return renderMissingIndicator();
  return typeof content === 'function' ? content() : content;
}

function renderOverviewTrendChart(points) {
  const width = 720;
  const height = 180;
  const padX = 36;
  const padY = 28;
  const values = points.map((p) => p.value);
  const min = Math.min(...values) * 0.96;
  const max = Math.max(...values) * 1.04;
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padX + (index / (points.length - 1)) * (width - padX * 2);
    const y = height - padY - ((point.value - min) / range) * (height - padY * 2);
    return { x, y, ...point };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  return `
    <div class="overview-chart">
      <svg viewBox="0 0 ${width} ${height}" class="overview-chart__svg" preserveAspectRatio="none">
        <path d="${areaPath}" class="overview-chart__area"/>
        <path d="${linePath}" class="overview-chart__line"/>
        ${coords.map((c) => `
          <circle cx="${c.x}" cy="${c.y}" r="4" class="overview-chart__dot"/>
        `).join('')}
      </svg>
      <div class="overview-chart__labels">
        ${coords.map((c) => `
          <div class="overview-chart__point" style="left:${(c.x / width) * 100}%">
            <span class="overview-chart__amount">${escapeHtml(c.pct)}</span>
            <span class="overview-chart__date">${escapeHtml(c.label)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderOccupancyBadge(occupancy) {
  const label = occupancy === 'Let' ? 'Rented' : (occupancy || 'Vacant');
  const isVacant = label === 'Vacant';
  return `<span class="overview-status ${isVacant ? 'overview-status--vacant' : 'overview-status--rented'}">${escapeHtml(label)}</span>`;
}

function renderPropertyToolbar(index, activeTabId) {
  return `
    <div class="property-toolbar">
      <a class="property-back" href="#/portfolio/summary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back to portfolio
      </a>
      <nav class="property-tabs" aria-label="Property sections">
        <div class="property-tabs__scroll">
          ${PROPERTY_TABS.map((tab) => `
            <a
              class="property-tabs__tab ${tab.id === activeTabId ? 'property-tabs__tab--active' : ''}"
              href="#/portfolio/property/${index}/${tab.id}"
              ${tab.id === activeTabId ? 'aria-current="page"' : ''}
            >${escapeHtml(tab.label)}</a>
          `).join('')}
        </div>
      </nav>
    </div>
  `;
}

function renderPropertyOverviewTab(property) {
  const seed = propertyDemoSeed(property);
  const details = getPropertyOverviewDetails(property);
  const marketRent = Number(property.marketRent) || 0;
  const avm = Number(property.avmValue) || 0;
  const rentAgreed = getAchievedRentTotal(property);
  const rentPcm = rentAgreed > 0 ? rentAgreed : marketRent;
  const suggestedRent = marketRent;

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.key}</span>
            <h2 class="overview-section__title">Key information</h2>
          </div>
          <div class="overview-section__actions">
            <button type="button" class="overview-action-btn" data-action="open-overview-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Edit
            </button>
            ${renderOccupancyBadge(details.occupancy)}
          </div>
        </div>

        <p class="overview-address">${escapeHtml(formatOverviewAddress(property))}</p>

        <div class="overview-attrs">
          ${renderOverviewAttr('Type', escapeHtml(details.propertyType))}
          ${renderOverviewAttr('Number of bedrooms', details.bedrooms)}
          ${renderOverviewAttr('Current → Potential EPC', `${details.epcRating} → ${details.epcPotential}`)}
          ${renderOverviewAttr('Net living area (sq.ft)', Number(details.sqft).toLocaleString('en-GB'))}
          ${renderOverviewAttr('Built', details.builtYear)}
          ${renderOverviewAttr('Leasehold?', details.leasehold)}
          ${renderOverviewAttr('Number of floors', details.floors)}
          ${renderOverviewAttr('Floor number', details.floorNumber)}
          ${renderOverviewAttr('New building', details.newBuilding)}
        </div>
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.rent}</span>
            <h2 class="overview-section__title">Rent</h2>
          </div>
        </div>

        <div class="overview-metrics">
          <div class="overview-metric">
            <span class="overview-metric__label">Rent pcm</span>
            <span class="overview-metric__value">${marketRent > 0 ? formatCurrency(rentPcm) : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Rent per sq.ft</span>
            <span class="overview-metric__value">${marketRent > 0 ? `£${details.rentPerSqft}` : '—'}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Market rent</span>
            <span class="overview-metric__value">${marketRent > 0 ? `${formatCurrency(seed.rentLow)} - ${formatCurrency(seed.rentHigh)}` : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Suggested rent</span>
            <span class="overview-metric__value">${marketRent > 0 ? formatCurrency(suggestedRent) : renderMissingIndicator()}</span>
          </div>
        </div>

        <div class="overview-market-box">
          <div class="overview-market-box__item">
            <span class="overview-market-box__dot"></span>
            <span>Similar properties: <strong>+ ${seed.similarRent}</strong></span>
          </div>
          <p class="overview-market-box__text">On average, similar properties stay on the market for <strong>${seed.rentDaysOnMarket} day(s)</strong></p>
        </div>

        <h3 class="overview-subtitle">Change in average rents</h3>
        <div class="overview-trend-meta">
          <span>Last quarter's median rent: <strong>${formatCurrency(seed.medianRent)}</strong></span>
          <span>Last 2 years % change: <strong class="${seed.rentChangePct < 0 ? 'overview-trend-meta--down' : ''}">${seed.rentChangePct}%</strong></span>
        </div>
        ${renderOverviewTrendChart(seed.rentTrend)}
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <span class="overview-section__icon">${OVERVIEW_ICONS.sale}</span>
            <h2 class="overview-section__title">Sale</h2>
          </div>
        </div>

        <div class="overview-metrics overview-metrics--3">
          <div class="overview-metric">
            <span class="overview-metric__label">Sale price</span>
            <span class="overview-metric__value">${avm > 0 ? formatCurrency(avm) : renderMissingIndicator()}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Sale per sq.ft</span>
            <span class="overview-metric__value">${avm > 0 ? `£${seed.salePerSqft} /sq.ft` : '—'}</span>
          </div>
          <div class="overview-metric">
            <span class="overview-metric__label">Market sale</span>
            <span class="overview-metric__value">${avm > 0 ? `${formatCurrency(Math.round(avm * 0.92))} - ${formatCurrency(Math.round(avm * 1.06))}` : '£ - £'}</span>
          </div>
        </div>

        <div class="overview-market-box">
          <div class="overview-market-box__item">
            <span class="overview-market-box__dot"></span>
            <span>Similar properties: <strong>+ ${seed.similarSale}</strong></span>
          </div>
          <p class="overview-market-box__text">On average, similar properties stay on the market for <strong>${seed.saleDaysOnMarket} day(s)</strong></p>
        </div>

        <h3 class="overview-subtitle">Change in average sales prices</h3>
        <div class="overview-trend-meta">
          <span>Last quarter's median sale: <strong>${formatCurrency(seed.medianSale)}</strong></span>
          <span>Last 2 years % change: <strong class="${seed.saleChangePct < 0 ? 'overview-trend-meta--down' : ''}">${seed.saleChangePct}%</strong></span>
        </div>
        ${renderOverviewTrendChart(seed.saleTrend)}
      </section>

      <div class="property-overview-actions">
        <button type="button" class="btn btn-tertiary btn-sm property-overview-actions__remove" data-action="open-remove-property">Remove from portfolio</button>
      </div>
    </div>
    ${renderOverviewEditModal(property, details)}
  `;
}

function renderTenancyTable(tenancies) {
  if (!tenancies.length) {
    return '<p class="tenancy-empty">No individual tenancies recorded. Use Edit to add room-level income for HMO properties.</p>';
  }

  return `
    <div class="data-table-wrap">
      <table class="data-table tenancy-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Tenant</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Monthly rent</th>
            <th>Agreement type</th>
          </tr>
        </thead>
        <tbody>
          ${tenancies.map((tenancy) => `
            <tr>
              <td>${escapeHtml(tenancy.roomNumber || '—')}</td>
              <td>${escapeHtml(tenancy.tenantName || '—')}</td>
              <td>${formatTenancyDate(tenancy.startDate)}</td>
              <td>${formatTenancyDate(tenancy.endDate)}</td>
              <td>${hasDisplayValue(tenancy.monthlyRent) ? `${formatCurrency(tenancy.monthlyRent)}<span class="cell-suffix">/mo</span>` : '—'}</td>
              <td>${escapeHtml(tenancy.agreementType || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderTenancyEditRow(tenancy = {}, index = 0) {
  return `
    <fieldset class="tenancy-edit-row" data-tenancy-row="${index}">
      <legend class="tenancy-edit-row__legend">Tenancy ${index + 1}</legend>
      <div class="form-grid form-grid--3">
        <div class="form-field">
          <label>Room number</label>
          <input type="text" name="roomNumber" value="${escapeHtml(tenancy.roomNumber || '')}" placeholder="e.g. 1">
        </div>
        <div class="form-field">
          <label>Tenant name</label>
          <input type="text" name="tenantName" value="${escapeHtml(tenancy.tenantName || '')}" placeholder="e.g. J. Smith">
        </div>
        <div class="form-field">
          <label>Monthly rent (£)</label>
          <input type="text" name="monthlyRent" inputmode="decimal" value="${escapeHtml(tenancy.monthlyRent || '')}" placeholder="e.g. 650">
        </div>
        <div class="form-field">
          <label>Start date</label>
          <input type="date" name="startDate" value="${escapeHtml(tenancy.startDate || '')}">
        </div>
        <div class="form-field">
          <label>End date</label>
          <input type="date" name="endDate" value="${escapeHtml(tenancy.endDate || '')}">
        </div>
        <div class="form-field">
          <label>Agreement type</label>
          <select name="agreementType">${renderSelectOptions(TENANCY_AGREEMENT_TYPES, tenancy.agreementType || 'Assured shorthold')}</select>
        </div>
      </div>
      <button type="button" class="btn-link tenancy-edit-row__remove" data-action="remove-tenancy-row">Remove tenancy</button>
    </fieldset>
  `;
}

function renderTenancyEditModal(property) {
  if (isHmoProperty(property)) {
    const tenancies = getPropertyTenancies(property);

    return `
      <div class="modal" id="tenancy-edit-modal" hidden>
        <div class="modal__backdrop" data-action="close-tenancy-edit"></div>
        <div class="modal__panel modal__panel--wide" role="dialog" aria-labelledby="tenancy-edit-title" aria-modal="true">
          <h2 class="modal__title" id="tenancy-edit-title">Edit rental</h2>
          <p class="modal__intro">Record individual tenancies for HMO and multi-let properties. Total achieved rent is calculated from the monthly rents entered below.</p>
          <form id="tenancy-edit-form" class="modal__form">
            <div id="tenancy-edit-rows" class="tenancy-edit-rows">
              ${tenancies.length
        ? tenancies.map((tenancy, index) => renderTenancyEditRow(tenancy, index)).join('')
        : renderTenancyEditRow({}, 0)}
            </div>
            <div class="tenancy-edit-actions">
              <button type="button" class="btn btn-secondary" data-action="add-tenancy-row">Add tenancy</button>
              <button type="button" class="btn btn-tertiary" data-action="prefill-tenancy-single">Prefill single tenancy</button>
              <button type="button" class="btn btn-tertiary" data-action="prefill-tenancy-hmo">Prefill HMO</button>
            </div>
            <div class="modal__actions">
              <button type="button" class="btn btn-tertiary" data-action="close-tenancy-edit">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return `
    <div class="modal" id="tenancy-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-tenancy-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="tenancy-edit-title" aria-modal="true">
        <h2 class="modal__title" id="tenancy-edit-title">Edit rental</h2>
        <p class="modal__intro">Update the recorded monthly rent for this property.</p>
        <form id="tenancy-edit-form" class="modal__form">
          <div class="form-field">
            <label for="rent-agreed">Monthly rent (£)</label>
            <input type="text" id="rent-agreed" name="rentAgreed" inputmode="decimal" value="${escapeHtml(property.rentAgreed || '')}" placeholder="e.g. 1450">
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-tenancy-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function getPropertyDefaultTab(property) {
  return hasCompletedMortgageDetails(property) ? 'overview' : 'financials';
}

function renderFinancialCompletionBanner() {
  return `
    <section class="completion-prompt" aria-label="Complete property financial information">
      <h2 class="completion-prompt__title">Complete your property finances</h2>
      <p class="completion-prompt__message">As a landlord, add mortgage and rental details for this property to unlock insights, personalised opportunities, and portfolio analysis.</p>
      <button type="button" class="btn completion-prompt__cta" data-action="open-financials-edit">Add financial details</button>
    </section>
  `;
}

function renderPortfolioFinancialCompletionBanner(properties) {
  const incompleteCount = properties.filter((property) => !hasCompletedMortgageDetails(property)).length;
  if (incompleteCount === 0) return '';

  const firstIncompleteIndex = properties.findIndex((property) => !hasCompletedMortgageDetails(property));
  const propertyLabel = incompleteCount === properties.length
    ? 'each property'
    : `${incompleteCount} ${incompleteCount === 1 ? 'property' : 'properties'}`;

  return `
    <section class="completion-prompt completion-prompt--portfolio" aria-label="Complete portfolio financial information">
      <h2 class="completion-prompt__title">Complete your property finances</h2>
      <p class="completion-prompt__message">As a landlord, add mortgage and rental details for ${propertyLabel} in your portfolio to unlock insights, personalised opportunities, and portfolio analysis.</p>
      <a class="btn completion-prompt__cta" href="#/portfolio/property/${firstIncompleteIndex}/financials">Complete financial details</a>
    </section>
  `;
}

function renderPropertyFinancialsTab(property, index) {
  const fin = computePropertyFinancials(property);
  const tenancies = getPropertyTenancies(property);
  const mortgageProductType = getMortgageProductType(property);
  const isHmo = isHmoProperty(property);

  const currentValueHtml = renderFinancialOrMissing(
    fin.hasCurrentValue,
    () => `<strong>${formatCurrency(fin.currentValue)}</strong>`,
  );

  const valueChangeHtml = renderFinancialOrMissing(
    fin.hasValueChange,
    () => `<strong class="${fin.valueChange >= 0 ? 'financial-change--up' : 'financial-change--down'}">${
      fin.valueChange >= 0 ? '+' : ''
    }${formatCurrency(fin.valueChange)} (${fin.valueChangePct >= 0 ? '+' : ''}${fin.valueChangePct.toFixed(1)}%)</strong>`,
  );

  const marketRentHtml = fin.hasMarketRent
    ? `<strong>${formatCurrency(fin.marketRentRange.low)} - ${formatCurrency(fin.marketRentRange.high)}</strong>`
    : renderMissingIndicator();

  const rentAgreedHtml = renderFinancialOrMissing(
    fin.hasRentAgreed,
    () => `<strong>${formatCurrency(fin.rentAgreed)}</strong><span class="cell-suffix">/mo</span>`,
  );

  const grossYieldHtml = renderFinancialOrMissing(
    fin.hasGrossYield,
    () => `<strong>${formatPercent(fin.grossYield)}</strong>`,
  );

  const refinanceHtml = fin.hasIndicativeRefinance
    ? `<strong>${fin.indicativeRefinanceRate.toFixed(1)}%</strong>${
      fin.monthlySavings > 0
        ? `<span class="financial-savings">— save ${formatCurrency(fin.monthlySavings)} monthly</span>`
        : ''
    }`
    : renderMissingIndicator();

  const mortgageExpiryDisplay = formatMortgageExpiry(fin.mortgageExpiry);
  const purchaseDateDisplay = formatPurchaseDate(fin.purchaseDate);
  const refinanceOpportunityHtml = renderFinancialRefinanceOpportunity(property, index);
  const rentReviewOpportunityHtml = renderFinancialRentReviewOpportunity(property, index);
  const completionBannerHtml = hasCompletedMortgageDetails(property)
    ? ''
    : renderFinancialCompletionBanner();

  return `
    <div class="property-tab-panel property-tab-panel--financials">
      ${completionBannerHtml}
      <div class="scenario-panel financial-demo-panel">
        <p class="scenario-panel__label">Demo scenarios</p>
        <div class="financial-demo-panel__actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="prefill-financials-single">Prefill single tenancy</button>
          <button type="button" class="btn btn-secondary btn-sm" data-action="prefill-financials-hmo">Prefill HMO</button>
        </div>
      </div>

      ${refinanceOpportunityHtml}
      ${rentReviewOpportunityHtml}

      <section class="financial-section">
        <div class="financial-section__header">
          <div class="financial-section__title-wrap">
            <span class="financial-section__icon">${OVERVIEW_ICONS.financials}</span>
            <h2 class="financial-section__title">Mortgage &amp; value</h2>
          </div>
          <button type="button" class="financial-action-btn" data-action="open-financials-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            Edit
          </button>
        </div>

        <div class="financial-grid">
          <div class="financial-grid__col">
            ${renderFinancialMetric('Purchase price', renderFinancialOrMissing(fin.hasPurchasePrice, () => `<strong>${formatCurrency(fin.purchasePrice)}</strong>`))}
            ${renderFinancialMetric('Purchase date', renderFinancialOrMissing(fin.hasPurchaseDate && !!purchaseDateDisplay, () => `<strong>${escapeHtml(purchaseDateDisplay || '')}</strong>`))}
            ${renderFinancialMetric('Remaining mortgage', renderFinancialOrMissing(fin.hasRemainingMortgage, () => `<strong>${formatCurrency(fin.remainingMortgage)}</strong>`))}
            ${renderFinancialMetric('Mortgage product type', renderFinancialOrMissing(fin.hasMortgageProductType, () => `<strong>${escapeHtml(mortgageProductType)}</strong>`))}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Mortgage expiry', renderFinancialOrMissing(fin.hasMortgageExpiry && !!mortgageExpiryDisplay, () => `<strong>${escapeHtml(mortgageExpiryDisplay || '')}</strong>`))}
            ${renderFinancialMetric('Bank', renderFinancialOrMissing(fin.hasBank, () => `<strong>${escapeHtml(fin.bank)}</strong>`))}
            ${renderFinancialMetric('Current value', currentValueHtml)}
            ${renderFinancialMetric('Value change', valueChangeHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Interest rate', renderFinancialOrMissing(fin.hasInterestRate, () => `<strong>${fin.interestRate.toFixed(1)}%</strong>`))}
            ${renderFinancialMetric('LTV', renderFinancialOrMissing(fin.hasLtv, () => `<strong>${fin.ltv.toFixed(0)}%</strong>`))}
            ${renderFinancialMetric('Indicative refinancing rate', refinanceHtml)}
          </div>
        </div>
      </section>

      <section class="financial-section">
        <div class="financial-section__header">
          <div class="financial-section__title-wrap">
            <span class="financial-section__icon">${OVERVIEW_ICONS.rent}</span>
            <h2 class="financial-section__title">Rental</h2>
          </div>
          <button type="button" class="financial-action-btn" data-action="open-tenancy-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            Edit
          </button>
        </div>

        <div class="financial-grid">
          <div class="financial-grid__col">
            ${renderFinancialMetric('Market rent', marketRentHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Total achieved rent', rentAgreedHtml)}
          </div>
          <div class="financial-grid__col">
            ${renderFinancialMetric('Gross yield', grossYieldHtml)}
          </div>
        </div>
        ${isHmo ? renderTenancyTable(tenancies) : ''}
      </section>
    </div>

    <div class="modal" id="financials-edit-modal" hidden>
      <div class="modal__backdrop" data-action="close-financials-edit"></div>
      <div class="modal__panel" role="dialog" aria-labelledby="financials-edit-title" aria-modal="true">
        <h2 class="modal__title" id="financials-edit-title">Edit mortgage &amp; value</h2>
        <p class="modal__intro">Update purchase, mortgage and valuation details. Calculated fields will update automatically.</p>
        <form id="financials-edit-form" class="modal__form">
          <div class="form-field">
            <label for="fin-purchase-price">Purchase price (£)</label>
            <input type="text" id="fin-purchase-price" name="purchasePrice" inputmode="decimal" value="${escapeHtml(property.purchasePrice || '')}" placeholder="e.g. 350000">
          </div>
          <div class="form-field">
            <label for="fin-purchase-date">Purchase date</label>
            <input type="month" id="fin-purchase-date" name="purchaseDate" value="${escapeHtml(property.purchaseDate ? String(property.purchaseDate).slice(0, 7) : '')}">
          </div>
          <div class="form-field">
            <label for="fin-remaining-mortgage">Remaining mortgage (£)</label>
            <input type="text" id="fin-remaining-mortgage" name="remainingMortgage" inputmode="decimal" value="${escapeHtml(property.mortgageBalance || '')}" placeholder="e.g. 235000">
          </div>
          <div class="form-field">
            <label for="fin-mortgage-product">Mortgage product type</label>
            <select id="fin-mortgage-product" name="mortgageProductType">${renderSelectOptions(MORTGAGE_PRODUCT_TYPES, mortgageProductType)}</select>
          </div>
          <div class="form-field">
            <label for="fin-interest-rate">Interest rate (%)</label>
            <input type="text" id="fin-interest-rate" name="interestRate" inputmode="decimal" value="${escapeHtml(property.interestRate || '')}" placeholder="e.g. 3.5">
          </div>
          <div class="form-field">
            <label for="fin-bank">Bank</label>
            <input type="text" id="fin-bank" name="bank" value="${escapeHtml(property.mortgageProvider || '')}" placeholder="e.g. Barclays">
          </div>
          <div class="form-field">
            <label for="fin-mortgage-expiry">Mortgage expiry</label>
            <input type="month" id="fin-mortgage-expiry" name="mortgageExpiry" value="${escapeHtml(property.mortgageEndDate ? String(property.mortgageEndDate).slice(0, 7) : '')}">
          </div>
          <div class="modal__actions">
            <button type="button" class="btn btn-tertiary" data-action="close-financials-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
    ${renderTenancyEditModal(property)}
  `;
}

function bindFinancialsDemoPrefill(index) {
  document.querySelector('[data-action="prefill-financials-single"]')?.addEventListener('click', () => {
    const property = state.portfolio?.properties[index];
    if (!property) return;
    applyFinancialDemoScenario(property, 'single', { propertyIndex: index });
    saveState(state);
    render();
  });

  document.querySelector('[data-action="prefill-financials-hmo"]')?.addEventListener('click', () => {
    const property = state.portfolio?.properties[index];
    if (!property) return;
    applyFinancialDemoScenario(property, 'hmo', { propertyIndex: index });
    saveState(state);
    render();
  });
}

function bindFinancialsEdit(index) {
  const modal = document.getElementById('financials-edit-modal');
  const form = document.getElementById('financials-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  const saveFinancialsFromForm = () => {
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const data = new FormData(form);
    const property = portfolio.properties[index];
    property.purchasePrice = String(data.get('purchasePrice') || '').trim();
    const purchaseMonth = String(data.get('purchaseDate') || '').trim();
    property.purchaseDate = purchaseMonth ? `${purchaseMonth}-01` : '';
    property.mortgageBalance = String(data.get('remainingMortgage') || '').trim();
    property.mortgageProductType = String(data.get('mortgageProductType') || '').trim();
    property.productType = property.mortgageProductType;
    property.interestRate = String(data.get('interestRate') || '').trim();
    property.mortgageProvider = String(data.get('bank') || '').trim();

    const expiryMonth = String(data.get('mortgageExpiry') || '').trim();
    property.mortgageEndDate = expiryMonth ? `${expiryMonth}-01` : '';

    applyFinancialsToProperty(property);
    saveState(state);
    close();
    render();
  };

  document.querySelectorAll('[data-action="open-financials-edit"]').forEach((btn) => {
    btn.addEventListener('click', open);
  });
  document.querySelectorAll('[data-action="close-financials-edit"]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveFinancialsFromForm();
  });
}

function bindTenancyEdit(index) {
  const modal = document.getElementById('tenancy-edit-modal');
  const form = document.getElementById('tenancy-edit-form');
  if (!modal || !form) return;

  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  document.querySelector('[data-action="open-tenancy-edit"]')?.addEventListener('click', open);
  modal.querySelectorAll('[data-action="close-tenancy-edit"]').forEach((el) => {
    el.addEventListener('click', close);
  });

  const property = state.portfolio?.properties[index];
  if (!property || !isHmoProperty(property)) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const portfolio = state.portfolio;
      if (!portfolio?.properties[index]) return;

      portfolio.properties[index].rentAgreed = String(
        form.querySelector('[name="rentAgreed"]')?.value || '',
      ).trim();
      portfolio.properties[index].tenancies = [];
      saveState(state);
      close();
      render();
    });
    return;
  }

  const rowsContainer = document.getElementById('tenancy-edit-rows');
  if (!rowsContainer) return;

  const reindexRows = () => {
    rowsContainer.querySelectorAll('.tenancy-edit-row').forEach((row, rowIndex) => {
      row.dataset.tenancyRow = String(rowIndex);
      const legend = row.querySelector('.tenancy-edit-row__legend');
      if (legend) legend.textContent = `Tenancy ${rowIndex + 1}`;
    });
  };

  const addRow = (tenancy = {}) => {
    const rowIndex = rowsContainer.querySelectorAll('.tenancy-edit-row').length;
    rowsContainer.insertAdjacentHTML('beforeend', renderTenancyEditRow(tenancy, rowIndex));
    reindexRows();
  };

  modal.querySelector('[data-action="add-tenancy-row"]')?.addEventListener('click', () => addRow());

  modal.querySelector('[data-action="prefill-tenancy-single"]')?.addEventListener('click', () => {
    const currentProperty = state.portfolio?.properties[index];
    if (!currentProperty) return;
    rowsContainer.innerHTML = getDemoSingleTenancy(enrichPropertyWithAvm(currentProperty))
      .map((tenancy, rowIndex) => renderTenancyEditRow(tenancy, rowIndex))
      .join('');
    reindexRows();
  });

  modal.querySelector('[data-action="prefill-tenancy-hmo"]')?.addEventListener('click', () => {
    const currentProperty = state.portfolio?.properties[index];
    if (!currentProperty) return;
    rowsContainer.innerHTML = getDemoTenancies(enrichPropertyWithAvm(currentProperty))
      .map((tenancy, rowIndex) => renderTenancyEditRow(tenancy, rowIndex))
      .join('');
    reindexRows();
  });

  rowsContainer.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-action="remove-tenancy-row"]');
    if (!removeBtn) return;
    const rows = rowsContainer.querySelectorAll('.tenancy-edit-row');
    if (rows.length <= 1) {
      removeBtn.closest('.tenancy-edit-row')?.querySelectorAll('input, select').forEach((input) => {
        if (input.tagName === 'SELECT') input.selectedIndex = 0;
        else input.value = '';
      });
      return;
    }
    removeBtn.closest('.tenancy-edit-row')?.remove();
    reindexRows();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const portfolio = state.portfolio;
    if (!portfolio?.properties[index]) return;

    const currentProperty = portfolio.properties[index];
    const tenancies = [...rowsContainer.querySelectorAll('.tenancy-edit-row')].map((row) => ({
      roomNumber: String(row.querySelector('[name="roomNumber"]')?.value || '').trim(),
      tenantName: String(row.querySelector('[name="tenantName"]')?.value || '').trim(),
      startDate: String(row.querySelector('[name="startDate"]')?.value || '').trim(),
      endDate: String(row.querySelector('[name="endDate"]')?.value || '').trim(),
      monthlyRent: String(row.querySelector('[name="monthlyRent"]')?.value || '').trim(),
      agreementType: String(row.querySelector('[name="agreementType"]')?.value || '').trim(),
    })).filter((tenancy) => (
      tenancy.roomNumber
      || tenancy.tenantName
      || tenancy.monthlyRent
      || tenancy.startDate
      || tenancy.endDate
    ));

    currentProperty.tenancies = tenancies;
    syncAchievedRentFromTenancies(currentProperty);
    saveState(state);
    close();
    render();
  });
}

const CARD_LAYOUT_TABS = new Set([
  'overview',
  'financials',
  'risk',
  'esg',
  'market-trends',
  'market-demand',
]);

function renderTrafficLightRisk(label, level) {
  const levels = ['low', 'medium', 'high'];
  const active = levels.includes(level) ? level : 'low';

  return `
    <div class="risk-traffic-row">
      <span class="risk-traffic-row__label">${escapeHtml(label)}</span>
      <div class="risk-traffic-lights" role="img" aria-label="${escapeHtml(label)}: ${active}">
        ${levels.map((l) => `
          <span
            class="risk-traffic-light risk-traffic-light--${l}${l === active ? ' risk-traffic-light--active' : ''}"
            title="${l.charAt(0).toUpperCase() + l.slice(1)}"
          ></span>
        `).join('')}
      </div>
      <span class="risk-traffic-row__level risk-traffic-row__level--${active}">${active.charAt(0).toUpperCase() + active.slice(1)}</span>
    </div>
  `;
}

function renderSimpleLineChart(points, options = {}) {
  const width = options.width || 680;
  const height = options.height || 200;
  const padX = 44;
  const padY = 32;
  const values = points.map((p) => p.value);
  const min = Math.min(...values) * 0.97;
  const max = Math.max(...values) * 1.03;
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padX + (index / Math.max(points.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - ((point.value - min) / range) * (height - padY * 2);
    return { x, y, ...point };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  return `
    <div class="analytics-chart">
      <svg viewBox="0 0 ${width} ${height}" class="analytics-chart__svg" preserveAspectRatio="xMidYMid meet">
        <path d="${areaPath}" class="analytics-chart__area"/>
        <path d="${linePath}" class="analytics-chart__line"/>
        ${coords.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="4" class="analytics-chart__dot"/>`).join('')}
        ${coords.map((c, i) => (i % 2 === 0 || i === coords.length - 1 ? `
          <text x="${c.x}" y="${height - 10}" text-anchor="middle" class="analytics-chart__axis-label">${escapeHtml(c.label)}</text>
        ` : '')).join('')}
      </svg>
    </div>
  `;
}

function renderSimpleBarChart(bars, options = {}) {
  const width = options.width || 680;
  const height = options.height || 200;
  const padX = 40;
  const padY = 32;
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const slot = (width - padX * 2) / bars.length;
  const barWidth = slot * 0.55;

  return `
    <div class="analytics-chart">
      <svg viewBox="0 0 ${width} ${height}" class="analytics-chart__svg" preserveAspectRatio="xMidYMid meet">
        ${bars.map((bar, i) => {
    const barH = (bar.value / maxVal) * (height - padY * 2);
    const x = padX + i * slot + (slot - barWidth) / 2;
    const y = height - padY - barH;
    return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" class="analytics-chart__bar"/>
            <text x="${x + barWidth / 2}" y="${height - 12}" text-anchor="middle" class="analytics-chart__axis-label">${escapeHtml(bar.label)}</text>
          `;
  }).join('')}
      </svg>
    </div>
  `;
}

function renderAnalyticsStats(stats) {
  return `
    <div class="analytics-stats">
      ${stats.map((stat) => `
        <div class="analytics-stat">
          <span class="analytics-stat__label">${escapeHtml(stat.label)}</span>
          <span class="analytics-stat__value ${stat.tone ? `analytics-stat__value--${stat.tone}` : ''}">${stat.value}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPropertyRiskTab(property) {
  const seed = propertyDemoSeed(property);

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Risk assessment</h2>
          </div>
        </div>
        <p class="property-tab-panel__intro">Environmental and property risks for this location.</p>

        <div class="risk-traffic-legend" aria-hidden="true">
          <span><span class="risk-traffic-light risk-traffic-light--low risk-traffic-light--active"></span> Low</span>
          <span><span class="risk-traffic-light risk-traffic-light--medium risk-traffic-light--active"></span> Medium</span>
          <span><span class="risk-traffic-light risk-traffic-light--high risk-traffic-light--active"></span> High</span>
        </div>

        <div class="risk-traffic-list">
          ${seed.environmentalRisks.map((risk) => renderTrafficLightRisk(risk.label, risk.level)).join('')}
        </div>
      </section>
    </div>
  `;
}

function renderPropertyEsgTab(property, index) {
  const epc = getPropertyEpcDetails(property, { propertyIndex: index });
  const epcOpportunityHtml = renderEsgImprovementOpportunity(property, index);

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      ${epcOpportunityHtml}

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">ESG &amp; Renovation</h2>
          </div>
        </div>
        <p class="property-tab-panel__intro">Energy performance and estimated cost to reach the potential rating.</p>

        <div class="esg-epc-grid">
          <div class="esg-epc-card">
            <span class="esg-epc-card__label">Current EPC rating</span>
            <span class="esg-epc-card__badge esg-epc-card__badge--current">${epc.currentRating}</span>
          </div>
          <div class="esg-epc-card esg-epc-card--arrow" aria-hidden="true">→</div>
          <div class="esg-epc-card">
            <span class="esg-epc-card__label">Potential EPC rating</span>
            <span class="esg-epc-card__badge esg-epc-card__badge--potential">${epc.potentialRating}</span>
          </div>
          <div class="esg-epc-card esg-epc-card--cost">
            <span class="esg-epc-card__label">Total cost to improve</span>
            <span class="esg-epc-card__value">${formatCurrency(epc.improvementCost)}</span>
            <span class="esg-epc-card__hint">Estimated works to reach EPC ${epc.potentialRating}</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPropertyMarketTrendsTab(property) {
  const seed = propertyDemoSeed(property);
  const changeTone = seed.askingPriceChange3m >= 0 ? 'up' : 'down';

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Change in average asking prices</h2>
          </div>
        </div>
        ${renderAnalyticsStats([
    { label: 'Average asking price', value: formatCurrency(seed.averageAskingPrice) },
    {
      label: '% change over 3 months',
      value: `${seed.askingPriceChange3m >= 0 ? '+' : ''}${seed.askingPriceChange3m}%`,
      tone: changeTone,
    },
  ])}
        ${renderSimpleLineChart(seed.askingPriceTrend)}
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Listings by asking price</h2>
          </div>
        </div>
        <p class="property-tab-panel__intro">Active listings near ${escapeHtml(property.city)} grouped by asking price band.</p>
        ${renderSimpleBarChart(seed.listingsByAskingPrice)}
      </section>
    </div>
  `;
}

function renderPropertyMarketDemandTab(property) {
  const seed = propertyDemoSeed(property);

  return `
    <div class="property-tab-panel property-tab-panel--overview">
      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Change in time to sell</h2>
          </div>
        </div>
        <p class="property-tab-panel__intro">Average days on market for comparable sales in ${escapeHtml(property.city)}.</p>
        ${renderSimpleLineChart(seed.timeToSellTrend, { height: 180 })}
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Volume of sales by days on market</h2>
          </div>
        </div>
        ${renderSimpleBarChart(seed.salesVolumeByDom, { height: 180 })}
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Transaction price evolution</h2>
          </div>
        </div>
        ${renderSimpleLineChart(seed.transactionPriceTrend, { height: 180 })}
      </section>

      <section class="overview-section">
        <div class="overview-section__header">
          <div class="overview-section__title-wrap">
            <h2 class="overview-section__title">Transaction price distribution</h2>
          </div>
        </div>
        ${renderSimpleBarChart(seed.transactionPriceDistribution, { height: 180 })}
      </section>
    </div>
  `;
}

function renderPropertyTabContent(property, tabId, index) {
  switch (tabId) {
    case 'financials':
      return renderPropertyFinancialsTab(property, index);
    case 'risk':
      return renderPropertyRiskTab(property);
    case 'esg':
      return renderPropertyEsgTab(property, index);
    case 'market-trends':
      return renderPropertyMarketTrendsTab(property);
    case 'market-demand':
      return renderPropertyMarketDemandTab(property);
    default:
      return renderPropertyOverviewTab(property);
  }
}

function renderPropertyDetail(index, tabId) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const propertyForRoute = portfolio.properties[index];
  if (!propertyForRoute) {
    navigate('/portfolio/summary');
    return;
  }

  if (tabId === 'overview' && !hasCompletedMortgageDetails(propertyForRoute)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const tab = getPropertyTab(tabId);

  if (tab.id === 'financials' && ensurePropertyFinancialBasics(portfolio.properties[index])) {
    saveState(state);
  }

  if (tab.id === 'esg' && ensurePropertyEpcBasics(portfolio.properties[index], index)) {
    saveState(state);
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  const tabLabel = tab.label;

  document.title = `${property.titleRef} — ${tabLabel} — Lloyds Investor Portal`;

  const isCardLayout = CARD_LAYOUT_TABS.has(tab.id);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell page-shell--property">
      <div class="property-page">
        ${renderPropertyToolbar(index, tab.id)}
        <div class="property-tab-content ${isCardLayout ? 'property-tab-content--cards' : ''}">
          ${isCardLayout ? '' : renderPropertyHero(property)}
          ${renderPropertyTabContent(property, tab.id, index)}
        </div>
      </div>
    </main>
    ${renderRemovePropertyModal(property)}
    ${renderFooter()}
  `;

  bindCommonActions();
  if (tab.id === 'financials') {
    bindFinancialsEdit(index);
    bindTenancyEdit(index);
    bindFinancialsDemoPrefill(index);
  }
  if (tab.id === 'overview') {
    bindRemoveProperty(index);
    bindOverviewEdit(index);
  }
  bindPropertyTabs();
}

function bindPropertyTabs() {
  document.querySelectorAll('.property-tabs__tab').forEach((tabLink) => {
    tabLink.addEventListener('click', () => {
      requestAnimationFrame(() => render());
    });
  });
}

function formatCurrencyChange(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function renderPortfolioMetric(label, value, options = {}) {
  const toneClass = options.tone ? ` portfolio-metric__value--${options.tone}` : '';
  const sub = options.sub ? `<div class="portfolio-metric__sub">${options.sub}</div>` : '';
  return `
    <div class="portfolio-metric${options.highlight ? ' portfolio-metric--highlight' : ''}">
      <div class="portfolio-metric__value${toneClass}">${value}</div>
      <div class="portfolio-metric__label">${escapeHtml(label)}</div>
      ${sub}
    </div>
  `;
}

function renderPortfolioComparisonRow(label, beforeValue, afterValue) {
  return `
    <tr>
      <th scope="row">${escapeHtml(label)}</th>
      <td>${beforeValue}</td>
      <td>${afterValue}</td>
    </tr>
  `;
}

function renderMortgageQuote(listingId) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const listing = getMarketplaceListingById(listingId);
  if (!listing) {
    navigate('/portfolio/marketplace');
    return;
  }

  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  if (!beforeMetrics.hasEquityData || beforeMetrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) {
    navigate('/portfolio/summary');
    return;
  }

  const quote = buildMortgageQuote(listing);
  const afterMetrics = computePortfolioMetricsAfterPurchase(portfolio.properties, listing, quote);
  const address = formatAddress(listing);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/marketplace">Marketplace</a> /
          Mortgage quote
        </div>
        <h1 class="page-title">Indicative mortgage quote</h1>
        <p class="page-intro">${escapeHtml(address)} · ${listing.bedrooms} bed ${escapeHtml(listing.propertyType.toLowerCase())}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Asking price</dt>
                <dd>${formatCurrency(quote.askingPrice)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative deposit (${quote.depositPct}%)</dt>
                <dd>${formatCurrency(quote.deposit)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative loan amount</dt>
                <dd>${formatCurrency(quote.loanAmount)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative interest rate</dt>
                <dd>${formatInterestRate(quote.interestRate)}</dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly payment</dt>
                <dd>${formatCurrency(quote.monthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated gross yield</dt>
                <dd>${formatPercent(quote.grossYield)}</dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative buy-to-let quote based on a ${quote.depositPct}% deposit and interest-only servicing at ${formatInterestRate(quote.interestRate)}. Subject to affordability, valuation and lending criteria.</p>
            ${renderLbgApplyButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if this acquisition completes.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After purchase</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioComparisonRow('Total portfolio value', formatCurrency(beforeMetrics.totalPortfolioValue), formatCurrency(afterMetrics.totalPortfolioValue))}
                  ${renderPortfolioComparisonRow('Total mortgage balance', formatCurrency(beforeMetrics.totalMortgageBalance), formatCurrency(afterMetrics.totalMortgageBalance))}
                  ${renderPortfolioComparisonRow('Total equity', beforeMetrics.hasEquityData ? formatCurrency(beforeMetrics.totalEquity) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatCurrency(afterMetrics.totalEquity) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Portfolio LTV', beforeMetrics.hasEquityData ? formatPercent(beforeMetrics.overallLtv) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatPercent(afterMetrics.overallLtv) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Total market rent', formatCurrency(beforeMetrics.totalMarketRent), formatCurrency(afterMetrics.totalMarketRent))}
                  ${renderPortfolioComparisonRow('Total achieved rent', renderRentAgreedDisplay(beforeMetrics.totalRentAgreed, true), renderRentAgreedDisplay(afterMetrics.totalRentAgreed, true))}
                  ${renderPortfolioComparisonRow('Gross yield', formatPercent(beforeMetrics.grossYield), formatPercent(afterMetrics.grossYield))}
                  ${renderPortfolioComparisonRow('Interest coverage ratio', formatPercent(beforeMetrics.icr), formatPercent(afterMetrics.icr))}
                  ${renderPortfolioComparisonRow('Properties held', String(beforeMetrics.totalProperties), String(afterMetrics.totalProperties))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/marketplace">Back to marketplace</a>
          <a class="btn btn-primary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderFinancialRefinanceOpportunity(property, index) {
  if (!hasRefinanceOpportunity(property)) return '';

  const quote = buildRefinanceQuote(property);
  const bestRateLabel = formatInterestRate(quote.bestRate);

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="Refinance opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Payment Saving Opportunity</h2>
          ${renderInfoTooltip('Your current mortgage rate is more than 0.5% above the indicative best buy-to-let deal. Refinancing may reduce monthly servicing costs and improve portfolio interest coverage.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          You may be paying <strong>${formatInterestRate(quote.currentRate)}</strong> — current best deals start from <strong>${bestRateLabel}</strong>.
        </p>
        <p class="opportunities-section__detail">
          Indicative saving of ${formatCurrency(quote.monthlySavings)} per month if you refinance at ${bestRateLabel} on your remaining balance of ${formatCurrency(quote.loanAmount)}.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/refinance-quote">View</a>
      </div>
    </section>
  `;
}

function renderFinancialRentReviewOpportunity(property, index) {
  if (!hasRentReviewOpportunity(property)) return '';

  const quote = buildRentReviewQuote(property);

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="Rent review opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Rent Opportunity</h2>
          ${renderInfoTooltip('Estimated market rent is more than £500 per month above your recorded achieved rent. A rent review may help align income with current market conditions.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          Achieved rent is <strong>${formatCurrency(quote.currentAchievedRent)}</strong> — estimated market rent is <strong>${formatCurrency(quote.marketRent)}</strong>.
        </p>
        <p class="opportunities-section__detail">
          Potential uplift of ${formatCurrency(quote.monthlyUplift)} per month (${formatCurrency(quote.annualUplift)} annually) if rent is brought in line with market levels.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/rent-review">View</a>
      </div>
    </section>
  `;
}

function renderEsgImprovementOpportunity(property, index) {
  if (!hasEpcImprovementOpportunity(property, { propertyIndex: index })) return '';

  const quote = buildEpcImprovementQuote(property, { propertyIndex: index });

  return `
    <section class="opportunities-section financial-opportunity-panel" aria-label="EPC improvement opportunity">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">EPC Improvement Opportunity</h2>
          ${renderInfoTooltip('Properties rated EPC D or below may not be lettable until improved to at least EPC C. Green home improvement finance may help fund energy efficiency works.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          Current rating is <strong>EPC ${quote.currentRating}</strong> — properties must reach at least EPC C to comply with lettings regulations.
        </p>
        <p class="opportunities-section__detail">
          Estimated cost of ${formatCurrency(quote.improvementCost)} to reach EPC ${quote.targetRating}. Review indicative green finance options with Lloyds.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${index}/epc-improvement">View</a>
      </div>
    </section>
  `;
}

function renderMarketplaceOpportunitySection(metrics, portfolio) {
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) return '';

  const opportunities = getPortfolioMarketOpportunities(portfolio.properties);
  if (opportunities.count === 0) return '';

  const areaLabel = opportunities.cities.length === 1
    ? opportunities.cities[0]
    : 'your portfolio areas';
  const maxPriceLabel = formatCurrency(MARKETPLACE_MAX_ASKING_PRICE);

  return `
    <section class="opportunities-section" aria-label="Investment opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Investment Opportunity</h2>
          ${renderInfoTooltip('Investment opportunities identified in markets where you already hold assets. Available equity may be used as a deposit to support leveraged buy-to-let acquisitions.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${opportunities.count}</strong> ${opportunities.count === 1 ? 'property is' : 'properties are'} available for sale in ${escapeHtml(areaLabel)} with estimated gross yields above 5%.
        </p>
        <p class="opportunities-section__detail">
          Based on your available equity, you may wish to review buy-to-let listings priced at ${maxPriceLabel} or below.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/marketplace">View</a>
      </div>
    </section>
  `;
}

function renderRefinanceOpportunitySection(portfolio) {
  const refinanceOpportunities = getPortfolioRefinanceOpportunities(portfolio.properties);
  if (refinanceOpportunities.length === 0) return '';

  const bestRateLabel = formatInterestRate(getCurrentBestMortgageRate());
  const first = refinanceOpportunities[0];
  const firstAddress = formatAddress(first.property);

  let message;
  if (refinanceOpportunities.length === 1) {
    message = `<strong>${escapeHtml(firstAddress)}</strong> may be paying above the current best mortgage rate of ${bestRateLabel}.`;
  } else {
    message = `<strong>${refinanceOpportunities.length}</strong> properties may be paying more than ${REFINANCE_RATE_THRESHOLD}% above the current best mortgage rate of ${bestRateLabel}.`;
  }

  const detail = refinanceOpportunities.length === 1
    ? `Your recorded rate is ${formatInterestRate(first.quote.currentRate)} — review refinancing options on the financials tab.`
    : `Start with ${escapeHtml(firstAddress)} (${formatInterestRate(first.quote.currentRate)}), then review other qualifying properties.`;

  return `
    <section class="opportunities-section" aria-label="Refinance opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Payment Saving Opportunity</h2>
          ${renderInfoTooltip('Properties where the recorded mortgage rate is more than 0.5% above the indicative best buy-to-let deal may benefit from refinancing.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">${message}</p>
        <p class="opportunities-section__detail">${detail}</p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/financials">View</a>
      </div>
    </section>
  `;
}

function renderRentReviewOpportunitySection(portfolio) {
  const rentReviewOpportunities = getPortfolioRentReviewOpportunities(portfolio.properties);
  if (rentReviewOpportunities.length === 0) return '';

  const first = rentReviewOpportunities[0];
  const firstAddress = formatAddress(first.property);

  return `
    <section class="opportunities-section" aria-label="Rent review opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">Rent Opportunity</h2>
          ${renderInfoTooltip('Properties where estimated market rent exceeds achieved rent by more than £500 per month may benefit from a rent review.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${escapeHtml(firstAddress)}</strong> may be under-rented by more than ${formatCurrency(RENT_REVIEW_GAP_THRESHOLD)} per month.
        </p>
        <p class="opportunities-section__detail">
          Achieved rent is ${formatCurrency(first.quote.currentAchievedRent)} against an estimated market rent of ${formatCurrency(first.quote.marketRent)} — review options on the financials tab.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/financials">View</a>
      </div>
    </section>
  `;
}

function renderEpcImprovementOpportunitySection(portfolio) {
  const epcOpportunities = getPortfolioEpcImprovementOpportunities(portfolio.properties);
  if (epcOpportunities.length === 0) return '';

  const first = epcOpportunities[0];
  const firstAddress = formatAddress(first.property);

  return `
    <section class="opportunities-section" aria-label="EPC improvement opportunities">
      <div class="opportunities-section__header">
        <div class="section-title-row">
          <h2 class="opportunities-section__title">EPC Improvement Opportunity</h2>
          ${renderInfoTooltip('Properties rated EPC D, E, F or G may not be lettable until improved to EPC A, B or C. Green home improvement finance may help fund energy efficiency works.')}
        </div>
      </div>
      <div class="opportunities-section__body">
        <p class="opportunities-section__message">
          <strong>${escapeHtml(firstAddress)}</strong> is rated EPC ${first.quote.currentRating} and may need improvement to EPC ${first.quote.targetRating} or above.
        </p>
        <p class="opportunities-section__detail">
          Estimated works cost ${formatCurrency(first.quote.improvementCost)} — review green finance options on the ESG &amp; Renovation tab.
        </p>
        <a class="btn opportunities-section__cta" href="#/portfolio/property/${first.index}/esg">View</a>
      </div>
    </section>
  `;
}

function renderPortfolioOpportunitySections(metrics, portfolio) {
  return [
    renderRefinanceOpportunitySection(portfolio),
    renderRentReviewOpportunitySection(portfolio),
    renderEpcImprovementOpportunitySection(portfolio),
    renderMarketplaceOpportunitySection(metrics, portfolio),
  ].filter(Boolean).join('');
}

function renderPropertyRefinanceQuote(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasRefinanceOpportunity(property)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const quote = buildRefinanceQuote(property);
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterRefinance(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/financials">Financials</a> /
          Refinance quote
        </div>
        <h1 class="page-title">Indicative refinance quote</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Remaining mortgage balance</dt>
                <dd>${formatCurrency(quote.loanAmount)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current interest rate</dt>
                <dd>${formatInterestRate(quote.currentRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative new rate</dt>
                <dd>${formatInterestRate(quote.bestRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Rate reduction</dt>
                <dd>${formatInterestRate(quote.rateDifference)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current monthly payment</dt>
                <dd>${formatCurrency(quote.currentMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Indicative new monthly payment</dt>
                <dd>${formatCurrency(quote.newMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly saving</dt>
                <dd>${formatCurrency(quote.monthlySavings)}<span class="cell-suffix">/mo</span></dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative refinance quote based on interest-only servicing at ${formatInterestRate(quote.bestRate)} on your existing balance. Subject to affordability, valuation, early repayment charges and lending criteria.</p>
            ${renderLbgApplyButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if this property is refinanced at the indicative rate.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After refinance</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioComparisonRow('Total portfolio value', formatCurrency(beforeMetrics.totalPortfolioValue), formatCurrency(afterMetrics.totalPortfolioValue))}
                  ${renderPortfolioComparisonRow('Total mortgage balance', formatCurrency(beforeMetrics.totalMortgageBalance), formatCurrency(afterMetrics.totalMortgageBalance))}
                  ${renderPortfolioComparisonRow('Total equity', beforeMetrics.hasEquityData ? formatCurrency(beforeMetrics.totalEquity) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatCurrency(afterMetrics.totalEquity) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Portfolio LTV', beforeMetrics.hasEquityData ? formatPercent(beforeMetrics.overallLtv) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatPercent(afterMetrics.overallLtv) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Total market rent', formatCurrency(beforeMetrics.totalMarketRent), formatCurrency(afterMetrics.totalMarketRent))}
                  ${renderPortfolioComparisonRow('Total achieved rent', renderRentAgreedDisplay(beforeMetrics.totalRentAgreed, true), renderRentAgreedDisplay(afterMetrics.totalRentAgreed, true))}
                  ${renderPortfolioComparisonRow('Gross yield', formatPercent(beforeMetrics.grossYield), formatPercent(afterMetrics.grossYield))}
                  ${renderPortfolioComparisonRow('Interest coverage ratio', formatPercent(beforeMetrics.icr), formatPercent(afterMetrics.icr))}
                  ${renderPortfolioComparisonRow('Properties held', String(beforeMetrics.totalProperties), String(afterMetrics.totalProperties))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/financials">Back to financials</a>
          <a class="btn btn-primary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderPropertyRentReview(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasRentReviewOpportunity(property)) {
    navigate(`/portfolio/property/${index}/financials`);
    return;
  }

  const quote = buildRentReviewQuote(property);
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterRentReview(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/financials">Financials</a> /
          Rent review
        </div>
        <h1 class="page-title">Rent review</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative uplift</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Current achieved rent</dt>
                <dd>${formatCurrency(quote.currentAchievedRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item">
                <dt>Estimated market rent</dt>
                <dd>${formatCurrency(quote.marketRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item">
                <dt>Proposed achieved rent</dt>
                <dd>${formatCurrency(quote.proposedAchievedRent)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated monthly uplift</dt>
                <dd>${formatCurrency(quote.monthlyUplift)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Estimated annual uplift</dt>
                <dd>${formatCurrency(quote.annualUplift)}</dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative rent review based on PriceHubble estimated market rent. Actual achievable rent depends on tenancy terms, notice periods and local market conditions.</p>
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if achieved rent is brought in line with market rent for this property.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After rent review</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioComparisonRow('Total portfolio value', formatCurrency(beforeMetrics.totalPortfolioValue), formatCurrency(afterMetrics.totalPortfolioValue))}
                  ${renderPortfolioComparisonRow('Total mortgage balance', formatCurrency(beforeMetrics.totalMortgageBalance), formatCurrency(afterMetrics.totalMortgageBalance))}
                  ${renderPortfolioComparisonRow('Total equity', beforeMetrics.hasEquityData ? formatCurrency(beforeMetrics.totalEquity) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatCurrency(afterMetrics.totalEquity) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Portfolio LTV', beforeMetrics.hasEquityData ? formatPercent(beforeMetrics.overallLtv) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatPercent(afterMetrics.overallLtv) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Total market rent', formatCurrency(beforeMetrics.totalMarketRent), formatCurrency(afterMetrics.totalMarketRent))}
                  ${renderPortfolioComparisonRow('Total achieved rent', renderRentAgreedDisplay(beforeMetrics.totalRentAgreed, true), renderRentAgreedDisplay(afterMetrics.totalRentAgreed, true))}
                  ${renderPortfolioComparisonRow('Gross yield', formatPercent(beforeMetrics.grossYield), formatPercent(afterMetrics.grossYield))}
                  ${renderPortfolioComparisonRow('Interest coverage ratio', formatPercent(beforeMetrics.icr), formatPercent(afterMetrics.icr))}
                  ${renderPortfolioComparisonRow('Properties held', String(beforeMetrics.totalProperties), String(afterMetrics.totalProperties))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/financials">Back to financials</a>
          ${renderDataloftReportButton()}
          <a class="btn btn-tertiary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderPropertyEpcImprovement(index) {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const property = getPortfolioProperty(index);
  if (!property) {
    navigate('/portfolio/summary');
    return;
  }

  if (!hasEpcImprovementOpportunity(property, { propertyIndex: index })) {
    navigate(`/portfolio/property/${index}/esg`);
    return;
  }

  const quote = buildEpcImprovementQuote(property, { propertyIndex: index });
  const beforeMetrics = computePortfolioMetrics(portfolio.properties);
  const afterMetrics = computePortfolioMetricsAfterEpcImprovement(portfolio.properties, index, quote);
  const address = formatAddress(property);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          <a href="#/portfolio/property/${index}/esg">ESG &amp; Renovation</a> /
          Green finance
        </div>
        <h1 class="page-title">Indicative green finance quote</h1>
        <p class="page-intro">${escapeHtml(address)}</p>

        <div class="quote-layout">
          <section class="card quote-summary">
            <h2 class="section-title">Indicative terms</h2>
            <dl class="quote-summary__grid">
              <div class="quote-summary__item">
                <dt>Current EPC rating</dt>
                <dd>EPC ${quote.currentRating}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Target EPC rating</dt>
                <dd>EPC ${quote.targetRating}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Estimated improvement cost</dt>
                <dd>${formatCurrency(quote.improvementCost)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative additional borrowing</dt>
                <dd>${formatCurrency(quote.additionalLoan)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Indicative interest rate</dt>
                <dd>${formatInterestRate(quote.interestRate)}</dd>
              </div>
              <div class="quote-summary__item">
                <dt>Current monthly payment</dt>
                <dd>${formatCurrency(quote.currentMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Additional monthly payment</dt>
                <dd>${formatCurrency(quote.additionalMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
              <div class="quote-summary__item quote-summary__item--highlight">
                <dt>Indicative new monthly payment</dt>
                <dd>${formatCurrency(quote.newMonthlyPayment)}<span class="cell-suffix">/mo</span></dd>
              </div>
            </dl>
            <p class="quote-summary__note">Illustrative green home improvement finance to fund energy efficiency works and bring the property to EPC ${quote.targetRating}. Subject to affordability, valuation, works specification and lending criteria. Properties rated EPC D or below may not be lettable until improved to at least EPC C.</p>
            ${renderLbgApplyButton()}
          </section>

          <section class="card quote-comparison">
            <h2 class="section-title">Portfolio impact</h2>
            <p class="quote-comparison__intro">Estimated effect on your portfolio summary if green finance is used to fund EPC improvement works for this property.</p>
            <div class="data-table-wrap">
              <table class="data-table quote-comparison__table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Current portfolio</th>
                    <th scope="col">After improvement</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderPortfolioComparisonRow('Total portfolio value', formatCurrency(beforeMetrics.totalPortfolioValue), formatCurrency(afterMetrics.totalPortfolioValue))}
                  ${renderPortfolioComparisonRow('Total mortgage balance', formatCurrency(beforeMetrics.totalMortgageBalance), formatCurrency(afterMetrics.totalMortgageBalance))}
                  ${renderPortfolioComparisonRow('Total equity', beforeMetrics.hasEquityData ? formatCurrency(beforeMetrics.totalEquity) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatCurrency(afterMetrics.totalEquity) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Portfolio LTV', beforeMetrics.hasEquityData ? formatPercent(beforeMetrics.overallLtv) : renderMissingIndicator(), afterMetrics.hasEquityData ? formatPercent(afterMetrics.overallLtv) : renderMissingIndicator())}
                  ${renderPortfolioComparisonRow('Total market rent', formatCurrency(beforeMetrics.totalMarketRent), formatCurrency(afterMetrics.totalMarketRent))}
                  ${renderPortfolioComparisonRow('Total achieved rent', renderRentAgreedDisplay(beforeMetrics.totalRentAgreed, true), renderRentAgreedDisplay(afterMetrics.totalRentAgreed, true))}
                  ${renderPortfolioComparisonRow('Gross yield', formatPercent(beforeMetrics.grossYield), formatPercent(afterMetrics.grossYield))}
                  ${renderPortfolioComparisonRow('Interest coverage ratio', formatPercent(beforeMetrics.icr), formatPercent(afterMetrics.icr))}
                  ${renderPortfolioComparisonRow('Properties held', String(beforeMetrics.totalProperties), String(afterMetrics.totalProperties))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="btn-group">
          <a class="btn btn-secondary" href="#/portfolio/property/${index}/esg">Back to ESG &amp; Renovation</a>
          <a class="btn btn-tertiary" href="#/portfolio/summary">Return to portfolio</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
}

function renderMarketplaceEpcFilter() {
  return `
    <div class="marketplace-epc-filter" role="group" aria-label="Filter listings by EPC rating">
      <span class="marketplace-epc-filter__label">EPC filter</span>
      <div class="marketplace-epc-filter__options">
        <button
          type="button"
          class="marketplace-epc-filter__option${marketplaceEpcFilter === 'compliant' ? ' is-active' : ''}"
          data-epc-filter="compliant"
          aria-pressed="${marketplaceEpcFilter === 'compliant'}"
        >EPC A–C</button>
        <button
          type="button"
          class="marketplace-epc-filter__option${marketplaceEpcFilter === 'all' ? ' is-active' : ''}"
          data-epc-filter="all"
          aria-pressed="${marketplaceEpcFilter === 'all'}"
        >All EPC</button>
      </div>
    </div>
  `;
}

function renderMarketplaceCard(listing) {
  const address = formatAddress(listing);
  const epcRating = String(listing.epcRating || '—').toUpperCase();
  const epcCompliant = isCompliantEpcRating(listing.epcRating);

  return `
    <article class="marketplace-card">
      <div class="marketplace-card__media" aria-hidden="true">
        <span class="marketplace-card__media-label">${escapeHtml(listing.propertyType)}</span>
        <span class="marketplace-card__epc-badge marketplace-card__epc-badge--${epcRating.toLowerCase()}${epcCompliant ? ' marketplace-card__epc-badge--compliant' : ''}">EPC ${epcRating}</span>
      </div>
      <div class="marketplace-card__body">
        <p class="marketplace-card__meta">${listing.bedrooms} bed ${escapeHtml(listing.propertyType.toLowerCase())} · ${escapeHtml(listing.city)}</p>
        <h3 class="marketplace-card__address">${escapeHtml(address)}</h3>
        <dl class="marketplace-card__stats">
          <div class="marketplace-card__stat">
            <dt>Asking price</dt>
            <dd>${formatCurrency(listing.askingPrice)}</dd>
          </div>
          <div class="marketplace-card__stat">
            <dt>Estimated market rent</dt>
            <dd>${formatCurrency(listing.marketRent)}<span class="cell-suffix">/mo</span></dd>
          </div>
          <div class="marketplace-card__stat">
            <dt>EPC rating</dt>
            <dd><span class="marketplace-card__epc-value marketplace-card__epc-value--${epcRating.toLowerCase()}">${epcRating}</span></dd>
          </div>
          <div class="marketplace-card__stat marketplace-card__stat--highlight">
            <dt>Estimated gross yield</dt>
            <dd>${formatPercent(listing.grossYield)}</dd>
          </div>
        </dl>
        <a class="btn btn-primary marketplace-card__cta" href="#/portfolio/marketplace/quote/${escapeHtml(listing.id)}">Get mortgage quote</a>
      </div>
    </article>
  `;
}

function bindMarketplaceEpcFilter() {
  document.querySelectorAll('[data-epc-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      marketplaceEpcFilter = button.dataset.epcFilter;
      renderMarketplace();
    });
  });
}

function renderMarketplace() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  const metrics = computePortfolioMetrics(portfolio.properties);
  if (!metrics.hasEquityData || metrics.totalEquity <= OPPORTUNITY_EQUITY_THRESHOLD) {
    navigate('/portfolio/summary');
    return;
  }

  const opportunities = getPortfolioMarketOpportunities(portfolio.properties);
  const filteredListings = filterMarketplaceByEpc(opportunities.listings, marketplaceEpcFilter);
  const areaLabel = opportunities.cities.length === 1
    ? opportunities.cities[0]
    : 'your portfolio areas';
  const maxPriceLabel = formatCurrency(MARKETPLACE_MAX_ASKING_PRICE);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb">
          <a href="#/dashboard">Dashboard</a> /
          <a href="#/portfolio/summary">Portfolio summary</a> /
          Marketplace
        </div>
        <h1 class="page-title">Investment marketplace</h1>
        <p class="page-intro">Buy-to-let listings in ${escapeHtml(areaLabel)} priced at ${maxPriceLabel} or below with estimated gross yields of 5% or above.</p>

        ${opportunities.listings.length === 0 ? `
          <div class="card">
            <p class="empty-state-text">No qualifying listings are currently available in your portfolio areas.</p>
            <div class="btn-group">
              <a class="btn btn-secondary" href="#/portfolio/summary">Back to portfolio</a>
            </div>
          </div>
        ` : `
          ${renderMarketplaceEpcFilter()}
          ${filteredListings.length === 0 ? `
            <div class="card marketplace-empty-filter">
              <p class="empty-state-text">No listings match the EPC A–C filter in your portfolio areas. Switch to All EPC to see every available property.</p>
            </div>
          ` : `
            <p class="marketplace-results-count">${filteredListings.length} ${filteredListings.length === 1 ? 'listing' : 'listings'} shown</p>
            <div class="marketplace-grid">
              ${filteredListings.map((listing) => renderMarketplaceCard(listing)).join('')}
            </div>
          `}
          <div class="btn-group">
            <a class="btn btn-secondary" href="#/portfolio/summary">Back to portfolio</a>
          </div>
        `}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  bindMarketplaceEpcFilter();
}

function renderPortfolioEquityMetric(metrics) {
  if (!metrics.hasEquityData) {
    return renderPortfolioMetric('Total equity', '—', {
      sub: 'Add mortgage details to a property to calculate equity',
    });
  }

  const equitySub = metrics.equityPropertyCount < metrics.totalProperties
    ? `Based on ${metrics.equityPropertyCount} of ${metrics.totalProperties} properties with mortgage details recorded`
    : null;

  return renderPortfolioMetric('Total equity', formatCurrency(metrics.totalEquity), { sub: equitySub });
}

function renderPortfolioLtvMetric(metrics) {
  if (!metrics.hasEquityData) {
    return renderPortfolioMetric('Portfolio LTV', '—');
  }

  return renderPortfolioMetric('Portfolio LTV', formatPercent(metrics.overallLtv));
}

function renderPortfolioReport(metrics) {
  const change = metrics.portfolioValueChange3m || {};
  const changeTone = change.pct == null ? null : change.pct >= 0 ? 'up' : 'down';
  const changeSub = change.pct != null
    ? `${change.pct >= 0 ? '+' : ''}${change.pct}% over 3 months`
    : null;

  return `
    <section class="portfolio-report" aria-label="Portfolio summary">
      <div class="portfolio-report__header">
        <div class="section-title-row">
          <h2 class="portfolio-report__title">Portfolio overview</h2>
          ${renderInfoTooltip('High-level portfolio summary continuously updated with the latest property data to provide an accurate view of how your investments are performing. Value data is monitored 24/7, so you\'re always the first to know about changes.')}
        </div>
      </div>
      <div class="portfolio-report__columns">
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Value &amp; equity</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Total portfolio value', formatCurrency(metrics.totalPortfolioValue), { highlight: true })}
            ${renderPortfolioMetric('Total mortgage balance', formatCurrency(metrics.totalMortgageBalance))}
            ${renderPortfolioEquityMetric(metrics)}
            ${renderPortfolioLtvMetric(metrics)}
          </div>
        </div>
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Income &amp; occupancy</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Total market rent', formatCurrency(metrics.totalMarketRent), { highlight: true })}
            ${renderPortfolioMetric('Total achieved rent', renderRentAgreedDisplay(metrics.totalRentAgreed, true), { highlight: true })}
            ${renderPortfolioMetric('Occupied properties', escapeHtml(metrics.occupancyFraction), {
    sub: metrics.totalProperties > 0 ? `${metrics.occupiedCount} of ${metrics.totalProperties} let` : null,
  })}
          </div>
        </div>
        <div class="portfolio-report__column">
          <h3 class="portfolio-report__column-title">Performance</h3>
          <div class="portfolio-report__grid">
            ${renderPortfolioMetric('Gross yield', formatPercent(metrics.grossYield))}
            ${renderPortfolioMetric('Interest coverage ratio', formatPercent(metrics.icr))}
            ${renderPortfolioMetric('Portfolio value change (3 months)', formatCurrencyChange(change.amount), {
    tone: changeTone,
    sub: changeSub,
  })}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      © Lloyds Banking Group plc ${new Date().getFullYear()}. Demonstration prototype only.
    </footer>
  `;
}

function renderAccessGate() {
  app.innerHTML = `
    <div class="access-gate" id="access-gate">
      <div class="access-gate__panel">
        <img
          class="access-gate__logo"
          src="assets/pricehubble-logo.svg"
          alt="PriceHubble"
          width="200"
          height="46"
        >
        <h1 class="access-gate__title">PriceHubble Demo Centre</h1>
        <form class="passcode-form" id="passcode-form" autocomplete="off">
          <div class="passcode-boxes" role="group" aria-label="Access code">
            ${[0, 1, 2, 3, 4, 5].map((i) => `
              <input
                class="passcode-digit"
                id="passcode-${i}"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="1"
                autocomplete="off"
                aria-label="Digit ${i + 1}"
              >
            `).join('')}
          </div>
          <p class="passcode-error" id="passcode-error" hidden>Incorrect code</p>
        </form>
      </div>
    </div>
  `;

  document.title = PAGE_TITLES.gate;
  bindPasscodeInputs();
}

function bindPasscodeInputs() {
  const inputs = [...document.querySelectorAll('.passcode-digit')];
  const errorEl = document.getElementById('passcode-error');
  const gate = document.getElementById('access-gate');

  const clearError = () => {
    errorEl.hidden = true;
    gate?.classList.remove('access-gate--error');
  };

  const getCode = () => inputs.map((input) => input.value).join('');

  const resetInputs = () => {
    inputs.forEach((input) => {
      input.value = '';
    });
    inputs[0]?.focus();
  };

  const submitCode = () => {
    const code = getCode();
    if (code.length < 6) return;

    if (isAccessCodeValid(code)) {
      state.accessGranted = true;
      saveState(state);
      navigate('/login');
      render();
      return;
    }

    errorEl.hidden = false;
    gate?.classList.add('access-gate--error');
    resetInputs();
  };

  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      clearError();
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      if (getCode().length === 6) {
        submitCode();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      clearError();
      const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      digits.split('').forEach((digit, i) => {
        if (inputs[i]) inputs[i].value = digit;
      });
      if (digits.length === 6) {
        submitCode();
      } else if (digits.length > 0) {
        inputs[Math.min(digits.length, inputs.length - 1)]?.focus();
      }
    });
  });

  inputs[0]?.focus();
}

function renderLogin() {
  app.innerHTML = `
    <div class="demo-banner demo-banner--login">Demonstration prototype — not a live banking service. Hosted by WhenFresh for RFP presentation. No credentials are collected.</div>
    <div class="login-page">
      <div class="login-hero">
        ${LBG_LOGO.replace('fill="black"', 'fill="white"').replace('fill="#006A4A"', 'fill="#9fd4b8"')}
        <h1>Investor Landlord Portal</h1>
        <p>Demonstration of a buy-to-let portfolio experience. Branding is illustrative only — this is not lloydsbank.com or any live bank website.</p>
      </div>
      <div class="login-panel">
        <div class="login-card">
          <h2>Enter demo</h2>
          <p class="hint">This prototype uses click-through access only. There is no real sign-in and nothing you enter is transmitted or stored.</p>
          <form id="login-form">
            <button type="submit" class="btn btn-primary">Continue to demo</button>
          </form>
          <div class="login-demo-note">
            <strong>Safe to explore:</strong> All portfolio data is fictional and runs entirely in your browser.
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.loggedIn = true;
    saveState(state);
    navigate('/dashboard');
  });
}

function renderDashboard() {
  const hasPortfolio = state.portfolio && state.portfolio.properties.length > 0;
  if (hasPortfolio) syncPortfolioAvm(state.portfolio);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <h1 class="page-title">Welcome back</h1>
        <p class="page-subtitle">Manage your buy-to-let property portfolio.</p>

        ${hasPortfolio ? `
          <div class="alert alert-success">
            Portfolio <strong>${escapeHtml(state.portfolio.name)}</strong> — ${state.portfolio.properties.length} propert${state.portfolio.properties.length === 1 ? 'y' : 'ies'}.
          </div>
          ${renderPortfolioReport(computePortfolioMetrics(state.portfolio.properties))}
          <div class="btn-group">
            <a class="btn btn-primary" href="#/portfolio/summary">View portfolio</a>
            <button class="btn btn-secondary" data-action="create-new">Create another portfolio</button>
          </div>
        ` : `
          <div class="card">
            <h2 class="section-title">Get started</h2>
            <p style="color: var(--lbg-text-muted); margin: 0 0 8px;">You don't have a portfolio yet. Create one by adding properties individually or uploading a CSV file.</p>
            <div class="btn-group">
              <a class="btn btn-primary" href="#/portfolio/create">Create new portfolio</a>
            </div>
          </div>
        `}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  document.querySelector('[data-action="create-new"]')?.addEventListener('click', () => {
    draftPortfolio = { name: '', properties: [] };
    state.draftPortfolio = draftPortfolio;
    saveState(state);
    navigate('/portfolio/create');
  });
}

function renderCreatePortfolio() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / Create portfolio</div>
        <h1 class="page-title">Create new portfolio</h1>
        <p class="page-subtitle">Give your portfolio a name, then choose how to add properties.</p>

        <div class="card">
          <form id="portfolio-name-form">
            <div class="form-group">
              <label for="portfolio-name">Portfolio name</label>
              <input id="portfolio-name" name="portfolioName" type="text" required placeholder="e.g. Northern Buy-to-Let Portfolio" value="${escapeHtml(draftPortfolio.name)}">
            </div>
          </form>
        </div>

        <h2 class="section-title">How would you like to add properties?</h2>
        <div class="card-grid">
          <button class="choice-card" data-method="manual">
            <div class="choice-card__icon">✎</div>
            <h3 class="choice-card__title">Manual entry</h3>
            <p class="choice-card__desc">Enter a postcode, pick from matching registered addresses, and add properties one at a time.</p>
          </button>
          <button class="choice-card" data-method="csv">
            <div class="choice-card__icon">↑</div>
            <h3 class="choice-card__title">Bulk import</h3>
            <p class="choice-card__desc">Upload a CSV file with multiple properties. Download our template to get started.</p>
          </button>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();

  const nameInput = document.getElementById('portfolio-name');
  nameInput.addEventListener('input', () => {
    draftPortfolio.name = nameInput.value;
    state.draftPortfolio = draftPortfolio;
    saveState(state);
  });

  document.querySelectorAll('[data-method]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        nameInput.reportValidity();
        return;
      }
      draftPortfolio.name = name;
      state.draftPortfolio = draftPortfolio;
      manualEntryDraft = {};
      manualEntryErrors = {};
      pendingBulkImport = null;
      saveState(state);
      navigate(btn.dataset.method === 'manual' ? '/portfolio/add' : '/portfolio/upload');
    });
  });
}

function renderManualEntryField(field, values = {}, errors = {}) {
  const hasError = Boolean(errors[field]);
  const errorHtml = `<div class="field-error" id="error-${field}">${hasError ? escapeHtml(errors[field]) : ''}</div>`;

  return `
    <div class="form-group">
      <label for="${field}">${FIELD_LABELS[field]}</label>
      <input
        id="${field}"
        name="${field}"
        type="text"
        required
        class="${hasError ? 'input-error' : ''}"
        value="${escapeHtml(values[field] || '')}"
      >
      ${errorHtml}
    </div>
  `;
}

function renderManualEntryForm(values = {}, errors = {}) {
  const matches = searchAddressesByPostcode(values.postcode || '');
  const pickerVisible = matches.length > 0;

  return `
    <div class="postcode-lookup-row">
      ${renderManualEntryField('postcode', values, errors)}
      <div class="form-group" id="property-picker-group" ${pickerVisible ? '' : 'hidden'}>
        <label for="property-picker">Matching properties</label>
        <select id="property-picker" name="propertyPicker">
          <option value="">Select a property…</option>
          ${matches.map((entry) => `
            <option
              value="${entry.id}"
              ${values.addressId === entry.id ? 'selected' : ''}
            >${escapeHtml(`${entry.propertyNumber} ${entry.street}, ${entry.city}`)}</option>
          `).join('')}
        </select>
        <div class="field-error" aria-hidden="true">&nbsp;</div>
      </div>
    </div>
    ${renderManualEntryField('titleRef', values, errors)}
    <div class="form-row">
      ${renderManualEntryField('propertyNumber', values, errors)}
      ${renderManualEntryField('street', values, errors)}
    </div>
    ${renderManualEntryField('city', values, errors)}
  `;
}

function renderValidationInput(rowIndex, field, value, hasError) {
  return `
    <input
      type="text"
      class="validation-table__input${hasError ? ' input-error' : ''}"
      data-row="${rowIndex}"
      data-field="${field}"
      value="${escapeHtml(value || '')}"
      aria-label="${escapeHtml(FIELD_LABELS[field])}"
      aria-invalid="${hasError ? 'true' : 'false'}"
    >
  `;
}

function renderBulkValidationPanel(result) {
  if (!result || !result.rows.length) return '';

  const hasInvalidRows = result.invalidCount > 0;

  return `
    <div class="card" id="bulk-validation-panel">
      <h2 class="section-title">Import validation</h2>
      ${hasInvalidRows ? `
        <p class="validation-panel__intro">Edit any rows with issues below, then click <strong>Try again</strong> to re-validate your data.</p>
      ` : ''}
      <div class="validation-summary">
        <span class="validation-summary__item validation-summary__item--valid">${result.validCount} valid</span>
        <span class="validation-summary__item validation-summary__item--invalid">${result.invalidCount} with issues</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table validation-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Title / Ref</th>
              <th>Postcode</th>
              <th>Property number</th>
              <th>Street</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${result.rows.map((row, rowIndex) => `
              <tr class="${row.valid ? '' : 'row-invalid'}">
                <td>${row.line}</td>
                <td>${renderValidationInput(rowIndex, 'titleRef', row.property.titleRef, !!row.errors?.titleRef)}</td>
                <td>${renderValidationInput(rowIndex, 'postcode', row.property.postcode, !!row.errors?.postcode)}</td>
                <td>${renderValidationInput(rowIndex, 'propertyNumber', row.property.propertyNumber, !!row.errors?.propertyNumber)}</td>
                <td>${renderValidationInput(rowIndex, 'street', row.property.street, !!row.errors?.street)}</td>
                <td>${renderValidationInput(rowIndex, 'city', row.property.city, !!row.errors?.city)}</td>
                <td class="${row.valid ? '' : 'cell-error'}">${escapeHtml(row.summary)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="btn-group">
        ${hasInvalidRows ? '<button type="button" class="btn btn-secondary" id="bulk-revalidate-btn">Try again</button>' : ''}
        ${result.validCount > 0 ? `
          <button type="button" class="btn btn-primary" id="import-valid-btn">Import ${result.validCount} valid propert${result.validCount === 1 ? 'y' : 'ies'}</button>
        ` : ''}
      </div>
      ${result.validCount === 0 ? `
        <div class="alert" style="margin-top:16px;background:#fde8ec;color:#8a1530;border:1px solid #f5c2cb;">
          No valid properties to import. Correct the issues above and try again.
        </div>
      ` : ''}
    </div>
  `;
}

function collectBulkImportRowsFromPanel() {
  const panel = document.getElementById('bulk-validation-panel');
  if (!panel || !pendingBulkImport) return [];

  return pendingBulkImport.rows.map((row, rowIndex) => {
    const property = { ...row.property };
    REQUIRED_FIELDS.forEach((field) => {
      const input = panel.querySelector(`[data-row="${rowIndex}"][data-field="${field}"]`);
      if (input) property[field] = input.value.trim();
    });
    return { line: row.line, property };
  });
}

function applyBulkImportResult(result) {
  pendingBulkImport = result;

  if (!result.rows.length) {
    renderUploadCsv();
    return;
  }

  if (result.invalidCount === 0) {
    finalizeBulkImport(result.validProperties);
    return;
  }

  renderUploadCsv();
}

function bindBulkValidationPanel() {
  document.getElementById('bulk-revalidate-btn')?.addEventListener('click', () => {
    const rows = collectBulkImportRowsFromPanel();
    applyBulkImportResult(validateImportRows(rows));
  });

  document.getElementById('import-valid-btn')?.addEventListener('click', () => {
    if (pendingBulkImport?.validCount) {
      finalizeBulkImport(pendingBulkImport.validProperties);
    }
  });
}

function bindManualEntryForm() {
  const postcodeInput = document.getElementById('postcode');
  const picker = document.getElementById('property-picker');
  const pickerGroup = document.getElementById('property-picker-group');
  const form = document.getElementById('property-form');

  const refreshPicker = () => {
    const matches = searchAddressesByPostcode(postcodeInput.value);
    if (!pickerGroup || !picker) return;

    if (!matches.length) {
      pickerGroup.hidden = true;
      picker.innerHTML = '<option value="">Select a property…</option>';
      return;
    }

    pickerGroup.hidden = false;
    const current = picker.value;
    picker.innerHTML = `
      <option value="">Select a property…</option>
      ${matches.map((entry) => `
        <option value="${entry.id}">${escapeHtml(`${entry.propertyNumber} ${entry.street}, ${entry.city}`)}</option>
      `).join('')}
    `;
    if (matches.some((entry) => entry.id === current)) {
      picker.value = current;
    }
  };

  postcodeInput?.addEventListener('input', () => {
    clearManualFieldError('postcode');
    refreshPicker();
  });

  picker?.addEventListener('change', () => {
    const matches = searchAddressesByPostcode(postcodeInput.value);
    const selected = matches.find((entry) => entry.id === picker.value);
    if (!selected) return;

    document.getElementById('propertyNumber').value = selected.propertyNumber;
    document.getElementById('street').value = selected.street;
    document.getElementById('city').value = selected.city;
    ['propertyNumber', 'street', 'city'].forEach(clearManualFieldError);
  });

  REQUIRED_FIELDS.forEach((field) => {
    document.getElementById(field)?.addEventListener('input', () => clearManualFieldError(field));
  });

  document.querySelectorAll('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyManualScenario(btn.dataset.scenario);
    });
  });

  form?.addEventListener('submit', handleManualEntrySubmit);
}

function clearManualFieldError(field) {
  manualEntryErrors[field] = '';
  const input = document.getElementById(field);
  const errorEl = document.getElementById(`error-${field}`);
  input?.classList.remove('input-error');
  if (errorEl) errorEl.textContent = '';
}

function applyManualScenario(scenario) {
  const demo = scenario === 'perfect' ? DEMO_MANUAL_PERFECT : DEMO_MANUAL_IMPERFECT;
  manualEntryErrors = {};
  manualEntryDraft = { ...demo };

  if (scenario === 'imperfect') {
    manualEntryDraft.titleRef = '';
    manualEntryDraft.street = DEMO_MANUAL_IMPERFECT.street;
    manualEntryDraft.addressId = '';
  }

  renderAddProperty();
}

function handleManualEntrySubmit(e) {
  e.preventDefault();
  const property = collectPropertyFromForm(e.target, false);
  manualEntryDraft = {
    ...property,
    addressId: document.getElementById('property-picker')?.value || '',
  };
  const { valid, errors } = validateProperty(property);

  if (!valid) {
    manualEntryErrors = errors;
    renderAddProperty();
    return;
  }

  manualEntryErrors = {};
  manualEntryDraft = {};
  draftPortfolio.properties.push(enrichPropertyWithAvm(property));
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  renderAddProperty();
}

function finalizeBulkImport(validProperties) {
  state.portfolio = {
    name: draftPortfolio.name,
    properties: enrichProperties(validProperties),
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  pendingBulkImport = null;
  saveState(state);
  navigate('/portfolio/summary');
}

function renderAddProperty() {
  const propertyCount = draftPortfolio.properties.length;

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Manual entry</div>
        <h1 class="page-title">Manual entry</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong> · ${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} added</p>

        ${propertyCount > 0 ? `
          <div class="alert alert-info">${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} in this portfolio so far. Add more below or finish when ready.</div>
        ` : ''}

        <div class="card">
          <div class="scenario-panel">
            <p class="scenario-panel__label">Demo scenarios</p>
            <div class="btn-group" style="margin-top: 0;">
              <button type="button" class="btn btn-secondary" data-scenario="perfect">Perfect entry</button>
              <button type="button" class="btn btn-tertiary" data-scenario="imperfect">Entry with errors</button>
            </div>
          </div>

          <form id="property-form">
            ${renderManualEntryForm(manualEntryDraft, manualEntryErrors)}
            <div class="btn-group">
              <button type="submit" class="btn btn-primary">Add property</button>
              ${propertyCount > 0 ? '<button type="button" class="btn btn-secondary" id="finish-btn">Finish portfolio</button>' : ''}
              <a class="btn btn-tertiary" href="#/portfolio/create">Back</a>
            </div>
          </form>
        </div>

        ${propertyCount > 0 ? renderPropertyList(draftPortfolio.properties) : ''}
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  bindManualEntryForm();
  document.getElementById('finish-btn')?.addEventListener('click', finishPortfolio);
}

function renderUploadCsv() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Bulk import</div>
        <h1 class="page-title">Bulk import</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong></p>

        <div class="card">
          <p style="margin-top: 0;">Download the CSV template, fill in your property details, then upload the file. Required columns: Title/Ref, Postcode, Property number, Street, City.</p>
          <div class="scenario-panel">
            <p class="scenario-panel__label">Demo scenarios</p>
            <div class="btn-group" style="margin-top: 0;">
              <button type="button" class="btn btn-secondary" data-csv="perfect">Perfect import</button>
              <button type="button" class="btn btn-secondary" data-csv="errors">Import with errors</button>
            </div>
          </div>
          <div class="btn-group" style="margin-top: 0;">
            <a class="btn btn-secondary" href="assets/portfolio-template.csv" download="portfolio-template.csv">Download template</a>
          </div>
        </div>

        <div class="card">
          <div class="upload-zone" id="upload-zone">
            <div class="upload-zone__icon">📄</div>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <label class="btn btn-primary" for="csv-input">Choose file</label>
            <input type="file" id="csv-input" accept=".csv,text/csv">
          </div>
          <div id="upload-result">${pendingBulkImport ? renderBulkValidationPanel(pendingBulkImport) : ''}</div>
        </div>

        <div class="btn-group">
          <a class="btn btn-tertiary" href="#/portfolio/create">Back</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  setupCsvUpload();
  bindBulkValidationPanel();
  document.querySelectorAll('[data-csv]').forEach((btn) => {
    btn.addEventListener('click', () => loadSampleCsv(btn.dataset.csv));
  });
}

function syncPortfolioAvm(portfolio) {
  portfolio.properties = enrichProperties(portfolio.properties);
  saveState(state);
}

function renderSummary() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  syncPortfolioAvm(portfolio);
  const metrics = computePortfolioMetrics(portfolio.properties);

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / Portfolio summary</div>
        <h1 class="page-title">${escapeHtml(portfolio.name)}</h1>

        ${renderPortfolioReport(metrics)}

        ${renderPortfolioFinancialCompletionBanner(portfolio.properties)}

        ${renderPortfolioOpportunitySections(metrics, portfolio)}

        <div class="card">
          <div class="portfolio-properties-header">
            <div class="section-title-row">
              <h2 class="section-title">Portfolio properties</h2>
              ${renderInfoTooltip('Properties currently held in your portfolio, showing key performance metrics for at-a-glance monitoring. Value data is monitored 24/7, so you\'re always the first to know about changes. Select a property to view the full asset profile.')}
            </div>
            <a class="btn btn-secondary" href="#/portfolio/summary/add">Add property</a>
          </div>
          ${portfolio.properties.length === 0 ? `
            <p class="empty-state-text">No properties are currently held in this portfolio. <a href="#/portfolio/summary/add">Add a property</a> to begin monitoring performance.</p>
          ` : `
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Address</th>
                  <th>Estimated value</th>
                  <th>Market rent</th>
                  <th>Achieved rent</th>
                  <th>Occupancy</th>
                  <th>Mortgage payment</th>
                  <th>Mortgage rate</th>
                </tr>
              </thead>
              <tbody>
                ${metrics.properties.map((p, index) => `
                  <tr
                    class="data-table__row--clickable"
                    data-action="view-property"
                    data-index="${index}"
                    tabindex="0"
                    role="link"
                    aria-label="View ${escapeHtml(p.titleRef)}"
                  >
                    <td><strong>${escapeHtml(p.titleRef)}</strong></td>
                    <td>${escapeHtml(formatAddress(p))}</td>
                    <td>${renderLineCurrencyPlain(p.avmValue)}</td>
                    <td>${renderLineCurrency(p.marketRent)}</td>
                    <td>${renderRentAgreedDisplay(p.rentAgreed)}</td>
                    <td>${renderLineOccupancy(p.occupancy)}</td>
                    <td>${renderLineCurrency(p.monthlyPayments)}</td>
                    <td>${renderLineInterestRate(p.interestRate)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          `}
        </div>

        <div class="btn-group">
          <a class="btn btn-primary" href="#/dashboard">Back to dashboard</a>
          <button class="btn btn-secondary" data-action="create-new">Create another portfolio</button>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  document.querySelector('[data-action="create-new"]')?.addEventListener('click', () => {
    draftPortfolio = { name: '', properties: [] };
    state.draftPortfolio = draftPortfolio;
    saveState(state);
    navigate('/portfolio/create');
  });

  document.querySelectorAll('[data-action="view-property"]').forEach((row) => {
    const openProperty = () => {
      const property = portfolio.properties[Number(row.dataset.index)];
      const tab = property ? getPropertyDefaultTab(property) : 'overview';
      navigate(`/portfolio/property/${row.dataset.index}/${tab}`);
    };
    row.addEventListener('click', openProperty);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProperty();
      }
    });
  });
}

function renderSummaryAddProperty() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/summary">Portfolio</a> / Add property</div>
        <h1 class="page-title">Add property</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(portfolio.name)}</strong> · ${portfolio.properties.length} propert${portfolio.properties.length === 1 ? 'y' : 'ies'}</p>

        <div class="card">
          <div class="btn-group" style="margin-top: 0; margin-bottom: 20px;">
            <button type="button" class="btn btn-secondary" id="demo-fill-btn">Fill with demo data</button>
          </div>

          <form id="property-form">
            ${renderPropertyFields({}, true)}
            <div class="btn-group">
              <button type="submit" class="btn btn-primary">Add to portfolio</button>
              <a class="btn btn-tertiary" href="#/portfolio/summary">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindCommonActions();
  document.getElementById('demo-fill-btn').addEventListener('click', () => fillDemoData(true));
  document.getElementById('property-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const property = collectPropertyFromForm(form, true);
    portfolio.properties.push(enrichPropertyWithAvm(property));
    saveState(state);
    navigate('/portfolio/summary');
  });
}

function renderFieldInput(field, values, optional = false) {
  const suffix = optional ? ' <span class="label-optional">(optional)</span>' : '';
  const label = `${FIELD_LABELS[field]}${suffix}`;

  if (field === 'tenancyStatus') {
    const options = ['', 'Let', 'Vacant', 'Under offer', 'Notice served'];
    return `
      <div class="form-group">
        <label for="${field}">${label}</label>
        <select id="${field}" name="${field}">
          ${options.map((opt) => `<option value="${opt}" ${values[field] === opt ? 'selected' : ''}>${opt || 'Select…'}</option>`).join('')}
        </select>
      </div>
    `;
  }

  if (field === 'paymentType') {
    const options = ['', 'Repayment', 'Interest only'];
    return `
      <div class="form-group">
        <label for="${field}">${label}</label>
        <select id="${field}" name="${field}">
          ${options.map((opt) => `<option value="${opt}" ${values[field] === opt ? 'selected' : ''}>${opt || 'Select…'}</option>`).join('')}
        </select>
      </div>
    `;
  }

  const type = field.includes('Date')
    ? 'date'
    : field.includes('Rent') || field.includes('Balance') || field.includes('Payments')
      ? 'number'
      : 'text';

  return `
    <div class="form-group">
      <label for="${field}">${label}</label>
      <input id="${field}" name="${field}" type="${type}" ${optional ? '' : 'required'} value="${escapeHtml(values[field] || '')}" ${type === 'number' ? 'min="0" step="1"' : ''}>
    </div>
  `;
}

function renderPropertyFields(values = {}, includeOptional = false) {
  const optionalSection = includeOptional ? `
    <fieldset class="fieldset-optional">
      <legend>Additional details (optional)</legend>
      ${OPTIONAL_FIELDS.map((field) => renderFieldInput(field, values, true)).join('')}
    </fieldset>
  ` : '';

  return `
    <div class="form-row">
      ${renderFieldInput('titleRef', values)}
      ${renderFieldInput('postcode', values)}
    </div>
    <div class="form-row">
      ${renderFieldInput('propertyNumber', values)}
      ${renderFieldInput('street', values)}
    </div>
    ${renderFieldInput('city', values)}
    ${optionalSection}
  `;
}

function renderPropertyList(properties) {
  return `
    <div class="card">
      <h2 class="section-title">Properties added</h2>
      <ul class="property-list">
        ${properties.map((p) => `
          <li class="property-item">
            <div>
              <div class="property-item__ref">${escapeHtml(p.titleRef)}</div>
              <div class="property-item__address">${escapeHtml(formatAddress(p))}</div>
            </div>
            ${p.tenancyStatus ? `<span class="badge badge-green">${escapeHtml(p.tenancyStatus)}</span>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function fillDemoData(includeOptional = false) {
  const demo = includeOptional ? DEMO_PROPERTY : DEMO_MANUAL_PERFECT;
  const fields = includeOptional ? [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] : REQUIRED_FIELDS;
  fields.forEach((field) => {
    const el = document.getElementById(field);
    if (el) el.value = demo[field] || '';
  });
}

function collectPropertyFromForm(form, includeOptional = false) {
  const property = {};
  const fields = includeOptional ? [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] : REQUIRED_FIELDS;
  fields.forEach((field) => {
    property[field] = form.elements[field]?.value?.trim() || '';
  });
  return property;
}

function finishPortfolio() {
  state.portfolio = {
    name: draftPortfolio.name,
    properties: enrichProperties(draftPortfolio.properties),
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  navigate('/portfolio/summary');
}

function processCsvText(text) {
  applyBulkImportResult(parseCsvDetailed(text));
}

function setupCsvUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('csv-input');

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  input.addEventListener('change', () => handleFile(input.files[0]));
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
  });
}

async function loadSampleCsv(type = 'perfect') {
  const file = type === 'errors' ? 'portfolio-sample-errors.csv' : 'portfolio-sample-perfect.csv';
  const response = await fetch(`assets/${file}`);
  const text = await response.text();
  processCsvText(text);
}

function bindCommonActions() {
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    state = {
      accessGranted: state.accessGranted,
      loggedIn: false,
      portfolio: state.portfolio,
      draftPortfolio: null,
    };
    saveState(state);
    navigate('/login');
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  if (!state.accessGranted) {
    renderAccessGate();
    return;
  }

  document.title = PAGE_TITLES.app;

  const route = getRoute();
  if (!requireAuth(route)) return;

  const parsed = parseRoute(route);
  if (parsed.type === 'property') {
    renderPropertyDetail(parsed.index, parsed.tab);
    return;
  }
  if (parsed.type === 'marketplace-quote') {
    renderMortgageQuote(parsed.listingId);
    return;
  }
  if (parsed.type === 'refinance-quote') {
    renderPropertyRefinanceQuote(parsed.index);
    return;
  }
  if (parsed.type === 'rent-review') {
    renderPropertyRentReview(parsed.index);
    return;
  }
  if (parsed.type === 'epc-improvement') {
    renderPropertyEpcImprovement(parsed.index);
    return;
  }

  switch (route) {
    case '/login':
      renderLogin();
      break;
    case '/dashboard':
      renderDashboard();
      break;
    case '/portfolio/create':
      renderCreatePortfolio();
      break;
    case '/portfolio/add':
      if (!draftPortfolio.name) {
        navigate('/portfolio/create');
        return;
      }
      renderAddProperty();
      break;
    case '/portfolio/upload':
      if (!draftPortfolio.name) {
        navigate('/portfolio/create');
        return;
      }
      renderUploadCsv();
      break;
    case '/portfolio/summary':
      renderSummary();
      break;
    case '/portfolio/marketplace':
      renderMarketplace();
      break;
    case '/portfolio/summary/add':
      renderSummaryAddProperty();
      break;
    default:
      navigate(state.loggedIn ? '/dashboard' : '/login');
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);
