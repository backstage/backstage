---
'@backstage/plugin-home-react': minor
---

`HomePageWidgetBlueprint` now accepts a `render` discriminator to support two widget styles:

- `render?: 'card'` (default) — wraps the widget in an `InfoCard` with a title header, optional actions, settings popover, and context provider. Provide a `components` loader returning `ComponentParts`.
- `render: 'basic'` — renders the component returned by `loader` directly without any card chrome. Use this for search bars, banners, hero sections, or any widget that manages its own visual presentation.

Added `WidgetLayout` and `WidgetSettings` as the canonical public types. `CardLayout` and `CardSettings` are now deprecated aliases.
