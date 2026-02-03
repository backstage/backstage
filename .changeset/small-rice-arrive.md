---
'@backstage/plugin-mui-to-bui': patch
---

Updated MUI to BUI theme converter to align with latest token changes

**Changes:**

- Removed generation of deprecated tokens: `--bui-fg-link`, `--bui-fg-link-hover`, `--bui-fg-tint`, `--bui-fg-tint-disabled`, `--bui-bg-tint` and all its variants
- Added generation of new `info` status tokens: `--bui-fg-info`, `--bui-fg-info-on-bg`, `--bui-bg-info`, `--bui-border-info`
- Updated status color mapping to generate both standalone and `-on-bg` variants for danger, warning, success, and info
- Status colors now use `.main` for standalone variants and `.dark` for `-on-bg` variants, providing better visual hierarchy

The converter now generates tokens that match the updated BUI design system structure, with clear distinction between status colors for standalone use vs. use on colored backgrounds.
