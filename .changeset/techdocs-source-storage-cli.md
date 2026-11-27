---
'@techdocs/cli': minor
---

Added `--include-sources`, `--source-excludes`, and `--source-additional-files` flags to `techdocs-cli generate`. When `--include-sources` is set, the original Markdown source files are preserved in a `_sources/` directory alongside the generated HTML output. Use `--source-excludes` to leave out files with glob patterns, and `--source-additional-files` to include other files instead of the default `README.md`.
