---
'@techdocs/cli': patch
---

Fixed a path mismatch between the techdocs-cli-embedded-app and the `serve` command.

[This commit](https://github.com/backstage/backstage/commit/b44692890b1c6ca1df55313612a1d28e3c61ea8a)
removed logic that caused the techdocs-cli-embedded-app to resolve the the techdocs API origin to
`http://localhost:3000/api`.
After that commit, the techdocs API origin resolved to `http://localhost:3000/api/techdocs`.
Without this corresponding change in the techdocs-cli, the browser requests for techdocs
page content are sent to the mkdocs container with the `/techdocs/` prefix, which results in
404 errors.
