---
'@backstage/cli': minor
---

Added new `auth` command group for authenticating the CLI with Backstage instances using OIDC dynamic client registration. Commands include `login`, `logout`, `list`, `show`, `print-token`, and `select` for managing multiple authenticated instances. The CLI automatically refreshes access tokens using refresh tokens when they expire, enabling long-lived sessions.
