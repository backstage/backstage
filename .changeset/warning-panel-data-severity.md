---
'@backstage/core-components': patch
---

`WarningPanel` now renders a `data-severity` attribute on its root element, set to `warning`, `error`, or `info`. Themes can use this to give each severity its own styling from a single `BackstageWarningPanel` override, which was previously not possible because the severity was not visible to static style overrides. The default appearance is unchanged.
