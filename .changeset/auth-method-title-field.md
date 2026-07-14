---
'@backstage/connections': minor
---

Added a `title` field to connection auth methods, providing a human-readable display name for each configured authentication option. Connection type authors must now provide a `title` for each auth method definition, while connection configuration may optionally override the title per auth entry. When not explicitly configured, the auth entry title defaults to the auth method title defined by the connection type.
