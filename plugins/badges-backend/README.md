# Badges Backend

Backend plugin for serving badges. Default implementation uses
[badge-maker](https://www.npmjs.com/package/badge-maker) for creating
the badges, in svg.

## Setup

The list of all badges to offer are passed to the badges-backend
`createRouter()`.

You may also add/redefine badges in the `app-config.yaml`, under a
`badges` key. Example:

```yaml
badges:
  docs:
    kind: 'entity'
    target: '_{entity_url}/docs'
    label: 'docs'
    message: '_{entity.metadata.name}'
    color: 'navyblue'
    style: for-the-badge
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/badges)
- [The Backstage homepage](https://backstage.io)
