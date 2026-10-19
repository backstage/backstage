---
'@backstage/config-loader': patch
---

Config schemas now compile in roughly half the time, by skipping Ajv's code optimizer. The compiled validators only run a few times per process, so the optimized code never paid for itself. This speeds up backend startup, which compiles the full config schema, for example to find the secret config values to redact from logs.
