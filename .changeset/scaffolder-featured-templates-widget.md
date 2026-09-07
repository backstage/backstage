---
'@backstage/plugin-scaffolder': minor
---

Added a `Featured Templates` homepage widget for the new frontend system. It shows the software templates that carry a configurable catalog tag (`featured` by default) as a scrollable row of template cards, with a link to the template form for each card and a link to the templates page when nothing is tagged. The widget is registered as `home-page-widget:scaffolder/featured-templates` and its `title` and `tag` can be set through extension config.
