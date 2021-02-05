# @backstage/integration

## 0.3.2

### Patch Changes

- c4abcdb60: Fix GitLab handling of paths with spaces
- 064c513e1: Properly forward errors that occur when looking up GitLab project IDs.
- 3149bfe63: Add a `resolveUrl` method to integrations, that works like the two-argument URL
  constructor. The reason for using this is that Azure have their paths in a
  query parameter, rather than the pathname of the URL.

  The implementation is optional (when not present, the URL constructor is used),
  so this does not imply a breaking change.

- 2e62aea6f: #4322 Bitbucket own hosted v5.11.1 branchUrl fix and enabled error tracing… #4347

## 0.3.1

### Patch Changes

- 6800da78d: Fix default branch API url for custom hosted Bitbucket server
- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.

## 0.3.0

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

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

- fa8ba330a: Fix GitLab API base URL and add it by default to the gitlab.com host

## 0.2.0

### Minor Changes

- 466354aaa: Build out the `ScmIntegrations` class, as well as the individual `*Integration` classes

## 0.1.5

### Patch Changes

- 036a84373: Provide support for on-prem azure devops

## 0.1.4

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- 178e09323: Validate that integration config contains a valid host

## 0.1.3

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- b8ecf6f48: Add the basics of cross-integration concerns
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2

## 0.1.2

### Patch Changes

- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration

## 0.1.1

### Patch Changes

- 7b37e6834: Added the integration package
