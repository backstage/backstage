---
'@techdocs/cli': minor
---

Added `--include-sources` and `--source-excludes` flags to `techdocs-cli generate`. When `--include-sources` is set, the original Markdown source files are preserved in a `_sources/` directory alongside the generated HTML output. Use `--source-excludes` to filter out files by name or extension pattern, for example `--source-excludes "*.png" "*.jpg"`.
