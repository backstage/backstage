---
'@backstage/integration': minor
---

Update the `GitLabIntegrationConfig` to require the fields `apiBaseUrl` and `baseUrl`. The `readGitLabIntegrationConfig` function is now more strict and has better error reporting. This change mirrors actual reality in code more properly - the fields are actually necessary for many parts of code to actually function, so they should no longer be optional.

Some checks that used to happen deep inside code that consumed config, now happen upfront at startup. This means that you may encounter new errors at backend startup, if you had actual mistakes in config but didn't happen to exercise the code paths that actually would break. But for most users, no change will be necessary.

An example minimal GitLab config block that just adds a token to public GitLab would look similar to this:

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token:
        $env: GITLAB_TOKEN
```

A full fledged config that points to a locally hosted GitLab could look like this:

```yaml
integrations:
  gitlab:
    - host: gitlab.my-company.com
      apiBaseUrl: https://gitlab.my-company.com/api/v4
      baseUrl: https://gitlab.my-company.com
      token:
        $env: OUR_GITLAB_TOKEN
```

In this case, the only optional field is `baseUrl` which is formed from the `host` if needed.
