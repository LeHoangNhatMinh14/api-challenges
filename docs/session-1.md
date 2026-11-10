# Session 01: Environment

Written afterwards on 2026-11-10. Predictions were not written in advance.

## Question
Can I start the API under test from one command, the same way on every machine?

## What I did
- Set up the project from Docker to the repository.
- Dockerfile (Java 17 image, copies the jar, exposes port 4567) and `compose.yaml` (one service, `api`, port 4567).
- Put `sut/*.jar` and `results/` in `.gitignore`: the jar is a third-party binary with no known licence for redistribution, so it stays out of the repository.
- Looked into EvilTester's API Challenges and ran it in the Docker environment.
- Started messing around with the API using `curl.exe`.

## Numbers
Five `curl` timings against the running container (seconds):
0.0898, 0.0090, 0.0078, 0.0082, 0.0077

## What surprised me
- Found out the hard way that a jar does not belong in the repository: after pushing and pulling on my second PC, the jar was gone and I had to download it again.
- The first request was about 10x slower than the other four.
- [YOU: why do you think the first request was slow? One sentence, your own words.]