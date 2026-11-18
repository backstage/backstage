---
'@backstage/integration': patch
---

When `allowedInstallationOwners` is configured for a GitHub App, installations owned by other accounts are now left out when enumerating the app's installations. This makes the enumeration consistent with how the list is already enforced when installation tokens are issued, so that consumers deriving organizations from the app's installations, such as catalog providers, only see the allowed ones.
