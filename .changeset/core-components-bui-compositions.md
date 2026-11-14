---
'@backstage/core-components': patch
---

Deprecated components with Backstage UI replacements or compositions: `Avatar`, `Link`, `LinkButton`, `Select`, `Content`, `BottomLink`, `HeaderActionMenu`, `HeaderLabel`, `HeaderTabs`, `ItemCardGrid`, `ItemCardHeader`, `TabbedCard`, `CardTab`, `SubvalueCell`, `CreateButton`, `ContentHeader`, `FavoriteToggle`, `FavoriteToggleIcon`, `HeaderIconLinkRow`, `IconLinkVertical`, and `OverflowTooltip`, along with their associated public types.

Use the replacements from `@backstage/ui` described in each component's deprecation notice. These migrations require adapting props and composition, including external-link presentation, selection callbacks, document titles, and error boundaries where applicable. Existing exports and runtime behavior are unchanged.
