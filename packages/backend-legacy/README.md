# example-backend-legacy

This package is an EXAMPLE of a Backstage backend using the old backend system.

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork
by adding dependencies and routes to this backend, to try things out.

By running the `@backstage/create-app` script, you get your own separate Backstage backend.

## Development

To run the example backend, first go to the project root and run

```bash
yarn install
```

You should only need to do this once.

After that, go to the `packages/backend-legacy` directory and run

```bash
yarn start
```

If you want to override any configuration locally, for example adding any secrets,
you can do so in `app-config.local.yaml`.

The backend starts up on port 7007 per default.

### Debugging

The backend is a node process that can be inspected to allow breakpoints and live debugging. To enable this, pass the `--inspect` flag to [backend:dev](https://backstage.io/docs/tooling/cli/build-system#backend-development).

To debug the backend in [Visual Studio Code](https://code.visualstudio.com/):

- Enable Auto Attach (⌘ + Shift + P > Toggle Auto Attach > Only With Flag)
- Open a VSCode terminal (Control + `)
- Run the backend from the VSCode terminal: `yarn start-backend:legacy --inspect`

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called
locations to the backend. These are places where the backend can find some
entity descriptor data to consume and serve. For more information, see
[Software Catalog Overview - Adding Components to the Catalog](https://backstage.io/docs/features/software-catalog/#adding-components-to-the-catalog).

For convenience we already include some statically configured example locations
in `app-config.yaml` under `catalog.locations`. For local development you can override these in your own `app-config.local.yaml`.

## Authentication

We chose [Passport](http://www.passportjs.org/) as authentication platform due to its comprehensive set of supported authentication [strategies](http://www.passportjs.org/packages/).

Read more about the [auth-backend](https://github.com/backstage/backstage/blob/master/plugins/auth-backend/README.md) and [how to add a new provider](https://github.com/backstage/backstage/blob/master/docs/auth/add-auth-provider.md)

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
