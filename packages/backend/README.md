# example-backend

This package is an EXAMPLE of a Backstage backend using the [new backend system](https://backstage.io/docs/backend-system/).

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork
by adding dependencies and routes to this backend, to try things out.

By running the `@backstage/create-app` script, you get your own separate Backstage backend.

## Development

To run the example backend, first go to the project root and run

```bash
yarn install
```

This will install all dependencies for the project. You only need to do this once, unless you make changes to the dependency definitions.

You can then start the backend by running the following command in the repo root:

```bash
yarn start-backend
```

If you want to override any configuration locally, for example adding any secrets,
you can do so in `app-config.local.yaml`, next to `app-config.yaml`.

The backend starts up on port 7007 per default.

### Debugging

The backend is a node process that can be inspected to allow breakpoints and live debugging. To enable this, pass the `--inspect` flag when starting the backend.

To debug the backend in [Visual Studio Code](https://code.visualstudio.com/):

- Enable Auto Attach (⌘ + Shift + P > Toggle Auto Attach > Only With Flag)
- Open a VSCode terminal (Control + `)
- Run the backend from the VSCode terminal: `yarn start-backend --inspect`

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called
locations to the backend. These are places where the backend can find some
entity descriptor data to consume and serve. For more information, see
[Software Catalog Overview - Adding Components to the Catalog](https://backstage.io/docs/features/software-catalog/#adding-components-to-the-catalog).

For convenience we already include some statically configured example locations
in `app-config.yaml` under `catalog.locations`. For local development you can override these in your own `app-config.local.yaml`.

## Authentication

The example backend has guest access enabled by default. This means you do not need to configure a real authentication provider, but will instead be logged in as a guest user.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
