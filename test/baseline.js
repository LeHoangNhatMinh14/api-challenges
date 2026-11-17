import http from 'k6/http';
import { check, sleep } from 'k6';

// ---------- 1. SETTINGS ----------

// The address comes from outside, so it is not written into the script.
const TARGET_URL = __ENV.TARGET_URL;

if (!TARGET_URL) {
  throw new Error('Set TARGET_URL, e.g. k6 run -e "TARGET_URL=http://localhost:4567/..." test/baseline.js');
}

if (!/^https?:\/\//.test(TARGET_URL)) {
  throw new Error('TARGET_URL must start with http:// or https://');
}

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // ramp-up: users are added slowly, up to 5
    { duration: '30s', target: 5 }, // steady: 5 users at the same time
    { duration: '5s', target: 0 },  // ramp-down: users leave
  ],
  thresholds: {
    http_req_failed: ['rate==0'], // no request may fail
    // No limit on response time yet. Session 3 exists to find out which number is justified.
  },
};

// ---------- 2. HELPER FUNCTION ----------

function statusIs200(response) {
  return response.status === 200;
}

// ---------- 3. THE TEST ----------

export default function () {
  const response = http.get(TARGET_URL);

  check(response, {
    'status is 200': statusIs200,
  });

  sleep(0.5); // think time: a pause of half a second before the next request
}