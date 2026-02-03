# @backstage/plugin-mui-to-bui

## 0.2.4-next.1

### Patch Changes

- a88c437: Updated MUI to BUI theme converter to align with latest token changes

  **Changes:**

  - Removed generation of deprecated tokens: `--bui-fg-link`, `--bui-fg-link-hover`, `--bui-fg-tint`, `--bui-fg-tint-disabled`, `--bui-bg-tint` and all its variants
  - Added generation of new `info` status tokens: `--bui-fg-info`, `--bui-fg-info-on-bg`, `--bui-bg-info`, `--bui-border-info`
  - Updated status color mapping to generate both standalone and `-on-bg` variants for danger, warning, success, and info
  - Status colors now use `.main` for standalone variants and `.dark` for `-on-bg` variants, providing better visual hierarchy

  The converter now generates tokens that match the updated BUI design system structure, with clear distinction between status colors for standalone use vs. use on colored backgrounds.

- Updated dependencies
  - @backstage/ui@0.12.0-next.1
  - @backstage/theme@0.7.2-next.0
  - @backstage/frontend-plugin-api@0.14.0-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.12.0-next.0
  - @backstage/frontend-plugin-api@0.14.0-next.0
  - @backstage/core-plugin-api@1.12.2-next.0
  - @backstage/theme@0.7.1

## 0.2.3

### Patch Changes

- f157f43: Fix installation command
- e4a1180: Updated tokens from `--bui-bg` to `--bui-bg-surface-0`
- Updated dependencies
  - @backstage/ui@0.11.0
  - @backstage/frontend-plugin-api@0.13.3

## 0.2.3-next.0

### Patch Changes

- e4a1180: Updated tokens from `--bui-bg` to `--bui-bg-surface-0`
- Updated dependencies
  - @backstage/ui@0.11.0-next.0
  - @backstage/core-plugin-api@1.12.1
  - @backstage/frontend-plugin-api@0.13.2
  - @backstage/theme@0.7.1

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.10.0
  - @backstage/frontend-plugin-api@0.13.2
  - @backstage/core-plugin-api@1.12.1
  - @backstage/theme@0.7.1

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.10.0-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.9.1-next.0
  - @backstage/frontend-plugin-api@0.13.2-next.0
  - @backstage/core-plugin-api@1.12.1-next.0
  - @backstage/theme@0.7.1-next.0

## 0.2.1

### Patch Changes

- 5c614ff: Updated BUI checkbox preview example to align with new component API.
- Updated dependencies
  - @backstage/ui@0.9.0
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-plugin-api@1.12.0

## 0.2.1-next.1

### Patch Changes

- 5c614ff: Updated BUI checkbox preview example to align with new component API.
- Updated dependencies
  - @backstage/ui@0.9.0-next.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.8.2-next.0
  - @backstage/core-plugin-api@1.11.2-next.0
  - @backstage/frontend-plugin-api@0.12.2-next.0
  - @backstage/core-compat-api@0.5.4-next.0
  - @backstage/theme@0.7.0

## 0.2.0

### Minor Changes

- d5cbdba: This is the first release of the Material UI to Backstage UI migration helper plugin. It adds a new page at `/mui-to-bui` that converts an existing MUI v5 theme into Backstage UI (BUI) CSS variables, with live preview and copy/download.

### Patch Changes

- 28ee81c: Fix invalid conversion for `--bui-bg` variable
- Updated dependencies
  - @backstage/ui@0.8.0
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/theme@0.7.0
  - @backstage/core-compat-api@0.5.3
  - @backstage/core-plugin-api@1.11.1

## 0.2.0-next.0

### Minor Changes

- d5cbdba: This is the first release of the Material UI to Backstage UI migration helper plugin. It adds a new page at `/mui-to-bui` that converts an existing MUI v5 theme into Backstage UI (BUI) CSS variables, with live preview and copy/download.

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.7.2-next.1
  - @backstage/theme@0.6.9-next.0
