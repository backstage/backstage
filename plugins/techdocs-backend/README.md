# techdocs-backend

This is the backend part of the techdocs plugin.

## Getting Started

This backend plugin can be started in a standalone mode directly from in this package
using `yarn start`. However, it will have limited functionality and that process is
most convenient when developing the techdocs backend plugin itself.

To evaluate TechDocs and have a greater amount of functionality available, instead do:

```bash
# From your Backstage root directory
cd packages/backend
yarn start
```

## What techdocs-backend does

This provides serving and building of documentation for any entity.
To configure various storage providers and building options, see http://backstage.io/docs/features/techdocs/configuration.

The techdocs-backend re-exports the [techdocs-node](https://github.com/backstage/backstage/tree/master/plugins/techdocs-node) package which has the features to prepare, generate and publish docs.
The Publishers are also used to fetch the static documentation files and render them in TechDocs.

## Actions

The TechDocs backend plugin registers the following action with the Actions Registry Service (alpha):

### `get-techdocs-metadata`

Retrieves metadata for a TechDocs site including site name, description, and navigation structure.

**Input:**

| Parameter   | Type   | Default     | Description                     |
| ----------- | ------ | ----------- | ------------------------------- |
| `kind`      | string | "Component" | The kind of the entity to query |
| `namespace` | string | "default"   | The namespace of the entity     |
| `name`      | string | (required)  | The name of the entity to query |

**Output:**

| Field              | Type   | Description                               |
| ------------------ | ------ | ----------------------------------------- |
| `site_name`        | string | The name of the documentation site        |
| `site_description` | string | The description of the documentation site |
| `nav`              | array  | Navigation structure of the documentation |
| `pages`            | object | Pages in the documentation                |
| `metadata`         | object | Additional metadata                       |

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/techdocs)
- [Backstage homepage](https://backstage.io)
