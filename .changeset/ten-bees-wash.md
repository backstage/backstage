---
'@backstage/plugin-techdocs': patch
---

While techdocs fetches site name and metadata for the component, the page title was displayed as '[object Object] | Backstage'. This has now been fixed to display the component ID if site name is not present or being fetched.
