import http from 'k6/http';
import { check } from 'k6';

// ---------- 1. SETTINGS ----------

// The address comes from outside, so it is not written into the script.
const TARGET_URL = __ENV.TARGET_URL;
const LIST_KEY = 'items';

if (!TARGET_URL) {
  throw new Error('Set TARGET_URL, e.g. k6 run -e "TARGET_URL=http://localhost:4567/..." test/smoke.js');
}

if (!/^https?:\/\//.test(TARGET_URL)) {
  throw new Error('TARGET_URL must start with http:// or https://');
}

export const options = {
  vus: 1,         // 1 virtual user
  iterations: 5,  // the test function runs 5 times in total
  thresholds: {
    http_req_failed: ['rate==0'], // no request may fail
    // http_req_duration: ['p(95)<...']
    // ^ session 3: choose this number from the baseline runs. Do not guess it.
  },
};

// ---------- 2. HELPER FUNCTIONS ----------
// Each one takes the response and answers true (pass) or false (fail).

function statusIs200(response) {
  return response.status === 200;
}

function itemsIsAList(response) {
  // Check the status first. If the request failed there may be no JSON to read.
  if (response.status !== 200) {
    return false;
  }
  const body = response.json();
  return Array.isArray(body[LIST_KEY]);
}

// Checks one field on EVERY item in the list.
// fieldName = for example 'id'. expectedType = 'number' or 'string'.
function everyItemHasField(response, fieldName, expectedType) {
  if (response.status !== 200) {
    return false;
  }
  const items = response.json()[LIST_KEY];
  if (!Array.isArray(items)) {
    return false;
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (typeof item[fieldName] !== expectedType) {
      return false; // one bad item is enough to fail the check
    }
  }
  return true;
}

function idIsNumber(response) {
  return everyItemHasField(response, 'id', 'number');
}

function nameIsString(response) {
  return everyItemHasField(response, 'name', 'string');
}

function typeIsString(response) {
  return everyItemHasField(response, 'type', 'string');
}

function descriptionIsString(response) {
  return everyItemHasField(response, 'description', 'string');
}

function isbn13IsNumber(response) {
  return everyItemHasField(response, 'isbn13', 'string');
}

function priceIsNumber(response) {
  return everyItemHasField(response, 'price', 'number');
}

function numberinstockIsNumber(response) {
  return everyItemHasField(response, 'numberinstock', 'number');
}

// ---------- 3. THE TEST ----------

export default function () {
  const response = http.get(TARGET_URL);

  check(response, {
    'status is 200': statusIs200,
    'items is a list': itemsIsAList,
        'every item has id (number)': idIsNumber,
    'every item has type (string)': typeIsString,
    'every item has isbn13 (number)': isbn13IsNumber,
    'every item has price (number)': priceIsNumber,
    'every item has a number in stock (number)': numberinstockIsNumber,
  });
}