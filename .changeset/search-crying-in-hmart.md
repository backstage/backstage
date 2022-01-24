---
'@backstage/plugin-search': minor
---

The way labels are controlled on both the `<SearchFilter.Checkbox />` and
`<SearchFilter.Select />` components has changed. Previously, the string passed
on the `name` prop (which controls the field being filtered on) was also
rendered as the field label. Now, if you want a label rendered, it must be
passed on the new `label` prop. If no `label` is provided, no label will be
rendered.
