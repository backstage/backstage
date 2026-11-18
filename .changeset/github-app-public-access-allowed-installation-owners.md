---
'@backstage/integration': patch
---

When `allowedInstallationOwners` is configured for a GitHub App, the `publicAccess` token fallback now only mints its token from an installation owned by one of the allowed accounts, instead of using the first available installation. This makes the fallback consistent with how the list is already enforced when installation tokens are issued, so that the fallback is always served by an installation within the allow list.
