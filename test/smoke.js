import http from 'k6/http';
import { check } from 'k6';

// The address is passed in from outside, so it is not written into the script.
const TARGET_URL = __ENV.TARGET_URL;
if (!TARGET_URL) {
  throw new Error('Set TARGET_URL, e.g. k6 run -e "TARGET_URL=http://localhost:4567/..." tests/smoke.js');
}

if (!/^https?:\/\//.test(TARGET_URL)) {
  throw new Error('TARGET_URL must start with http:// or https://');
}

export const options = {
  vus: 1,         // 1 virtual user
  iterations: 5,  // the function below runs 5 times in total
  thresholds: {
    http_req_failed: ['rate==0'], // no request may fail
    // http_req_duration: ['p(95)<...']
    // ^ session 3: choose this number from measured baseline runs. Do not guess it.
  },
};

export default function () {
  const res = http.get(TARGET_URL);

  check(res, {
    'status is 200': (r) => r.status === 200,
    // Change 'entities' to the key you see in the real response. && stops the JSON read if the status is not 200.
    'entities is a list': (r) => r.status === 200 && Array.isArray(r.json('items')),
    // TODO 1 (you): every item in the list has id (number), name (string), description (string)
  });
}