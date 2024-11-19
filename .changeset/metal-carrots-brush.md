---
'@backstage/cli': patch
---

When using the experimental Rspack flag the app build and dev server now injects configuration via a `<script type="backstage.io/config">...</script>` tag in `index.html` rather than the `process.env.APP_CONFIG` definition, which will now be defined as an empty array instead.

This requires the app to be using the config loader from the 1.31 release of Backstage. Make sure your app is using at least that version if you are upgrading to this version of the CLI.

If you have copied the implementation of the `defaultConfigLoader`, make sure to update it to the new implementation. In particular the config loader needs to be able to read configuration from `script` tags with the type `backstage.io/config`.
