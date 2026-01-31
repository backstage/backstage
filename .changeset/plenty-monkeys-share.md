---
'@backstage/ui': patch
---

Added new `Alert` component with support for status variants (info, success, warning, danger), icons, loading states, and custom actions.

Updated status color tokens for improved contrast and consistency across light and dark themes:

- Added new `--bui-bg-info` and `--bui-fg-info` tokens for info status
- Updated `--bui-bg-danger`, `--bui-fg-danger` tokens
- Updated `--bui-bg-warning`, `--bui-fg-warning` tokens
- Updated `--bui-bg-success`, `--bui-fg-success` tokens

**Affected components**: Alert
