---
'@backstage/ui': minor
---

Added re-exports from `react-aria-components`. The types `Selection`, `SortDirection`, and `Key` are available as type-only exports (use `import type`), while `Focusable` is a runtime export. Consumers can now import these directly from `@backstage/ui` instead of depending on `react-aria-components`, avoiding version mismatches.
