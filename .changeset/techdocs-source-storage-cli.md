---
'@techdocs/cli': minor
---

Added `--include-sources`, `--source-excludes`, and `--source-additional-files` flags to `techdocs-cli generate`. When `--include-sources` is set, the original Markdown source files are preserved in a `_sources/` directory alongside the generated HTML output. Use `--source-excludes` to filter out files by name or extension pattern, and `--source-additional-files` to include extra root files beyond the default `README.md`.
