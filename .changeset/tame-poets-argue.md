---
'@backstage/backend-defaults': patch
---

Fixed a bug where creating a metric with the same name from multiple plugins could cause the Prometheus exporter to emit duplicate `HELP`/`TYPE` lines for that metric, which some Prometheus scrapers reject as invalid. Instruments are now reused by name, so a metric name always maps to a single underlying instrument regardless of which plugin creates it first.
