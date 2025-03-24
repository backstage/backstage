---
'@backstage/integration': minor
---

Implement Edit URL feature for Gerrit 3.9+. Enabled by default due to 3.8 EOL

Details:

- The Edit URL feature allows for direct editing of files in Gerrit through a specific URL pattern.
- URL pattern: `^\/admin\/repos\/edit\/repo\/(.+)\/branch\/(.+)\/file\/(.+)$`

Caution:

- To turn off this functionality, you can add the configuration `disableEditUrl: true` in the Gerrit integration section of your settings
