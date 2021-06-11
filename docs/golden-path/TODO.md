- Create App

  - `npx @backstage/create-app`

- Create backend plugin

  - `yarn create-plugin --backend` `entity-image`

  - create a simple image store

  - write up to backend

- Create migrations

  - `mkdir plugins/entity-image-backend/migrations && touch "plugins/entity-image-backend/migrations/$(date +"%Y%m%d%H%M%S")_entity_images.js"`

  - add migrations to `files` in the package.json for the plugin

  - add knex dependency
