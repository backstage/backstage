---
'@techdocs/cli': minor
---

Add Zensical support to `serve`, `serve:raw` and `generate` via `--engine zensical` (or the `backstage.io/techdocs-engine` annotation in `catalog-info.yaml`), including live reload in the preview app. The default `--docker-image` is now chosen per engine instead of always being `spotify/techdocs`; passing `--docker-image` explicitly behaves as before.
