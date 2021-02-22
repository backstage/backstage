# Badges Backend

Backend plugin for serving badges. Default implementation uses
[badge-maker](https://www.npmjs.com/package/badge-maker) for creating
the badges, in svg.

## Setup

Define which badges to offer in the backend api by declaring them in
the app-config, under a `badges` key. Example:

```yaml
badges:
  docs:
    kind: 'entity'
    target: '_{entity_url}/docs'
    label: 'Documentation'
    message: '_{entity.metadata.name}'
    color: 'navyblue'

  lifecycle:
    kind: 'entity'
    description: 'Entity lifecycle badge'
    target: '_{entity_url}'
    label: 'Lifecycle'
    message: '_{entity.spec.lifecycle}'
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/badges)
- [The Backstage homepage](https://backstage.io)
