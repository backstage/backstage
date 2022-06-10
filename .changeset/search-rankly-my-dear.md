---
'@backstage/plugin-catalog': patch
'@backstage/plugin-search': patch
'@backstage/plugin-techdocs': patch
---

In order to simplify analytics on top of the search experience in Backstage, the provided `<*ResultListItem />` component now captures a `discover` analytics event instead of a `click` event. This event includes the result rank as its `value` and, like a click, the URL/path clicked to as its `to` attribute.
