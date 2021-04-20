---
'@backstage/plugin-techdocs': minor
---

Add feedback link icon in Techdocs Reader that directs to GitLab or GitHub repo issue page with pre-filled title and source link.
For link to appear, requires `repo_url` and `edit_uri` to be filled in mkdocs.yml, as per https://www.mkdocs.org/user-guide/configuration. An `edit_uri` will need to be specified for self-hosted GitLab/GitHub instances with a different host name.
To identify issue URL format as GitHub or GitLab, the host name of source in `repo_url` is checked if it contains `gitlab` or `github`. Alternately this is determined by matching to `host` values from `integrations` in app-config.yaml.
