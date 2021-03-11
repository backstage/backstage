# Badges Backend

Backend plugin for serving badges. Default implementation uses
[badge-maker](https://www.npmjs.com/package/badge-maker) for creating the
badges, in SVG.

Currently, only entity badges are implemented. i.e. badges that may have entity
specific information in them, and as such, are served from a entity specific
endpoint.

## Setup

The list of all badges to offer are passed as an object with badge factories to
the badges-backend `createRouter()` during plugin registration.

## Badge builder

Badges are created by classes implementing the `BadgeBuilder` type. The default
badge builder uses badge factories to turn a `BadgeContext` into a `Badge` spec
for the `badge-maker` to create the SVG image.

### Default badges

A set of default badge factories are defined in
[badges.ts](https://github.com/backstage/backstage/tree/master/plugins/badges-backend/src/badges.ts)
as examples.

Additional badges may be provided in your application by defining custom badge
factories, and provide them to the badge builder.

## API

The badges backend api exposes two main endpoints for entity badges. (the
`/badges` prefix is arbitrary, and the default for the example backend.)

- `/badges/entity/:namespace/:kind/:name/badge-specs` List all defined badges
  for a particular entity, in json format. See
  [BadgeSpec](https://github.com/backstage/backstage/tree/master/plugins/badges/src/api/types.ts)
  from the frontend plugin for a type declaration.

- `/badges/entity/:namespace/:kind/:name/:badgeId` Get the entity badge as an
  SVG image. If the `accept` request header prefers `application/json` the badge
  spec as JSON will be returned instead of the image.

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/badges)
- [The Backstage homepage](https://backstage.io)
