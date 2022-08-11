---
'techdocs-cli-embedded-app': patch
---

Theme selector in `npx @techdocs/cli serve` would break if localstorage had a non-light-or-dark value for theme.
