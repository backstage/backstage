---
'@backstage/plugin-scaffolder-backend': patch
---

Enable the JSON parsing of the response from templated variables in the `v2beta1` syntax. Previously if template parameters json strings they were left as strings, they are now parsed as JSON objects.

Before:

```yaml
- id: test
  name: test-action
  action: custom:run
  input:
    input: '{"hello":"ben"}'
```

Now:

```yaml
- id: test
  name: test-action
  action: custom:run
  input:
    input:
      hello: ben
```

Also added the `parseRepoUrl` and `json` helpers to the parameters syntax. You can now use these helpers to parse work with some `json` or `repoUrl` strings in templates.

```yaml
- id: test
  name: test-action
  action: cookiecutter:fetch
  input:
    destination: '{{ parseRepoUrl parameters.repoUrl }}'
```

Will produce a parsed version of the `repoUrl` of type `{ repo: string, owner: string, host: string }` that you can use in your actions. Specifically `cookiecutter` with `{{ cookiecutter.destination.owner }}` like the `plugins/scaffolder-backend/sample-templates/v1beta2-demo/template.yaml` example.
