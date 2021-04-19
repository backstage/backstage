---
'@backstage/plugin-techdocs': minor
---

Add feedback link icon in Techdocs Reader that directs to Gitlab or Github repo issue page with prefilled title and source link.
For link to appear, requires repo_url and edit_uri to be filled in mkdocs.yml, as per https://www.mkdocs.org/user-guide/configuration. edit_uri will need to be specified for self-hosted Gitlab/Github with different hostnames.
Gitlab or Github detection checks for 'gitlab' or 'github' in hostname of source in repo_url;
additionally 'techdocs.feedback.gitlab' and '.github' in app config can be used to specify hostnames that should be recognised as the respective Git hosting for the feedback link.
