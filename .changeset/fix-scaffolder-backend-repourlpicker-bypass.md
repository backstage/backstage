---
'@backstage/plugin-scaffolder-backend': patch
---

**SECURITY**: The scaffolder backend now enforces the `RepoUrlPicker` field
extension's `allowedHosts`, `allowedOwners`, `allowedRepos`,
`allowedOrganizations`, and `allowedProjects` `ui:options` server-side when a
task is created via `POST /api/scaffolder/v2/tasks` and during template
dry-runs.

Previously these allowlists were only applied in the browser by the
`RepoUrlPicker` field. A caller posting directly to the API could submit a
`repoUrl` referencing any host / owner / repo, and the scaffolder backend
would execute the template's actions against it using its configured SCM
integration credentials. This allowed an authenticated user with API access
to bypass template-author-declared boundaries and create repositories in
organizations outside the intended scope.

The backend now parses the submitted `repoUrl` for any parameter whose
`ui:field` is `RepoUrlPicker`, and rejects the task with a `400` containing a
`ValidationError` whenever the parsed `host`, `owner`, `repo`, `organization`,
or `project` is not present in the corresponding `allowed*` list on that
field. Fields without any `allowed*` lists (or with an empty list) continue
to accept any value, matching the previous behaviour.

Templates that intentionally allowed broader values than their `ui:options`
declared via direct API access will need to relax those `ui:options` to
reflect the actual policy, or stop bypassing the picker.
