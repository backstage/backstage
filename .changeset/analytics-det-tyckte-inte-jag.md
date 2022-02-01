---
'@backstage/core-components': patch
'@backstage/plugin-catalog-react': patch
---

The `<Link />` component now accepts a `noTrack` prop, which prevents the `click` event from being captured by the Analytics API. This can be used if tracking is explicitly not warranted, or in order to use custom link tracking in specific situations.
