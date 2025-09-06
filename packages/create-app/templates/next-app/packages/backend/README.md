# example-backend

This package is an EXAMPLE of a Backstage backend.

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork by
adding dependencies and routes to this backend, to try things out.

Our goal is to eventually amend the create-app flow of the CLI, such that a
production ready version of a backend skeleton is made alongside the frontend
app. Until then, feel free to experiment here!

## Development

To run the example backend, first go to the project root and run

```bash
yarn install
```

You should only need to do this once.

After that, go to the `packages/backend` directory and run

```bash
yarn start
```

If you want to override any configuration locally, for example adding any secrets,
you can do so in `app-config.local.yaml`.

The backend starts up on port 7007 per default.

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called
locations to the backend. These are places where the backend can find some
entity descriptor data to consume and serve. For more information, see
[Software Catalog Overview - Adding Components to the Catalog](https://backstage.io/docs/features/software-catalog/#adding-components-to-the-catalog).

To get started quickly, this template already includes some statically configured example locations
in `app-config.yaml` under `catalog.locations`. You can remove and replace these locations as you
like, and also override them for local development in `app-config.local.yaml`.

## Authentication

We chose [Passport](http://www.passportjs.org/) as authentication platform due
to its comprehensive set of supported authentication
[strategies](http://www.passportjs.org/packages/).

Read more about the
[auth-backend](https://github.com/backstage/backstage/blob/master/plugins/auth-backend/README.md)
and
[how to add a new provider](https://github.com/backstage/backstage/blob/master/docs/auth/add-auth-provider.md)

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
