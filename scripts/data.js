export const DEMO_PROPERTY = {
  titleRef: 'PROP-DEMO-001',
  postcode: 'EC2V 7HN',
  propertyNumber: '25',
  street: 'Moorgate',
  city: 'London',
  tenancyStatus: 'Let',
  startDate: '2024-04-01',
  monthlyRent: '1850',
  mortgageProvider: 'Lloyds Bank',
  productType: 'Buy-to-Let Fixed',
  mortgageEndDate: '2029-04-01',
  mortgageBalance: '312500',
  paymentType: 'Repayment',
  monthlyPayments: '1045',
};

export const DEMO_PROPERTIES = [
  {
    titleRef: 'PROP-DEMO-001',
    postcode: 'EC2V 7HN',
    propertyNumber: '25',
    street: 'Moorgate',
    city: 'London',
    tenancyStatus: 'Let',
    startDate: '2024-04-01',
    monthlyRent: '1850',
    mortgageProvider: 'Lloyds Bank',
    productType: 'Buy-to-Let Fixed',
    mortgageEndDate: '2029-04-01',
    mortgageBalance: '312500',
    paymentType: 'Repayment',
    monthlyPayments: '1045',
  },
  {
    titleRef: 'PROP-DEMO-002',
    postcode: 'M1 4BT',
    propertyNumber: '12',
    street: 'Deansgate',
    city: 'Manchester',
    tenancyStatus: 'Vacant',
    startDate: '',
    monthlyRent: '',
    mortgageProvider: 'Halifax',
    productType: 'Tracker',
    mortgageEndDate: '2027-11-15',
    mortgageBalance: '228000',
    paymentType: 'Interest only',
    monthlyPayments: '580',
  },
];

export const FIELD_LABELS = {
  titleRef: 'Title / Ref',
  postcode: 'Postcode',
  propertyNumber: 'Property number',
  street: 'Street',
  city: 'City',
  tenancyStatus: 'Tenancy status',
  startDate: 'Start date',
  monthlyRent: 'Monthly rent (£)',
  mortgageProvider: 'Mortgage provider',
  productType: 'Product type',
  mortgageEndDate: 'Mortgage end date',
  mortgageBalance: 'Mortgage balance (£)',
  paymentType: 'Payment type',
  monthlyPayments: 'Monthly payments (£)',
};

export const REQUIRED_FIELDS = [
  'titleRef',
  'postcode',
  'propertyNumber',
  'street',
  'city',
];

export const OPTIONAL_FIELDS = [
  'tenancyStatus',
  'startDate',
  'monthlyRent',
  'mortgageProvider',
  'productType',
  'mortgageEndDate',
  'mortgageBalance',
  'paymentType',
  'monthlyPayments',
];

export const CSV_HEADERS = [
  'Title/Ref',
  'Postcode',
  'Property number',
  'Street',
  'City',
  'Tenancy status',
  'Start date',
  'Monthly rent',
  'Mortgage provider',
  'Product type',
  'Mortgage end date',
  'Mortgage balance',
  'Payment type',
  'Monthly payments',
];

const CSV_TO_KEY = {
  'Title/Ref': 'titleRef',
  Postcode: 'postcode',
  'Property number': 'propertyNumber',
  Street: 'street',
  City: 'city',
  'Tenancy status': 'tenancyStatus',
  'Start date': 'startDate',
  'Monthly rent': 'monthlyRent',
  'Mortgage provider': 'mortgageProvider',
  'Product type': 'productType',
  'Mortgage end date': 'mortgageEndDate',
  'Mortgage balance': 'mortgageBalance',
  'Payment type': 'paymentType',
  'Monthly payments': 'monthlyPayments',
};

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const properties = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      const key = CSV_TO_KEY[header];
      if (key) row[key] = values[index] || '';
    });

    if (REQUIRED_FIELDS.every((field) => row[field])) {
      properties.push(row);
    }
  }

  return properties;
}

export function formatAddress(property) {
  return `${property.propertyNumber} ${property.street}, ${property.city}, ${property.postcode}`;
}

export function formatCurrency(value) {
  const num = Number(String(value).replace(/[^0-9.]/g, ''));
  if (!num) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(num);
}

export function loadState() {
  try {
    const raw = sessionStorage.getItem('lrfp-state');
    return raw ? JSON.parse(raw) : { loggedIn: false, portfolio: null };
  } catch {
    return { loggedIn: false, portfolio: null };
  }
}

export function saveState(state) {
  sessionStorage.setItem('lrfp-state', JSON.stringify(state));
}
