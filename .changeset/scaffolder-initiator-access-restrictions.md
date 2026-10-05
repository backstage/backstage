---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed a bug where a scaffolder task created by a restricted service token (an `externalAccess` entry with `accessRestrictions`) could fail partway through with `NotAllowedError: Access to target plugin '<pluginId>' is not included in token's access restrictions`, even when that plugin was correctly listed in the token's restrictions.

This happened because the task's record of who created it did not retain the full set of access restrictions once persisted, so any step that later acted on the creator's behalf saw a credential with no restriction information at all, and delegating that credential to another plugin was refused. Scaffolder now preserves the full access restriction data for the lifetime of the task, so token-restricted actors can drive templates whose steps call out to other plugins (for example the built-in catalog registration actions) without hitting this error.
