---
'@backstage/plugin-home': minor
---

Added three new home page widgets to the new frontend system:

- `home-page-widget:home/featured-docs` — adding `HomePageFeaturedDocs` widget to the new frontend system.
- `home-page-widget:home/top-visited` — adding `HomePageTopVisited` widget to the new frontend system (disabled by default).
- `home-page-widget:home/recently-visited` — adding `HomePageRecentlyVisited` widget to the new frontend system (disabled by default).

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
