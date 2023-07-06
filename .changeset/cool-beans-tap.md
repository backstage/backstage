---
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': minor
---

**BREAKING**

This change updates the configuration of the confluence-to-markdown action so that it does not conflict with other confluence plguins. Currently many plugins make use of the `confluence.auth` configuration. However, only the confluence-to-markdown action uses the `confluence.auth` as a string. This change updates it so that `confluence.auth` is an object.

## Required Changes

Below are examples for updating `bearer`, `basic`, and `userpass` implementations.

For `bearer`:
Before:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth: 'bearer'
  token: '${CONFLUENCE_TOKEN}'
```

After:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'bearer'
    token: '${CONFLUENCE_TOKEN}'
```

For `basic`:

Before:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth: 'basic'
  token: '${CONFLUENCE_TOKEN}'
  email: 'example@company.org'
```

After:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'basic'
    token: '${CONFLUENCE_TOKEN}'
    email: 'example@company.org'
```

For `userpass`
Before:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth: 'userpass'
  username: 'your-username'
  password: 'your-password'
```

After:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'userpass'
    username: 'your-username'
    password: 'your-password'
```
