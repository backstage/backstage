---
'@backstage/plugin-home-react': minor
---

Added `HomePageCardWidgetBlueprint` for creating card-based home page widgets wrapped in an `InfoCard`.

**BREAKING ALPHA**: `HomePageWidgetBlueprint` now creates a generic widget that renders its component directly without any card chrome. Any existing usage of `HomePageWidgetBlueprint` that produces a card-style widget should migrate to the new `HomePageCardWidgetBlueprint` instead.

Added `WidgetLayout` and `WidgetSettings` as the canonical public types. `CardLayout` and `CardSettings` are now deprecated aliases.
