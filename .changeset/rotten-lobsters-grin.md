---
'@backstage/create-app': minor
'@backstage/integration': minor
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend': minor
---

- Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you recieve deprecation warnings your config should change like the following:

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

- Fix Gitlab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

- The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

`backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was github for example.
