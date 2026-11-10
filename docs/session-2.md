# Session 02: First k6 test

Written afterwards on 2026-11-10. Predictions were not written in advance.

## Question
Can I check status and response shape automatically, so that a wrong response makes the test fail?

## What I did
- Continued from session 1.
- Created `test/smoke.js`: 1 user, 5 requests, `http_req_failed` threshold, and checks for status 200, a list in the response, and the type of every field of every item.
- Looked into k6 syntax and general ways of structuring a test.
- Made the target URL a setting (`TARGET_URL`) with validation, so it is not hard-coded.
- Rewrote the script with named helper functions to make it more readable.

## Numbers
Final smoke run against `http://localhost:4567/simpleapi/items`:
35 of 35 checks passed, 5 requests, p(95) 2.39 ms, 0% failed.

## What surprised me
- Errors on the way: missing `http://` in the URL, a crash when reading JSON from a failed response, looking for `items` when the endpoint returned `entities`, a label that said the wrong type.
- I first tested against `/sim/entities`, which returns hard-coded data.
- [YOU: which of these would a pipeline have caught, and which only a human?]

## Limit
- Five requests on localhost is a functional check, not a performance result.
- [YOU: one more limit]

## Open
- An earlier run showed 15 requests and 134 ms average, and I never found out which URL it used.
