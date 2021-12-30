# @backstage/integration-react

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.7.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2

## 0.1.15

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.1.13

### Patch Changes

- 36e2b548cb: Clean up the API exports
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/integration@0.6.9
  - @backstage/core-components@0.7.2
  - @backstage/core-plugin-api@0.1.12

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.8
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.1.11

### Patch Changes

- 18148f23da: Added `ScmAuthApi` along with the implementation `ScmAuth`. The `ScmAuthApi` provides methods for client-side authentication towards multiple different source code management services simultaneously.

  When requesting credentials you supply a URL along with the same options as the other `OAuthApi`s, and optionally a request for additional high-level scopes.

  For example like this:

  ```ts
  const { token } = await scmAuthApi.getCredentials({
    url: 'https://ghe.example.com/backstage/backstage',
    additionalScope: {
      repoWrite: true,
    },
  });
  ```

  The instantiation of the API can either be done with a default factory that adds support for the public providers (github.com, gitlab.com, etc.):

  ```ts
  // in packages/app/apis.ts
  ScmAuth.createDefaultApiFactory();
  ```

  Or with a more custom setup that can add support for additional providers, for example like this:

  ```ts
  createApiFactory({
    api: scmAuthApiRef,
    deps: {
      gheAuthApi: gheAuthApiRef,
      githubAuthApi: githubAuthApiRef,
    },
    factory: ({ githubAuthApi, gheAuthApi }) =>
      ScmAuth.merge(
        ScmAuth.forGithub(githubAuthApi),
        ScmAuth.forGithub(gheAuthApi, {
          host: 'ghe.example.com',
        }),
      ),
  });
  ```

  The additional `gheAuthApiRef` utility API can be defined either inside the app itself if it's only used for this purpose, or inside an internal common package for APIs, such as `@internal/apis`:

  ```ts
  const gheAuthApiRef: ApiRef<OAuthApi & ProfileInfoApi & SessionApi> =
    createApiRef({
      id: 'internal.auth.ghe',
    });
  ```

  And then implemented using the `GithubAuth` class from `@backstage/core-app-api`:

  ```ts
  createApiFactory({
    api: gheAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GithubAuth.create({
        provider: {
          id: 'ghe',
          icon: ...,
          title: 'GHE'
        },
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  })
  ```

  Finally you also need to add and configure another GitHub provider to the `auth-backend` using the provider ID `ghe`:

  ```ts
  // Add the following options to `createRouter` in packages/backend/src/plugins/auth.ts
  providerFactories: {
    ghe: createGithubProvider(),
  },
  ```

  Other providers follow the same steps, but you will want to use the appropriate auth API implementation in the frontend, such as for example `GitlabAuth`.

- Updated dependencies
  - @backstage/integration@0.6.6
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5
  - @backstage/config@0.1.10

## 0.1.9

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/core-plugin-api@0.1.8

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9

## 0.1.5

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.4

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.3

### Patch Changes

- f4e3ac5ce: Move `ScmIntegrationIcon` from `@backstage/plugin-catalog` to
  `@backstage/integration-react` and make it customizable using
  `app.getSystemIcon()`.
- Updated dependencies [eda9dbd5f]
  - @backstage/integration@0.5.6

## 0.1.2

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
