---
'@backstage/plugin-scaffolder-backend': minor
---

Migrated permission registration to use the `PermissionsRegistryService` instead of the deprecated `createPermissionIntegrationRouter`. This fixes an issue where scaffolder permissions were not visible to RBAC plugins because the `actionsRegistryServiceRef` dependency caused an empty permissions metadata router to shadow the scaffolder's actual permission metadata. The old `createPermissionIntegrationRouter` path is retained as a fallback for standalone `createRouter` usage.
