---
'@backstage/plugin-gcp-projects': patch
---

UI updates to GCP-projects plugin

Adds the following to the project list page:

- pagination
- filtering
- sorting
- rows per page
- show/hide columns

Makes breadcrumb a link back to project list for the project details and new project views.

In project list page, updates New project button to use RouterLink instead of href to avoid login prompt.

In project details view, links to project details and logs now work, clicking on these will open the project or logs in GCP in new tab.
