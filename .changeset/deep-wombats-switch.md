---
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
---

**BREAKING CHANGE** The deprecated `topics` and `repoVisibility` have been removed from being a top level import on the `publish:gitlab` action, and have now been moved to being part of the `settings` input instead.

```yaml
id: publish
action: publish:gitlab
input:
  repoVisibility: public
  topics:
    - test
```

Should be migrated to be as follows:

```yaml
id: publish
action: publish:gitlab
input:
  settings:
    visibility: public
    topics:
      - test
```
