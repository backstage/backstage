# @backstage/backend-common

## 0.15.0-next.1

### Patch Changes

- 1732a18a7a: Exported `redactLogLine` function to be able to use it in custom loggers and renamed it to `redactWinstonLogLine`.
- Updated dependencies
  - @backstage/integration@1.3.0-next.1

## 0.15.0-next.0

### Minor Changes

- 12e9b54f0e: Added back support for when no branch is provided to the `UrlReader` for Bitbucket Server
- 30012e7d8c: - Added `force` and `remoteRef` option to `push` method in `git` actions
  - Added `addRemote` and `deleteRemote` methods to `git` actions

### Patch Changes

- fc8a5f797b: Improve `scm/git` wrapper around `isomorphic-git` library :

  - Add `checkout` function,
  - Add optional `remoteRef` parameter in the `push` function.

- 3b7930b3e5: Add support for Bearer Authorization header / token-based auth at Git commands.
- cfa078e255: The `ZipArchiveResponse` now correctly handles corrupt ZIP archives.

  Before this change, certain corrupt ZIP archives either cause the inflater to throw (as expected), or will hang the parser indefinitely.

  By switching out the `zip` parsing library, we now write to a temporary directory, and load from disk which should ensure that the parsing of the `.zip` files are done correctly because `streaming` of `zip` paths is technically impossible without being able to parse the headers at the end of the file.

- 770d3f92c4: The config prop `ensureExists` now applies to schema creation when `pluginDivisionMode` is set to `schema`. This means schemas will no longer accidentally be automatically created when `ensureExists` is set to `false`.
- 29f782eb37: Updated dependency `@types/luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/integration@1.3.0-next.0

## 0.14.1

### Patch Changes

- b1edb5cfd9: Fix parsing of S3 URLs for the default region.
- c3cfc83af2: Updated JSDoc to be MDX compatible.
- e57180e45e: Added some more information to the error messages for `isomorphic-git` errors
- 1f75dfac29: Fix edge case bug when gitlab relativePath is repeated in the target URL.
- 90c87f28e8: Moving from Bitbucket Server endpoint from https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp222 to https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp224, to have the last commit in function of different branch, and not only the list of default branch
- 9de15a41d7: Upgrade @octokit/rest to 19.0.3
- 0fc57887e8: Improve plural handling in logging output for secrets
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 954a94f52f: Support self-hosted gitlab installations with relative URL.
- Updated dependencies
  - @backstage/config-loader@1.1.3
  - @backstage/integration@1.2.2
  - @backstage/errors@1.1.0

## 0.14.1-next.3

### Patch Changes

- 90c87f28e8: Moving from Bitbucket Server endpoint from https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp222 to https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp224, to have the last commit in function of different branch, and not only the list of default branch
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/config-loader@1.1.3-next.1
  - @backstage/integration@1.2.2-next.3

## 0.14.1-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/integration@1.2.2-next.2

## 0.14.1-next.1

### Patch Changes

- 0fc57887e8: Improve plural handling in logging output for secrets
- Updated dependencies
  - @backstage/errors@1.1.0-next.0
  - @backstage/integration@1.2.2-next.1
  - @backstage/config-loader@1.1.3-next.0

## 0.14.1-next.0

### Patch Changes

- b1edb5cfd9: Fix parsing of S3 URLs for the default region.
- c3cfc83af2: Updated JSDoc to be MDX compatible.
- Updated dependencies
  - @backstage/integration@1.2.2-next.0

## 0.14.0

### Minor Changes

- 55647ec7df: **BREAKING**: Server-to-server tokens that are authenticated by the `ServerTokenManager` now must have an `exp` claim that has not expired. Tokens where the `exp` claim is in the past or missing are considered invalid and will throw an error. This is a followup to the deprecation from the `1.2` release of Backstage where perpetual tokens were deprecated. Be sure to update any usage of the `getToken()` method to have it be called every time a token is needed. Do not store tokens for later use.

### Patch Changes

- f72a6b8c62: Applied the `luxon` dependency fix from the `0.13.4` patch release.
- 5b22a8c97f: Applied the AWS S3 reading patch from the `0.13.5` patch release.
- f5283a42e2: Updated dependency `@google-cloud/storage` to `^6.0.0`.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/integration@1.2.1
  - @backstage/config-loader@1.1.2

## 0.14.0-next.2

### Minor Changes

- 55647ec7df: **BREAKING**: Server-to-server tokens that are authenticated by the `ServerTokenManager` now must have an `exp` claim that has not expired. Tokens where the `exp` claim is in the past or missing are considered invalid and will throw an error. This is a followup to the deprecation from the `1.2` release of Backstage where perpetual tokens were deprecated. Be sure to update any usage of the `getToken()` method to have it be called every time a token is needed. Do not store tokens for later use.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.1-next.2

## 0.13.6-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/config-loader@1.1.2-next.0
  - @backstage/integration@1.2.1-next.1

## 0.13.6-next.0

### Patch Changes

- f72a6b8c62: Applied the `luxon` dependency fix from the `0.13.4` patch release.
- 5b22a8c97f: Applied the AWS S3 reading patch from the `0.13.5` patch release.
- Updated dependencies
  - @backstage/integration@1.2.1-next.0

## 0.13.5

### Patch Changes

- 667d2ed6f8: Fix a bug in the URL Reading towards AWS S3 where it would hang indefinitely.

## 0.13.4

### Patch Changes

- 739be2b079: Fixed potential crash by bumping the `luxon` dependency to `^2.3.1`.

## 0.13.3

### Patch Changes

- e0a6360b80: Added a `stream()` method to complement the `buffer()` method on `ReadUrlResponse`. A `ReadUrlResponseFactory` utility class is now also available, providing a simple, consistent way to provide a valid `ReadUrlResponse`.

  This method, though optional for now, will be required on the responses of `UrlReader.readUrl()` implementations in a future release.

- 4b811aafce: Implemented the `UrlReader.search()` method for Google Cloud Storage. Due to limitations in the underlying storage API, only prefix-based searches are supported right now (for example, `https://storage.cloud.google.com/your-bucket/some-path/*`).
- 6673babab9: Gerrit integration: Added optional `cloneUrl` string to config.
- 75bf9e1da9: Split BitbucketUrlReader into BitbucketCloudUrlReader and BitbucketServerUrlReader. Backwards compatible.
- 28b0e4ddef: Update types to match the new version of `@keyv/redis`
- 5fcbd86960: **DEPRECATION**: Server-to-server authentication tokens issued from a
  `TokenManager` (specifically, `ServerTokenManager`) now has an expiry time set,
  for one hour in the future from when issued. This improves security. The ability
  to pass in and validate tokens that either have a missing `exp` claim, or an
  `exp` claim that expired in the past, is now deprecated. Trying to do so will
  lead to logged warnings, and in a future release will instead lead to errors.

  It was always the case that users of this interface were expected to call its
  `getToken()` method for every outgoing call and never hold on to any given token
  for reuse. But this now has become even more important advice to heed, and you
  should verify that you do not hold on to and reuse tokens such as these in your
  own code.

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 9ec4e0613e: Update to `jose` 4.6.0
- Updated dependencies
  - @backstage/integration@1.2.0
  - @backstage/cli-common@0.1.9
  - @backstage/config@1.0.1
  - @backstage/config-loader@1.1.1

## 0.13.3-next.2

### Patch Changes

- e0a6360b80: Added a `stream()` method to complement the `buffer()` method on `ReadUrlResponse`. A `ReadUrlResponseFactory` utility class is now also available, providing a simple, consistent way to provide a valid `ReadUrlResponse`.

  This method, though optional for now, will be required on the responses of `UrlReader.readUrl()` implementations in a future release.

- 4b811aafce: Implemented the `UrlReader.search()` method for Google Cloud Storage. Due to limitations in the underlying storage API, only prefix-based searches are supported right now (for example, `https://storage.cloud.google.com/your-bucket/some-path/*`).
- Updated dependencies
  - @backstage/cli-common@0.1.9-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/config-loader@1.1.1-next.1
  - @backstage/integration@1.2.0-next.1

## 0.13.3-next.1

### Patch Changes

- 28b0e4ddef: Update types to match the new version of `@keyv/redis`

## 0.13.3-next.0

### Patch Changes

- 6673babab9: Gerrit integration: Added optional `cloneUrl` string to config.
- 75bf9e1da9: Split BitbucketUrlReader into BitbucketCloudUrlReader and BitbucketServerUrlReader. Backwards compatible.
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 9ec4e0613e: Update to `jose` 4.6.0
- Updated dependencies
  - @backstage/integration@1.2.0-next.0
  - @backstage/config-loader@1.1.1-next.0

## 0.13.2

### Patch Changes

- 19f6c6c32a: The backend will no longer fail to start up when configured secrets do not match the configuration schema.
- b7436743cb: Added the GerritUrlReader that implements "readUrl".
- 3ef123bbf0: Support external ID when assuming roles in S3 integration

  In order to assume a role created by a 3rd party as external
  ID is needed. This change adds an optional field to the s3
  integration configuration and consumes that in the AwsS3UrlReader.

- bae9359032: The logger returned from `getVoidLogger` is now uses a silenced console transport instead.
- 3ff0e79654: Tweaked the `UrlReader` multiplexer so that it uses the more helpful `NotAllowedError` messaging for all methods.
- 12608f8ba8: Add `@types/webpack-env` to dependencies.
- f9f512559b: Updated the visibility of database connection fields in config to be secret
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/config-loader@1.1.0

## 0.13.2-next.2

### Patch Changes

- 19f6c6c32a: The backend will no longer fail to start up when configured secrets do not match the configuration schema.
- Updated dependencies
  - @backstage/config-loader@1.1.0-next.1
  - @backstage/integration@1.1.0-next.2

## 0.13.2-next.1

### Patch Changes

- b7436743cb: Added the GerritUrlReader that implements "readUrl".
- bae9359032: The logger returned from `getVoidLogger` is now uses a silenced console transport instead.
- Updated dependencies
  - @backstage/integration@1.1.0-next.1

## 0.13.2-next.0

### Patch Changes

- 3ef123bbf0: Support external ID when assuming roles in S3 integration

  In order to assume a role created by a 3rd party as external
  ID is needed. This change adds an optional field to the s3
  integration configuration and consumes that in the AwsS3UrlReader.

- f9f512559b: Updated the visibility of database connection fields in config to be secret
- Updated dependencies
  - @backstage/config-loader@1.0.1-next.0
  - @backstage/integration@1.0.1-next.0

## 0.13.1

### Patch Changes

- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- f24ef7864e: Minor typo fixes
- b66f70180f: Fix handling of bucket names with dots, in `AwsS3UrlReader`
- Updated dependencies
  - @backstage/config-loader@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.13.0

### Minor Changes

- ae9d6fb3df: **BREAKING**:

  - Removed the (since way back) deprecated `createDatabase` export, please use `createDatabaseClient` instead.
  - Removed the (since way back) deprecated `SingleConnectionDatabaseManager` export, please use `DatabaseManager` instead.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- aefca2a7e9: add support for ETag at `BitbucketUrlReader.readUrl`
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- Updated dependencies
  - @backstage/config-loader@0.9.7

## 0.13.0-next.0

### Minor Changes

- ae9d6fb3df: **BREAKING**:

  - Removed the (since way back) deprecated `createDatabase` export, please use `createDatabaseClient` instead.
  - Removed the (since way back) deprecated `SingleConnectionDatabaseManager` export, please use `DatabaseManager` instead.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- aefca2a7e9: add support for ETag at `BitbucketUrlReader.readUrl`
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- Updated dependencies
  - @backstage/config-loader@0.9.7-next.0

## 0.12.1

### Patch Changes

- Fixed runtime resolution of the `/alpha` entry point.

## 0.12.0

### Minor Changes

- 9a0510144f: **BREAKING**: The connection string for `redis` cache store now requires a protocol prefix.

  ```diff
  backend:
    cache:
      store: redis
  -   connection: user:pass@cache.example.com:6379
  +   connection: redis://user:pass@cache.example.com:6379
  ```

### Patch Changes

- 0df6077ab5: DockerContainerRunner.runContainer now automatically removes the container when its execution terminates
- 34af86517c: ensure `apiBaseUrl` being set for Bitbucket integrations, replace hardcoded defaults
- b838717e92: Export FetchUrlReader to facilitate more flexible configuration of the backend.
- Updated dependencies
  - @backstage/integration@0.8.0

## 0.11.0

### Minor Changes

- 7d12e4cf32: feat(backend-common): add Redis backed cache store

### Patch Changes

- b2f8bb99d3: Make backend.auth.keys optional in config schema. Previously backend.auth was optional but keys was not, which meant that if another plugin introduced additional properties under backend.auth, it would implicitly make backend.auth.keys mandatory.
- d64b8d3678: chore(deps): bump `minimatch` from 3.0.4 to 5.0.0
- Updated dependencies
  - @backstage/config-loader@0.9.6
  - @backstage/integration@0.7.5

## 0.10.9

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/cli-common@0.1.8
  - @backstage/config@0.1.15
  - @backstage/config-loader@0.9.5
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/types@0.1.3

## 0.10.8

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 0107c9aa08: chore(deps): bump `helmet` from 4.4.1 to 5.0.2
- b590e9b58d: Updated `isDatabaseConflictError` to handle modern sqlite conflict errors
- Updated dependencies
  - @backstage/config-loader@0.9.4
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/cli-common@0.1.7
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.10.7

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 599f3dfa83: chore(deps-dev): bump `@types/concat-stream` from 1.6.1 to 2.0.0
- c3868458d8: Removed unnecessary `get-port` dependency
- 04398e946e: Bump `selfsigned` to 2.0.0

## 0.10.7-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 599f3dfa83: chore(deps-dev): bump `@types/concat-stream` from 1.6.1 to 2.0.0
- c3868458d8: Removed unnecessary `get-port` dependency

## 0.10.6

### Patch Changes

- 50d039577a: Added a `Context` type for the backend, that can propagate an abort signal, a
  deadline, and contextual values through the call stack. The main entrypoint is
  the `Contexts` utility class that provides a root context creator and commonly
  used decorators.

  These are marked as `@alpha` for now, and are therefore only accessible via
  `@backstage/backend-common/alpha`.

## 0.10.6-next.0

### Patch Changes

- 50d039577a: Added a `Context` type for the backend, that can propagate an abort signal, a
  deadline, and contextual values through the call stack. The main entrypoint is
  the `Contexts` utility class that provides a root context creator and commonly
  used decorators.

  These are marked as `@alpha` for now, and are therefore only accessible via
  `@backstage/backend-common/alpha`.

## 0.10.5

### Patch Changes

- de9d7eba63: Fixed configuration schema incorrectly declaring `backend.listen.address` to exist, rather than `backend.listen.host`, which is the correct key.

## 0.10.4

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/config@0.1.13
  - @backstage/config-loader@0.9.3

## 0.10.4-next.0

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- Updated dependencies
  - @backstage/config@0.1.13-next.0
  - @backstage/config-loader@0.9.3-next.0
  - @backstage/integration@0.7.2-next.0

## 0.10.3

### Patch Changes

- 5b406daabe: build(deps-dev): bump `http-errors` from 1.8.0 to 2.0.0
- 5333451def: Cleaned up API exports
- db5310e25e: bump `logform` to use fixed version of `color` dependency
- 7946418729: Switched to using `@manypkg/get-packages` to list monorepo packages, which provides better support for different kind of monorepo setups.
- 3b4d8caff6: The GithubUrlReader is switched to use the DefaultGithubCredentialsProvider
- f77bd5c8ff: Clean up API reports
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/errors@0.2.0
  - @backstage/config-loader@0.9.2

## 0.10.2

### Patch Changes

- 21ae56168e: Updated the Git class with the following:

  - Added `depth` and `noCheckout` options to Git clone, using these you can create a bare clone that includes just the git history
  - New `log` function which you can use to view the commit history of a git repo

- eacc582473: Reverted the default CSP configuration to include `'unsafe-eval'` again, which was mistakenly removed in the previous version.

## 0.10.1

### Patch Changes

- 94cdf5d1bd: In-memory cache clients instantiated from the same cache manager now share the same memory space.
- 916b2f1f3e: Use the default CSP policy provided by `helmet` directly rather than a copy.
- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- 995e4c7d9d: Added support for non-"amazonaws.com" hosts (for example when testing with LocalStack) in AwsS3UrlReader.
- Updated dependencies
  - @backstage/integration@0.7.0
  - @backstage/config-loader@0.9.1

## 0.10.0

### Minor Changes

- 2f8a9b665f: Auto-generate secrets for backend-to-backend auth in local development environments.

  When NODE_ENV is 'development', the ServerTokenManager will now generate a secret for backend-to-backend auth to make it simpler to work locally on Backstage instances that use backend-to-backend auth. For production deployments, a secret must still be manually configured as described in [the backend-to-backend auth tutorial](https://backstage.io/docs/tutorials/backend-to-backend-auth).

  After the change, the static `fromConfig` method on the `ServerTokenManager` requires a logger.

  ```diff
  -  const tokenManager = ServerTokenManager.fromConfig(config);
  +  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  ```

### Patch Changes

- 776180b740: Fixed bug in backend-common to allow passing of remote option in order to enable passing remote url in --config option. The remote option should be passed along with reloadIntervalSeconds from packages/backend/src/index.ts (Updated the file as well)

  These changes are needed in `packages/backend/src/index.ts` if remote URLs are desired to be passed in --config option and read and watch remote files for config.

  ```diff
  @@ -86,7 +86,11 @@ async function main() {
     const config = await loadBackendConfig({
       argv: process.argv,
       logger,
  +    remote: {
  +      reloadIntervalSeconds: 60 * 10 // Check remote config changes every 10 minutes. Change to your desired interval in seconds
  +    }
     });
  +
     const createEnv = makeCreateEnv(config);

     const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  ```

- 2462b9e275: Ensure temporary directories are cleaned up if an error is thrown in the `filter` callback of the `UrlReader.readTree` options.
- 2f6d8ec3b6: Updated the `ReadTreeResponse` documentation to clarify that the caller of `dir()` is responsible for removing the directory after use.
- Updated dependencies
  - @backstage/config-loader@0.9.0

## 0.9.14

### Patch Changes

- fe24bc9a32: Each plugin now saves to a separate sqlite database file when `connection.filename` is provided in the sqlite config.
  Any existing sqlite database files will be ignored.

## 0.9.13

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- 5a008576c4: Add possibility to use custom error handler
- 98a9c35f0c: Add options argument to support additional database migrations configuration
- 6298de32dd: Add knexConfig config section

## 0.9.12

### Patch Changes

- 905dd952ac: Create a `TokenManager` interface and `ServerTokenManager` implementation to generate and validate server tokens for authenticated backend-to-backend API requests.
- 6b500622d5: Move to using node-fetch internally instead of cross-fetch
- 54989b671d: Fixed a potential crash in the log redaction code
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/config-loader@0.8.1

## 0.9.11

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/errors@0.1.5

## 0.9.10

### Patch Changes

- d7c1e0e34a: Added the `isDatabaseConflictError` function.
- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 1e99c73c75: Update internal usage of `configLoader.loadConfig` that now returns an object instead of an array of configs.
- 1daada3a06: Paths can be specified in backend.reading.allow to further restrict allowed targets
- 7ad9a07b27: Adding config prop `pluginDivisionMode` to allow plugins using the `pg` client to create their own management schemas in the db. This allows `pg` client plugins to work in separate schemas in the same db.
- 01f74aa878: Add `AbortSignal` support to `UrlReader`
- a8732a1200: Make sure that server builder `start()` propagates errors (such as failing to bind to the required port) properly and doesn't resolve the promise prematurely.

  After this change, the backend logger will be able to actually capture the error as it happens:

  ```
  2021-11-11T10:54:21.334Z backstage info Initializing http server
  2021-11-11T10:54:21.335Z backstage error listen EADDRINUSE: address already in use :::7000 code=EADDRINUSE errno=-48 syscall=listen address=:: port=7000
  ```

- 26b5da1c1a: Do not redact empty or one-character strings. These imply that it's just a test or local dev, and unnecessarily ruin the log output.
- Updated dependencies
  - @backstage/config-loader@0.8.0
  - @backstage/cli-common@0.1.6

## 0.9.9

### Patch Changes

- 8c4cad0bf2: AWSS3UrlReader now throws a `NotModifiedError` (exported from @backstage/backend-common) when s3 returns a 304 response.
- 0611f3b3e2: Reading app config from a remote server
- Updated dependencies
  - @backstage/config-loader@0.7.2

## 0.9.8

### Patch Changes

- 96cfa561eb: Adjusted some API exports
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- 1be8d2abdb: Any set configurations which have been tagged with a visibility 'secret', are now redacted from log lines.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/cli-common@0.1.5
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/config-loader@0.7.1

## 0.9.7

### Patch Changes

- be59619212: Add "rate limit exceeded" to error from GithubUrlReader if that is the cause of a read failure
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/config-loader@0.7.0
  - @backstage/errors@0.1.3

## 0.9.6

### Patch Changes

- 8f969d5a56: Correct error message typo
- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- d7055285de: Add glob patterns support to config CORS options. It's possible to send patterns like:

  ```yaml
  backend:
    cors:
      origin:
        - https://*.my-domain.com
        - http://localhost:700[0-9]
        - https://sub-domain-+([0-9]).my-domain.com
  ```

- Updated dependencies
  - @backstage/config-loader@0.6.10
  - @backstage/integration@0.6.7
  - @backstage/cli-common@0.1.4

## 0.9.5

### Patch Changes

- 8bb3c0a578: The `subscribe` method on the `Config` returned by `loadBackendConfig` is now forwarded through `getConfig` and `getOptionalConfig`.
- 0c8a59e293: Fix an issue where filtering in search doesn't work correctly for Bitbucket.
- Updated dependencies
  - @backstage/integration@0.6.6
  - @backstage/config-loader@0.6.9

## 0.9.4

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/config@0.1.10

## 0.9.3

### Patch Changes

- fab79adde1: Add AWS S3 Discovery Processor. Add readTree() to AwsS3UrlReader. Add ReadableArrayResponse type that implements ReadTreeResponse to use in AwsS3UrlReader's readTree()
- f7ad3a8925: Fix Azure `readTree` and `search` handling to properly support paths.
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/integration@0.6.4

## 0.9.2

### Patch Changes

- 9e5ed27ec: Properly export all used types.
- Updated dependencies
  - @backstage/cli-common@0.1.3
  - @backstage/config-loader@0.6.8
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9

## 0.9.1

### Patch Changes

- 714a2a918: Export type that are needed to implement a new `UrlReader`
- Updated dependencies
  - @backstage/integration@0.6.3

## 0.9.0

### Minor Changes

- a365f1faf: The `ZipArchiveResponse` class now accepts an optional `stripFirstDirectory` parameter. Note that its default value is `false`, which leads to a breaking change in behaviour to previous versions of the class. If you use this class explicitly and want to retain the old behaviour, add a `true` parameter value to its constructor.

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.8.10

### Patch Changes

- 8543d9890: Add an optional `info` parameter to the `readTree` filter option with a `size` property.
- 4d909268c: Read responses in `UrlReader#read()` as array buffer instead of as text to allow reading non-text locations such as images.
- 9b4604b38: Add support for watching configuration by implementing the `subscribe` method in the configuration returned by `loadBackendConfig`.
- b8cb12009: Add AWS S3 URL Reader
- Updated dependencies
  - @backstage/config@0.1.7
  - @backstage/config-loader@0.6.7
  - @backstage/integration@0.6.1

## 0.8.9

### Patch Changes

- f7ce7c565: Use a more informative error message when URL reading isn't allowed due to no reader matching the target URL.
- ce1958021: Pass on credentials to the integrations package, so that it can properly pick the API route when using GitHub apps based auth
- Updated dependencies
  - @backstage/integration@0.6.0

## 0.8.8

### Patch Changes

- 6aa7c3db7: bump node-tar version to the latest
- Updated dependencies
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9
  - @backstage/config-loader@0.6.6

## 0.8.7

### Patch Changes

- f25357273: Implement the etag functionality in the `readUrl` method of `FetchUrlReader`.
- bdd6ab5f1: It's possible to customize the request logging handler when building the service. For example in your `backend`

  ```
    const service = createServiceBuilder(module)
      .loadConfig(config)
      .setRequestLoggingHandler((logger?: Logger): RequestHandler => {
        const actualLogger = (logger || getRootLogger()).child({
          type: 'incomingRequest',
        });
        return expressWinston.logger({ ...
  ```

## 0.8.6

### Patch Changes

- 5f6f2fd96: Support a `ensureExists` config option to skip ensuring a configured database exists. This allows deployment scenarios where
  limited permissions are given for provisioned databases without privileges to create new databases. If set to `false`, the
  database connection will not be validated prior to use which means the backend will not attempt to create the database if it
  doesn't exist. You can configure this in your app-config.yaml:

  ```yaml
  backend:
    database:
      ensureExists: false
  ```

  This defaults to `true` if unspecified. You can also configure this per plugin connection and will override the base option.

- ad93bb035: Document the default behavior of `statusCheck` option in `createStatusCheckRouter`.
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/config-loader@0.6.5

## 0.8.5

### Patch Changes

- 09d3eb684: Added a `readUrl` method to the `UrlReader` interface that allows for complex response objects and is intended to replace the `read` method. This new method is currently optional to implement which allows for a soft migration to `readUrl` instead of `read` in the future.

  The main use case for `readUrl` returning an object instead of solely a read buffer is to allow for additional metadata such as ETag, which is a requirement for more efficient catalog processing.

  The `GithubUrlReader` and `GitlabUrlReader` readers fully implement `readUrl`. The other existing readers implement the new method but do not propagate or return ETags.

  While the `readUrl` method is not yet required, it will be in the future, and we already log deprecation warnings when custom `UrlReader` implementations that do not implement `readUrl` are used. We therefore recommend that any existing custom implementations are migrated to implement `readUrl`.

  The old `read` and the new `readUrl` methods can easily be implemented using one another, but we recommend moving the chunk of the implementation to the new `readUrl` method as `read` is being removed, for example this:

  ```ts
  class CustomUrlReader implements UrlReader {
    read(url: string): Promise<Buffer> {
      const res = await fetch(url);

      if (!res.ok) {
        // error handling ...
      }

      return Buffer.from(await res.text());
    }
  }
  ```

  Can be migrated to something like this:

  ```ts
  class CustomUrlReader implements UrlReader {
    read(url: string): Promise<Buffer> {
      const res = await this.readUrl(url);
      return res.buffer();
    }

    async readUrl(
      url: string,
      _options?: ReadUrlOptions,
    ): Promise<ReadUrlResponse> {
      const res = await fetch(url);

      if (!res.ok) {
        // error handling ...
      }

      const buffer = Buffer.from(await res.text());
      return { buffer: async () => buffer };
    }
  }
  ```

  While there is no usage of the ETag capability yet in the main Backstage packages, you can already add it to your custom implementations. To do so, refer to the documentation of the `readUrl` method and surrounding types, and the existing implementation in `packages/backend-common/src/reading/GithubUrlReader.ts`.

- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- c2db794f5: add defaultBranch property for publish GitHub action
- Updated dependencies
  - @backstage/integration@0.5.8

## 0.8.4

### Patch Changes

- 88d742eb8: Download archives as compressed tar files for GitLab to fix the `readTree` bug in TODO Plugin.
- ab5cc376f: Add new `isChildPath` and `resolveSafeChildPath` exports
- Updated dependencies
  - @backstage/cli-common@0.1.2
  - @backstage/integration@0.5.7

## 0.8.3

### Patch Changes

- e5cdf0560: Provide a more clear error message when database connection fails.
- 772dbdb51: Deprecates `SingleConnectionDatabaseManager` and provides an API compatible database
  connection manager, `DatabaseManager`, which allows developers to configure database
  connections on a per plugin basis.

  The `backend.database` config path allows you to set `prefix` to use an
  alternate prefix for automatically generated database names, the default is
  `backstage_plugin_`. Use `backend.database.plugin.<pluginId>` to set plugin
  specific database connection configuration, e.g.

  ```yaml
  backend:
    database:
      client: 'pg',
      prefix: 'custom_prefix_'
      connection:
        host: 'localhost'
        user: 'foo'
        password: 'bar'
      plugin:
        catalog:
          connection:
            database: 'database_name_overriden'
        scaffolder:
          client: 'sqlite3'
          connection: ':memory:'
  ```

  Migrate existing backstage installations by swapping out the database manager in the
  `packages/backend/src/index.ts` file as shown below:

  ```diff
  import {
  -  SingleConnectionDatabaseManager,
  +  DatabaseManager,
  } from '@backstage/backend-common';

  // ...

  function makeCreateEnv(config: Config) {
    // ...
  -  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
  +  const databaseManager = DatabaseManager.fromConfig(config);
    // ...
  }
  ```

- Updated dependencies
  - @backstage/config-loader@0.6.4

## 0.8.2

### Patch Changes

- 92963779b: Omits the `upgrade-insecure-requests` Content-Security-Policy directive by default, to prevent automatic HTTPS request upgrading for HTTP-deployed Backstage sites.

  If you previously disabled this using `false` in your `app-config.yaml`, this line is no longer necessary:

  ```diff
  backend:
    csp:
  -    upgrade-insecure-requests: false
  ```

  To keep the existing behavior of `upgrade-insecure-requests` Content-Security-Policy being _enabled_, add the key with an empty array as the value in your `app-config.yaml`:

  ```diff
  backend:
  +  csp:
  +    upgrade-insecure-requests: []
  ```

  Read more on [upgrade-insecure-requests here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests).

- eda9dbd5f: Download archives as compressed tar files for Bitbucket to keep executable permissions.
- Updated dependencies [eda9dbd5f]
  - @backstage/integration@0.5.6

## 0.8.1

### Patch Changes

- c7dad9218: All cache-related connection errors are now handled and logged by the cache manager. App Integrators may provide an optional error handler when instantiating the cache manager if custom error handling is needed.

  ```typescript
  // Providing an error handler
  const cacheManager = CacheManager.fromConfig(config, {
    onError: e => {
      if (isSomehowUnrecoverable(e)) {
        gracefullyShutThingsDown();
        process.exit(1);
      }
    },
  });
  ```

- 65e6c4541: Remove circular dependencies
- 5001de908: Change GitlabUrlReader to SHA timestamp compare using only commits that modify given file path, if file path given
- Updated dependencies [65e6c4541]
- Updated dependencies [290405276]
  - @backstage/integration@0.5.3
  - @backstage/config-loader@0.6.2

## 0.8.0

### Minor Changes

- 22fd8ce2a: Introducing: a standard API for App Integrators to configure cache stores and Plugin Developers to interact with them.

  Two cache stores are currently supported.

  - `memory`, which is a very simple in-memory key/value store, intended for local development.
  - `memcache`, which can be used to connect to a memcache host.

  Configuring and working with cache stores is very similar to the process for database connections.

  ```yaml
  backend:
    cache:
      store: memcache
      connection: user:pass@cache.example.com:11211
  ```

  ```typescript
  import { CacheManager } from '@backstage/backend-common';

  // Instantiating a cache client for a plugin.
  const cacheManager = CacheManager.fromConfig(config);
  const somePluginCache = cacheManager.forPlugin('somePlugin');
  const cacheClient = somePluginCache.getClient();

  // Using the cache client:
  const cachedValue = await cacheClient.get('someKey');
  if (cachedValue) {
    return cachedValue;
  } else {
    const someValue = await someExpensiveProcess();
    await cacheClient.set('someKey', someValue);
  }
  await cacheClient.delete('someKey');
  ```

  Cache clients deal with TTLs in milliseconds. A TTL can be provided as a defaultTtl when getting a client, or may be passed when setting specific objects. If no TTL is provided, data will be persisted indefinitely.

  ```typescript
  // Getting a client with a default TTL
  const cacheClient = somePluginCache.getClient({
    defaultTtl: 3600000,
  });

  // Setting a TTL on a per-object basis.
  cacheClient.set('someKey', data, { ttl: 3600000 });
  ```

  Configuring a cache store is optional. Even when no cache store is configured, the cache manager will dutifully pass plugins a manager that resolves a cache client that does not actually write or read any data.

### Patch Changes

- f9fb4a205: Prep work for mysql support in backend-common

## 0.7.0

### Minor Changes

- e0bfd3d44: Refactor the `runDockerContainer(…)` function to an interface-based api.
  This gives the option to replace the docker runtime in the future.

  Packages and plugins that previously used the `dockerode` as argument should be migrated to use the new `ContainerRunner` interface instead.

  ```diff
    import {
  -   runDockerContainer,
  +   ContainerRunner,
      PluginEndpointDiscovery,
    } from '@backstage/backend-common';
  - import Docker from 'dockerode';

    type RouterOptions = {
      // ...
  -   dockerClient: Docker,
  +   containerRunner: ContainerRunner;
    };

    export async function createRouter({
      // ...
  -   dockerClient,
  +   containerRunner,
    }: RouterOptions): Promise<express.Router> {
      // ...

  +   await containerRunner.runContainer({
  -   await runDockerContainer({
        image: 'docker',
        // ...
  -     dockerClient,
      });

      // ...
    }
  ```

  To keep the `dockerode` based runtime, use the `DockerContainerRunner` implementation:

  ```diff
  + import {
  +   ContainerRunner,
  +   DockerContainerRunner
  + } from '@backstage/backend-common';
  - import { runDockerContainer } from '@backstage/backend-common';

  + const containerRunner: ContainerRunner = new DockerContainerRunner({dockerClient});
  + await containerRunner.runContainer({
  - await runDockerContainer({
      image: 'docker',
      // ...
  -   dockerClient,
    });
  ```

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/integration@0.5.2
  - @backstage/config-loader@0.6.1
  - @backstage/config@0.1.5

## 0.6.3

### Patch Changes

- d367f63b5: remove use of deprecated type HelmetOptions
- b42531cfe: Support configuration of file storage for SQLite databases. Every plugin has its
  own database file at the specified path.

## 0.6.2

### Patch Changes

- b779b5fee: Add UrlReader for Google Cloud Storage
- Updated dependencies [82c66b8cd]
  - @backstage/config-loader@0.6.0

## 0.6.1

### Patch Changes

- 37e3a69f5: Export `ReadTreeResponseFile` and `SearchResponseFile`.

## 0.6.0

### Minor Changes

- 8686eb38c: Encode thrown errors in the backend as a JSON payload. This is technically a breaking change, since the response format even of errors are part of the contract. If you relied on the response being text, you will now have some extra JSON "noise" in it. It should still be readable by end users though.

  Before:

  ```
  NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'
      at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)
  ```

  After:

  ```json
  {
    "error": {
      "name": "NotFoundError",
      "message": "No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'",
      "stack": "NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'\n    at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)"
    },
    "request": {
      "method": "GET",
      "url": "/entities/by-name/user/default/tara.macgovern2"
    },
    "response": {
      "statusCode": 404
    }
  }
  ```

- 8686eb38c: Removed the custom error types (e.g. `NotFoundError`). Those are now instead in the new `@backstage/errors` package. This is a breaking change, and you will have to update your imports if you were using these types.

  ```diff
  -import { NotFoundError } from '@backstage/backend-common';
  +import { NotFoundError } from '@backstage/errors';
  ```

### Patch Changes

- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.5.6

### Patch Changes

- d7245b733: Add a utility function runDockerContainer used to run a docker container (currently used by Scaffolder and TechDocs for their 'generate' processes)
- 761698831: Bump to the latest version of the Knex library.

  You will most likely want to bump your own `packages/backend/package.json` as well:

  ```diff
  -    "knex": "^0.21.18",
  +    "knex": "^0.95.1",
  ```

  Note that the recent versions of the Knex library have some changes that may affect your internal plugins' database migration files. Importantly, they now support `ALTER TABLE` on SQLite, and no longer accidentally remove indices when making some modifications. It now also exports the `Knex` typescript type as a named export.

  ```ts
  import { Knex } from 'knex';
  ```

- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [905cbfc96]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1

## 0.5.5

### Patch Changes

- 497859088: Add optional `logClientErrors` to errorHandler to log 4XX errors
- 8adb48df4: Change debug log format to print as color grey

## 0.5.4

### Patch Changes

- 16fb1d03a: pass registered logger to requestLoggingHandler
- 491f3a0ec: Implement `UrlReader.search` for the other providers (Azure, Bitbucket, GitLab) as well.

  The `UrlReader` subclasses now are implemented in terms of the respective `Integration` class.

- 434b4e81a: Support globs in `FileReaderProcessor`.
- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- Updated dependencies [491f3a0ec]
  - @backstage/integration@0.5.0

## 0.5.3

### Patch Changes

- ffffea8e6: Minor updates to reflect the changes in `@backstage/integration` that made the fields `apiBaseUrl` and `apiUrl` mandatory.
- 82b2c11b6: Set explicit content-type in error handler responses.
- 965e200c6: Slight refactoring in support of a future search implementation in `UrlReader`. Mostly moving code around.
- 5a5163519: Implement `UrlReader.search` which implements glob matching.
- Updated dependencies [ffffea8e6]
  - @backstage/integration@0.4.0

## 0.5.2

### Patch Changes

- 2430ee7c2: Updated the `rootLogger` in `@backstage/backend-common` to support custom logging options. This is useful when you want to make some changes without re-implementing the entire logger and calling `setRootLogger` or `logger.configure`. For example you can add additional `defaultMeta` tags to each log entry. The following changes are included:

  - Added `createRootLogger` which accepts winston `LoggerOptions`. These options allow overriding the default keys.

  Example Usage:

  ```ts
  // Create the logger
  const logger = createRootLogger({
    defaultMeta: { appName: 'backstage', appEnv: 'prod' },
  });

  // Add a custom logger transport
  logger.add(new MyCustomTransport());

  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(), // already set to new logger instance
  });
  ```

- Updated dependencies [c4abcdb60]
- Updated dependencies [062df71db]
- Updated dependencies [064c513e1]
- Updated dependencies [e9aab60c7]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
  - @backstage/integration@0.3.2
  - @backstage/config-loader@0.5.1

## 0.5.1

### Patch Changes

- 26a3a6cf0: Honor the branch ref in the url when cloning.

  This fixes a bug in the scaffolder prepare stage where a non-default branch
  was specified in the scaffolder URL but the default branch was cloned.
  For example, even though the `other` branch is specified in this example, the
  `master` branch was actually cloned:

  ```yaml
  catalog:
    locations:
      - type: url
        target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
  ```

  This also fixes a 404 in the prepare stage for GitLab URLs.

- 664dd08c9: URL Reader's readTree: Fix bug with github.com URLs.
- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
  - @backstage/integration@0.3.1
  - @backstage/config-loader@0.5.0

## 0.5.0

### Minor Changes

- 5345a1f98: Remove fallback option from `UrlReaders.create` and `UrlReaders.default`, as well as the default fallback reader.

  To be able to read data from endpoints outside of the configured integrations, you now need to explicitly allow it by
  adding an entry in the `backend.reading.allow` list. For example:

  ```yml
  backend:
    baseUrl: ...
    reading:
      allow:
        - host: example.com
        - host: '*.examples.org'
  ```

  Apart from adding the above configuration, most projects should not need to take any action to migrate existing code. If you do happen to have your own fallback reader configured, this needs to be replaced with a reader factory that selects a specific set of URLs to work with. If you where wrapping the existing fallback reader, the new one that handles the allow list is created using `FetchUrlReader.factory`.

- 09a370426: Remove support for HTTPS certificate generation parameters. Use `backend.https = true` instead.

### Patch Changes

- 0b135e7e0: Add support for GitHub Apps authentication for backend plugins.

  `GithubCredentialsProvider` requests and caches GitHub credentials based on a repository or organization url.

  The `GithubCredentialsProvider` class should be considered stateful since tokens will be cached internally.
  Consecutive calls to get credentials will return the same token, tokens older than 50 minutes will be considered expired and reissued.
  `GithubCredentialsProvider` will default to the configured access token if no GitHub Apps are configured.

  More information on how to create and configure a GitHub App to use with backstage can be found in the documentation.

  Usage:

  ```javascript
  const credentialsProvider = new GithubCredentialsProvider(config);
  const { token, headers } = await credentialsProvider.getCredentials({
    url: 'https://github.com/',
  });
  ```

  Updates `GithubUrlReader` to use the `GithubCredentialsProvider`.

- 294a70cab: 1. URL Reader's `readTree` method now returns an `etag` in the response along with the blob. The etag is an identifier of the blob and will only change if the blob is modified on the target. Usually it is set to the latest commit SHA on the target.

  `readTree` also takes an optional `etag` in its options and throws a `NotModifiedError` if the etag matches with the etag of the resource.

  So, the `etag` can be used in building a cache when working with URL Reader.

  An example -

  ```ts
  const response = await reader.readTree(
    'https://github.com/backstage/backstage',
  );

  const etag = response.etag;

  // Will throw a new NotModifiedError (exported from @backstage/backstage-common)
  await reader.readTree('https://github.com/backstage/backstage', {
    etag,
  });
  ```

  2. URL Reader's readTree method can now detect the default branch. So, `url:https://github.com/org/repo/tree/master` can be replaced with `url:https://github.com/org/repo` in places like `backstage.io/techdocs-ref`.

- 0ea032763: URL Reader: Use API response headers for archive filename in readTree. Fixes bug for users with hosted Bitbucket.
- Updated dependencies [0b135e7e0]
- Updated dependencies [fa8ba330a]
- Updated dependencies [ed6baab66]
  - @backstage/integration@0.3.0

## 0.4.3

### Patch Changes

- Updated dependencies [466354aaa]
  - @backstage/integration@0.2.0

## 0.4.2

### Patch Changes

- 5ecd50f8a: Fix HTTPS certificate generation and add new config switch, enabling it simply by setting `backend.https = true`. Also introduces caching of generated certificates in order to avoid having to add a browser override every time the backend is restarted.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 0829ff126: Tweaked development log formatter to include extra fields at the end of each log line
- 036a84373: Provide support for on-prem azure devops
- Updated dependencies [ad5c56fd9]
- Updated dependencies [036a84373]
  - @backstage/config-loader@0.4.1
  - @backstage/integration@0.1.5

## 0.4.1

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- Updated dependencies [1d1c2860f]
- Updated dependencies [4eafdec4a]
- Updated dependencies [178e09323]
  - @backstage/integration@0.1.4

## 0.4.0

### Minor Changes

- 12bbd748c: Removes the Prometheus integration from `backend-common`.

  Rational behind this change is to keep the metrics integration of Backstage
  generic. Instead of directly relying on Prometheus, Backstage will expose
  metrics in a generic way. Integrators can then export the metrics in their
  desired format. For example using Prometheus.

  To keep the existing behavior, you need to integrate Prometheus in your
  backend:

  First, add a dependency on `express-prom-bundle` and `prom-client` to your backend.

  ```diff
  // packages/backend/package.json
    "dependencies": {
  +   "express-prom-bundle": "^6.1.0",
  +   "prom-client": "^12.0.0",
  ```

  Then, add a handler for metrics and a simple instrumentation for the endpoints.

  ```typescript
  // packages/backend/src/metrics.ts
  import { useHotCleanup } from '@backstage/backend-common';
  import { RequestHandler } from 'express';
  import promBundle from 'express-prom-bundle';
  import prom from 'prom-client';
  import * as url from 'url';

  const rootRegEx = new RegExp('^/([^/]*)/.*');
  const apiRegEx = new RegExp('^/api/([^/]*)/.*');

  export function normalizePath(req: any): string {
    const path = url.parse(req.originalUrl || req.url).pathname || '/';

    // Capture /api/ and the plugin name
    if (apiRegEx.test(path)) {
      return path.replace(apiRegEx, '/api/$1');
    }

    // Only the first path segment at root level
    return path.replace(rootRegEx, '/$1');
  }

  /**
   * Adds a /metrics endpoint, register default runtime metrics and instrument the router.
   */
  export function metricsHandler(): RequestHandler {
    // We can only initialize the metrics once and have to clean them up between hot reloads
    useHotCleanup(module, () => prom.register.clear());

    return promBundle({
      includeMethod: true,
      includePath: true,
      // Using includePath alone is problematic, as it will include path labels with high
      // cardinality (e.g. path params). Instead we would have to template them. However, this
      // is difficult, as every backend plugin might use different routes. Instead we only take
      // the first directory of the path, to have at least an idea how each plugin performs:
      normalizePath,
      promClient: { collectDefaultMetrics: {} },
    });
  }
  ```

  Last, extend your router configuration with the `metricsHandler`:

  ```diff
  +import { metricsHandler } from './metrics';

  ...

    const service = createServiceBuilder(module)
      .loadConfig(config)
      .addRouter('', await healthcheck(healthcheckEnv))
  +   .addRouter('', metricsHandler())
      .addRouter('/api', apiRouter);
  ```

  Your Prometheus metrics will be available at the `/metrics` endpoint.

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- Updated dependencies [38e24db00]
- Updated dependencies [b8ecf6f48]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/integration@0.1.3
  - @backstage/config@0.1.2

## 0.3.3

### Patch Changes

- 612368274: Allow the `backend.listen.port` config to be both a number or a string.
- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
  - @backstage/config-loader@0.4.0

## 0.3.2

### Patch Changes

- 3aa7efb3f: Added support for passing false as a CSP field value, to drop it from the defaults in the backend
- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration
- Updated dependencies [b3d4e4e57]
  - @backstage/integration@0.1.2

## 0.3.1

### Patch Changes

- bff3305aa: Added readTree support to AzureUrlReader
- b47dce06f: Make integration host and url configurations visible in the frontend

## 0.3.0

### Minor Changes

- 1722cb53c: Added support for loading and validating configuration schemas, as well as declaring config visibility through schemas.

  The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

  A configuration schema is declared using the `https://backstage.io/schema/config-v1` JSON Schema meta schema, which is based on draft07. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, and `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

  Packages that wish to contribute configuration schema should declare it in a root `"configSchema"` field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be in either `.json` or `.d.ts` format.

  TypeScript configuration schema files should export a single `Config` type, for example:

  ```ts
  export interface Config {
    app: {
      /**
       * Frontend root URL
       * @visibility frontend
       */
      baseUrl: string;
    };
  }
  ```

- 8e2effb53: Refactored UrlReader.readTree to be required and accept (url, options)

### Patch Changes

- 1722cb53c: Added configuration schema
- 7b37e6834: Added the integration package
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
  - @backstage/config-loader@0.3.0
  - @backstage/integration@0.1.1
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- 33b7300eb: Capture plugin name under the /api/ prefix for http metrics

## 0.2.0

### Minor Changes

- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- e37c0a005: Use localhost to fall back to IPv4 if IPv6 isn't available
- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6579769df: Add the ability to import components from Bitbucket Server to the service catalog
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 8afce088a: Use APP_ENV before NODE_ENV for determining what config to load
- 7bbeb049f: Change loadBackendConfig to return the config directly

### Patch Changes

- 440a17b39: Added new UrlReader interface for reading opaque data from URLs with different providers.

  This new URL reading system is intended as a replacement for the various integrations towards
  external systems in the catalog, scaffolder, and techdocs. It is configured via a new top-level
  config section called 'integrations'.

  Along with the UrlReader interface is a new UrlReaders class, which exposes static factory
  methods for instantiating readers that can read from many different integrations simultaneously.

- Updated dependencies [8c2b76e45]
- Updated dependencies [ce5512bc0]
  - @backstage/config-loader@0.2.0
  - @backstage/test-utils@0.1.2
