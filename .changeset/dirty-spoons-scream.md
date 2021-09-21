---
'@backstage/plugin-catalog-backend': minor
---

Apply the catalog rules enforcer, based on origin location.

This is a breaking change, in the sense that this was not properly checked in earlier versions of the new catalog engine. You may see ingestion of certain entities start to be rejected after this update, if the following conditions apply to you:

- You are using the configuration key `catalog.rules.[].allow`, and
- Your registered locations point (directly or transitively) to entities whose kinds are not listed in `catalog.rules.[].allow`

and/or

- You are using the configuration key `catalog.locations.[].rules.[].allow`
- The config locations point (directly or transitively) to entities whose kinds are not listed neither `catalog.rules.[].allow`, nor in the corresponding `.rules.[].allow` of that config location

This is an example of what the configuration might look like:

```yaml
catalog:
  # These do not list Template as a valid kind; users are therefore unable to
  # manually register entities of the Template kind
  rules:
    - allow:
        - Component
        - API
        - Resource
        - Group
        - User
        - System
        - Domain
        - Location
  locations:
    # This lists Template as valid only for that specific config location
    - type: file
      target: ../../plugins/scaffolder-backend/sample-templates/all-templates.yaml
      rules:
        - allow: [Template]
```

If you are not using any of those `rules` section, you should not be affected by this change.

If you do use any of those `rules` sections, make sure that they are complete and list all of the kinds that are in active use in your Backstage installation.
