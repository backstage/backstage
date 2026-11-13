---
'@techdocs/cli': minor
---

Add Zensical support to `serve`, `serve:raw` and `generate` via `--engine zensical` (or the `backstage.io/techdocs-engine` annotation in `catalog-info.yaml`), including live reload in the preview app. The default `--docker-image` is now chosen per engine instead of always being `spotify/techdocs`, and matches the image the TechDocs backend uses for that engine, so MkDocs previews now use `spotify/techdocs:v1.2.8` instead of `latest`. Passing `--docker-image` explicitly behaves as before.

The `serve` flags `--mkdocs-port`, `--mkdocs-config-file-name` and `--mkdocs-parameter-*` are deprecated in favor of `--engine-port`, `--config-file-name` and `--parameter-*`. If both the old and new flag are given, the new one wins and the warning says the old one is ignored.
