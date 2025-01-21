# @backstage/plugin-auth-backend-module-microsoft-provider

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/plugin-auth-node@0.5.6-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0

## 0.2.3

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-auth-node@0.5.5-next.2

## 0.2.3-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/plugin-auth-node@0.5.4-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0

## 0.2.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- daa02d6: Add `skipUserProfile` config flag to Microsoft authenticator
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/backend-plugin-api@1.0.1

## 0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- daa02d6: Add `skipUserProfile` config flag to Microsoft authenticator
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0

## 0.2.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 3c2d690: Allow users without defined email to be ingested by the `msgraph` catalog plugin and add `userIdMatchingUserEntityAnnotation` sign-in resolver for the Microsoft auth provider to support sign-in for users without defined email.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2

## 0.2.0-next.2

### Patch Changes

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1

## 0.2.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 3c2d690: Allow users without defined email to be ingested by the `msgraph` catalog plugin and add `userIdMatchingUserEntityAnnotation` sign-in resolver for the Microsoft auth provider to support sign-in for users without defined email.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0

## 0.1.18

### Patch Changes

- c8f1cae: Add `signIn` to authentication provider configuration schema
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 39f36a9: Updated the Microsoft authenticator to accurately define required scopes, but to also omit the required and additional scopes when requesting resource scopes.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-auth-node@0.5.0

## 0.1.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.1.18-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2

## 0.1.18-next.1

### Patch Changes

- c8f1cae: Add `signIn` to authentication provider configuration schema
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.1.18-next.0

### Patch Changes

- 39f36a9: Updated the Microsoft authenticator to accurately define required scopes, but to also omit the required and additional scopes when requesting resource scopes.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-auth-node@0.4.17

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0

## 0.1.14

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 8efc6cf: Added support for the new shared `additionalScopes` configuration.
- d44a20a: Added additional plugin metadata to `package.json`.
- c187a9c: Minor internal type updates
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14

## 0.1.14-next.2

### Patch Changes

- 8efc6cf: Added support for the new shared `additionalScopes` configuration.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3

## 0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-plugin-api@0.6.16

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15

## 0.1.9

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/backend-plugin-api@0.6.14

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## 0.1.8-next.0

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0

## 0.1.5

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- 1ff2684: Added the possibility to use custom scopes for performing login with Microsoft EntraID.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10

## 0.1.5-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.1.5-next.0

### Patch Changes

- 1ff2684: Added the possibility to use custom scopes for performing login with Microsoft EntraID.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0

## 0.1.4

### Patch Changes

- 928efbc: Deprecated the `authModuleMicrosoftProvider` export. A default export is now available and should be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));`
- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-auth-node@0.4.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.1.4-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.1.3

### Patch Changes

- a62764b: Updated dependency `passport` to `^0.7.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8

## 0.1.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.1.3-next.2

### Patch Changes

- a62764b: Updated dependency `passport` to `^0.7.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0

## 0.1.2

### Patch Changes

- a3236ad0ca: Fix link to the repository in `README.md`.
- 3979524c74: Added support for specifying a domain hint on the Microsoft authentication provider configuration.
- fde212dd10: Re-add the missing profile photo
  as well as access token retrieval for foreign scopes.

  Additionally, we switch from previously 48x48 to 96x96
  which is the size used at the profile card.

- 5aeb14f035: Correctly mark the client secret in configuration as secret
- 2817115d09: Removed `prompt=consent` from start method to fix #20641
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/plugin-auth-node@0.4.1

## 0.1.2-next.2

### Patch Changes

- [#20706](https://github.com/backstage/backstage/pull/20706) [`fde212dd10`](https://github.com/backstage/backstage/commit/fde212dd106e507c4a808e5ed8213e29d7338420) Thanks [@pjungermann](https://github.com/pjungermann)! - Re-add the missing profile photo
  as well as access token retrieval for foreign scopes.

  Additionally, we switch from previously 48x48 to 96x96
  which is the size used at the profile card.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.1.2-next.1

### Patch Changes

- 3979524c74: Added support for specifying a domain hint on the Microsoft authentication provider configuration.
- 5aeb14f035: Correctly mark the client secret in configuration as secret
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1

## 0.1.2-next.0

### Patch Changes

- 2817115d09: Removed `prompt=consent` from start method to fix #20641
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/plugin-auth-node@0.4.1-next.0

## 0.1.0

### Minor Changes

- 2d8f7e82c1: Migrated the Microsoft auth provider to new `@backstage/plugin-auth-backend-module-microsoft-provider` module package.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## 0.1.0-next.0

### Minor Changes

- 2d8f7e82c1: Migrated the Microsoft auth provider to new `@backstage/plugin-auth-backend-module-microsoft-provider` module package.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
