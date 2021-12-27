---
'@backstage/integration': minor
---

Create an interface for the GitHub credentials provider in order to support providing implementations.

We have changed the name of the `GithubCredentialsProvider` to `SingleInstanceGithubCredentialsProvider`.

`GithubCredentialsProvider` is now an interface that maybe implemented to provide a custom mechanism to retrieve GitHub credentials.

In a later release we will support configuring URL readers, scaffolder tasks, and processors with customer GitHub credentials providers.

If you want to uptake this release, you will need to replace all references to `GithubCredentialsProvider.create` with `SingleInstanceGithubCredentialsProvider.create`.
