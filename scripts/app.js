import {
  DEMO_PROPERTY,
  FIELD_LABELS,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
  parseCsv,
  formatAddress,
  formatCurrency,
  loadState,
  saveState,
} from './data.js';

const app = document.getElementById('app');

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

let state = loadState();
let draftPortfolio = state.draftPortfolio || { name: '', properties: [] };

function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  const hash = window.location.hash.slice(1) || '/login';
  return hash.startsWith('/') ? hash : `/${hash}`;
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

function renderFooter() {
  return `
    <footer class="site-footer">
      © Lloyds Banking Group plc ${new Date().getFullYear()}. Demonstration prototype only.
    </footer>
  `;
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-page">
      <div class="login-hero">
        ${LBG_LOGO.replace('fill="black"', 'fill="white"').replace('fill="#006A4A"', 'fill="#9fd4b8"')}
        <h1>Investor Landlord Portal</h1>
        <p>Manage your buy-to-let portfolio, track tenancies and mortgage details in one secure place.</p>
      </div>
      <div class="login-panel">
        <div class="login-card">
          <h2>Sign in</h2>
          <p class="hint">Enter your credentials to access your portfolio dashboard.</p>
          <form id="login-form">
            <div class="form-group">
              <label for="username">User ID or email</label>
              <input id="username" name="username" type="text" value="demo.landlord@email.com" autocomplete="username">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" value="••••••••" autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary">Log in</button>
          </form>
          <div class="login-demo-note">
            <strong>Demo mode:</strong> Click <em>Log in</em> to continue — no real authentication is required.
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

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <h1 class="page-title">Welcome back</h1>
        <p class="page-subtitle">Manage your buy-to-let property portfolio.</p>

        ${hasPortfolio ? `
          <div class="alert alert-success">
            Portfolio <strong>${escapeHtml(state.portfolio.name)}</strong> created with ${state.portfolio.properties.length} propert${state.portfolio.properties.length === 1 ? 'y' : 'ies'}.
          </div>
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-card__value">${state.portfolio.properties.length}</div>
              <div class="stat-card__label">Properties</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${state.portfolio.properties.filter((p) => p.tenancyStatus === 'Let').length}</div>
              <div class="stat-card__label">Currently let</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${formatCurrency(totalRent(state.portfolio.properties))}</div>
              <div class="stat-card__label">Monthly rent</div>
            </div>
          </div>
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
            <div class="choice-card__icon">+</div>
            <h3 class="choice-card__title">Add one at a time</h3>
            <p class="choice-card__desc">Enter property details manually. Use demo fill to autocomplete fields instantly.</p>
          </button>
          <button class="choice-card" data-method="csv">
            <div class="choice-card__icon">↑</div>
            <h3 class="choice-card__title">Bulk CSV upload</h3>
            <p class="choice-card__desc">Upload a spreadsheet with multiple properties. Download our template to get started.</p>
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
      saveState(state);
      navigate(btn.dataset.method === 'manual' ? '/portfolio/add' : '/portfolio/upload');
    });
  });
}

function renderAddProperty() {
  const propertyCount = draftPortfolio.properties.length;

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Add property</div>
        <h1 class="page-title">Add property</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong> · ${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} added</p>

        ${propertyCount > 0 ? `
          <div class="alert alert-info">${propertyCount} propert${propertyCount === 1 ? 'y' : 'ies'} in this portfolio so far. Add more below or finish when ready.</div>
        ` : ''}

        <div class="card">
          <div class="btn-group" style="margin-top: 0; margin-bottom: 20px;">
            <button type="button" class="btn btn-secondary" id="demo-fill-btn">Fill with demo data</button>
          </div>

          <form id="property-form">
            ${renderPropertyFields()}
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
  document.getElementById('demo-fill-btn').addEventListener('click', fillDemoData);
  document.getElementById('property-form').addEventListener('submit', handleAddProperty);
  document.getElementById('finish-btn')?.addEventListener('click', finishPortfolio);
}

function renderUploadCsv() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content page-content--medium">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / <a href="#/portfolio/create">Create portfolio</a> / Upload CSV</div>
        <h1 class="page-title">Bulk upload properties</h1>
        <p class="page-subtitle">Portfolio: <strong>${escapeHtml(draftPortfolio.name)}</strong></p>

        <div class="card">
          <p style="margin-top: 0;">Download the CSV template, fill in your property details, then upload the file. Required columns: Title/Ref, Postcode, Property number, Street, City.</p>
          <div class="btn-group" style="margin-top: 0;">
            <a class="btn btn-secondary" href="assets/portfolio-template.csv" download="portfolio-template.csv">Download template</a>
            <button type="button" class="btn btn-tertiary" id="load-sample-btn">Load sample CSV</button>
          </div>
        </div>

        <div class="card">
          <div class="upload-zone" id="upload-zone">
            <div class="upload-zone__icon">📄</div>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <label class="btn btn-primary" for="csv-input">Choose file</label>
            <input type="file" id="csv-input" accept=".csv,text/csv">
          </div>
          <div id="upload-result"></div>
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
  document.getElementById('load-sample-btn').addEventListener('click', loadSampleCsv);
}

function renderSummary() {
  const portfolio = state.portfolio;
  if (!portfolio) {
    navigate('/dashboard');
    return;
  }

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="page-content">
        <div class="breadcrumb"><a href="#/dashboard">Dashboard</a> / Portfolio summary</div>
        <h1 class="page-title">${escapeHtml(portfolio.name)}</h1>
        <p class="page-subtitle">Your portfolio has been created successfully.</p>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__value">${portfolio.properties.length}</div>
            <div class="stat-card__label">Total properties</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${portfolio.properties.filter((p) => p.tenancyStatus === 'Let').length}</div>
            <div class="stat-card__label">Let</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${formatCurrency(totalRent(portfolio.properties))}</div>
            <div class="stat-card__label">Monthly rent</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${formatCurrency(totalMortgagePayments(portfolio.properties))}</div>
            <div class="stat-card__label">Monthly mortgage</div>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title">Properties</h2>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Rent</th>
                  <th>Mortgage</th>
                </tr>
              </thead>
              <tbody>
                ${portfolio.properties.map((p) => `
                  <tr>
                    <td><strong>${escapeHtml(p.titleRef)}</strong></td>
                    <td>${escapeHtml(formatAddress(p))}</td>
                    <td>${p.tenancyStatus ? `<span class="badge ${p.tenancyStatus === 'Let' ? 'badge-green' : 'badge-amber'}">${escapeHtml(p.tenancyStatus)}</span>` : '—'}</td>
                    <td>${formatCurrency(p.monthlyRent)}</td>
                    <td>${p.mortgageProvider ? escapeHtml(p.mortgageProvider) : '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
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

function renderPropertyFields(values = {}) {
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
    <fieldset class="fieldset-optional">
      <legend>Additional details (optional)</legend>
      ${OPTIONAL_FIELDS.map((field) => renderFieldInput(field, values, true)).join('')}
    </fieldset>
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

function fillDemoData() {
  [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach((field) => {
    const el = document.getElementById(field);
    if (el) el.value = DEMO_PROPERTY[field] || '';
  });
}

function handleAddProperty(e) {
  e.preventDefault();
  const form = e.target;
  const property = {};
  [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach((field) => {
    property[field] = form.elements[field]?.value?.trim() || '';
  });

  draftPortfolio.properties.push(property);
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  renderAddProperty();
}

function finishPortfolio() {
  state.portfolio = {
    name: draftPortfolio.name,
    properties: [...draftPortfolio.properties],
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  navigate('/portfolio/summary');
}

function setupCsvUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('csv-input');
  const result = document.getElementById('upload-result');

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const properties = parseCsv(event.target.result);
      if (!properties.length) {
        result.innerHTML = '<div class="alert" style="margin-top:16px;background:#fde8ec;color:#8a1530;border:1px solid #f5c2cb;">No valid properties found. Check your CSV has the required columns and at least one data row.</div>';
        return;
      }
      draftPortfolio.properties = properties;
      state.draftPortfolio = draftPortfolio;
      state.portfolio = {
        name: draftPortfolio.name,
        properties: [...properties],
        createdAt: new Date().toISOString(),
      };
      draftPortfolio = { name: '', properties: [] };
      state.draftPortfolio = draftPortfolio;
      saveState(state);
      result.innerHTML = `<div class="alert alert-success" style="margin-top:16px;">Successfully imported <strong>${properties.length}</strong> properties.</div>`;
      setTimeout(() => navigate('/portfolio/summary'), 800);
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

async function loadSampleCsv() {
  const response = await fetch('assets/portfolio-sample.csv');
  const text = await response.text();
  const properties = parseCsv(text);
  draftPortfolio.properties = properties;
  state.draftPortfolio = draftPortfolio;
  state.portfolio = {
    name: draftPortfolio.name,
    properties: [...properties],
    createdAt: new Date().toISOString(),
  };
  draftPortfolio = { name: '', properties: [] };
  state.draftPortfolio = draftPortfolio;
  saveState(state);
  navigate('/portfolio/summary');
}

function bindCommonActions() {
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    state = { loggedIn: false, portfolio: state.portfolio, draftPortfolio: null };
    saveState(state);
    navigate('/login');
  });
}

function totalRent(properties) {
  return properties.reduce((sum, p) => sum + (Number(p.monthlyRent) || 0), 0);
}

function totalMortgagePayments(properties) {
  return properties.reduce((sum, p) => sum + (Number(p.monthlyPayments) || 0), 0);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const route = getRoute();
  if (!requireAuth(route)) return;

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
    default:
      navigate(state.loggedIn ? '/dashboard' : '/login');
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);
