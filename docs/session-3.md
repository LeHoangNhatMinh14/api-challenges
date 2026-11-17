# Session 03: Running the baseline tests

## Written BEFORE run 1 (17/11/2026, time: 17:19)
- Warm-up: one throwaway run first, then 5 counted runs. Reason: the server is slow right after it has been idle.
- Limit rule: the largest of the 5 p(95) values.
- Weird result: a run is weird if its p(95) is more than 3x the middle value of the other four. It stays in the table, marked, and I do an extra run so I still have 5.
- Prediction: all five p(95) between 2.1 and 3.5 ms. Reason: From the smoke tests it has been seen that these were the lowest and highest record times in the performance of the calls
														
Limit (largest p(95)): 8.26 ms. Average: 6.33 ms. Largest + 20%: 9.91 ms.

| Run | p(95) (ms) | Median (ms) | Max (ms) | Requests | Counted | Failed | Middle p(95) of other four (ms) | Weird? (over 3x) |
|---|---|---|---|---|---|---|---|---|
| Warm-up | 8.28 | 2.63 | 14.46 | 380 | no | 0 | | |
| Run 1 | 3.54 | 1.80 | 6.77 | 380 | yes | 0 | 7.13 | ok |
| Run 2 | 8.26 | 1.96 | 12.13 | 380 | yes | 0 | 5.92 | ok |
| Run 3 | 8.03 | 1.86 | 10.45 | 380 | yes | 0 | 5.92 | ok |
| Run 4 | 6.24 | 1.76 | 9.42 | 380 | yes | 0 | 6.82 | ok |
| Run 5 | 5.61 | 2.11 | 7.50 | 380 | yes | 0 | 7.13 | ok |


## Observation from from the runs

The median stayed between 1.7 and 2.1 in all five runs but p(95) ranged from 3.5 to 8.2. p(95) is decided by only the slowest 19 of the 380 requests, so a few slow requests can move it a lot, while the median barely changes.

The load was the same in every run, so the difference must come from my PC or the api (suspects: firefox browser or discord running or steam as well).
I could not tell the cause from five runs . To find out I would need to extend the run times of the tests and have a steadier ramp up.

## Decision
Limit = 8.26 ms p(95), the largest of the five runs. Reason: I chose the rule before the runs, and with the noise I measured (3.5 to 8.3 ms) the average (6.33 ms) would fail about half of normal runs, while the largest passes all five..
What this lets through: a real slowdown from about 3.5 ms to just under 8.26 ms would not be caught.

## Prediction check
I predicted 2.1 to 3.5 ms. The five runs gave 3.54 to 8.26 ms. 1 of five were inside my range.
Why I missed: The runs ran a lot of requests and was a bit more load on the server, so I would say that's why it affected the server abit

## Setup
Machine: Intel i5 13th gen, 32GB or DDR4 ram (CPU, RAM). k6 v2.3.0. URL http://localhost:4567/simpleapi/items. Script test/baseline.js.
Programs open during the runs: Firefox, Discord, Docker.

## Limits
- 380 requests per run, so p(95) rests on 19 requests.
- k6, the API and my other programs share one PC, on localhost.
- Run 1 was the fastest and the others slower. I don't know why.

## Next questions
1. Close Discord, Steam and Firefox, run the five again: does the spread shrink?
2. Make the steady phase 4x longer: does the spread shrink?