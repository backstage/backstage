---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend': minor
---

Enable the JSON parsing of the response from templated variables in the `v2beta1` syntax. Previously if template parameters json strings they were left as strings, they are now parsed as JSON objects.

Before:

```yaml
- id: publish
  name: Publish
  action: publish:github
  input:
    destination: '{"host":"github.com","owner":"owner","repo":"repo"}'
```

Now:

```yaml
- id: publish
  name: Publish
  action: publish:github
  input:
    destination:
      host: 'github.com'
      owner: 'owner'
      repo: 'repo'
```

Deprecates the `repoUrl` parameters and has been replaced in favour of `destination` which means that you'll need to update your templates where you use the `RepoUrlPicker`. Firstly, updating the `parameters` section:

```diff
diff --git a/test.yaml b/fileb.yaml
  parameters:
    - title: Choose a location
      required:
-        - repoUrl
+        - destination
      properties:
-        repoUrl:
+        destination:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
```

And then updating the steps as follows:

```diff
diff --git a/test.yaml b/fileb.yaml
  steps
    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: 'This is {{ parameters.name }}'
-        repoUrl: '{{ parameters.repoUrl }}'
+        destination: '{{ parameters.destination }}'
```

This will need to be done for **each** publish action in your templates!
