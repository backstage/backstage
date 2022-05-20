---
'@backstage/plugin-techdocs': patch
---

Packages a set of tweaks to the TechDocs addons rendering process:

- Prevents displaying sidebars until page styles are loaded and the sidebar position is updated;
- Prevents new sidebar locations from being created every time the reader page is rendered if these locations already exist;
- Centers the styles loaded event to avoid having multiple locations setting the opacity style in Shadow Dom causing the screen to flash multiple times.
