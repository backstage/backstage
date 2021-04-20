---
'@backstage/plugin-techdocs': minor
---

Add feedback link icon in Techdocs Reader that directs to Gitlab or Github repo issue page with prefilled title and source link.
For link to appear, requires repo_url and edit_uri to be filled in mkdocs.yml, as per https://www.mkdocs.org/user-guide/configuration. edit_uri will need to be specified for self-hosted Gitlab/Github with different hostnames.
To identify issue URL format as Github or Gitlab, the hostname of source in repo_url is checked if it contains 'gitlab' or 'github'. Alternately this is determined by matching to 'host' values from 'integrations' in app-config.yaml.
