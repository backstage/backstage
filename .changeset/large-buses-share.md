---
'@backstage/plugin-home': minor
---

Added three new home page widgets to the new frontend system:

- `home-page-widget:home/featured-docs` — adding `HomePageFeaturedDocs` widget to the new frontend system.
- `home-page-widget:home/top-visited` — adding `HomePageTopVisited` widget to the new frontend system (disabled by default).
- `home-page-widget:home/recently-visited` — adding `HomePageRecentlyVisited` widget to the new frontend system (disabled by default).
- Moved `home-page-widget:home/starred-entities` to `@backstage/plugin-catalog`. The `HomePageStarredEntities` old frontend system extension continues to work unchanged.

**BREAKING ALPHA**: The `home-page-widget:home/starred-entities` extension has been removed. Use `home-page-widget:catalog/starred-entities` from `@backstage/plugin-catalog` instead.

Added `layoutConfig` support to `page:home`, allowing default widget positions to be declared in `app-config.yaml`:

```yaml
app:
  extensions:
    - page:home:
        config:
          layoutConfig:
            - component: home-page-widget:home/toolkit
              x: 0
              y: 0
              width: 4
              height: 4
```
