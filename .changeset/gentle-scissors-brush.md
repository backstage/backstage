---
'@backstage/plugin-techdocs-node': minor
---

Use [`edit_uri_template`](https://www.mkdocs.org/user-guide/configuration/#edit_uri_template)
instead of [`edit_uri`](https://www.mkdocs.org/user-guide/configuration/#edit_uri)
and remove integration type-based limit.

Effectively, this will add at least `repo_url` to all `url`-type locations of all integrations.

Additionally, `edit_uri_template` will only be added if the integration supports an edit URL
(== `resolveEditUrl` does not return URL unchanged).
