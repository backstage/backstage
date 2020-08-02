# example-backend

This package is an EXAMPLE of a Backstage backend.

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork
by adding dependencies and routes to this backend, to try things out.

Our goal is to eventually amend the create-app flow of the CLI, such that a
production ready version of a backend skeleton is made alongside the frontend
app. Until then, feel free to experiment here!

## Development

To run the example backend, first go to the project root and run

```bash
yarn install
yarn tsc
yarn build
```

You should only need to do this once.

After that, go to the `packages/backend` directory and run

```bash
AUTH_GOOGLE_CLIENT_ID=x AUTH_GOOGLE_CLIENT_SECRET=x \
AUTH_GITHUB_CLIENT_ID=x AUTH_GITHUB_CLIENT_SECRET=x \
AUTH_OAUTH2_CLIENT_ID=x AUTH_OAUTH2_CLIENT_SECRET=x \
AUTH_OAUTH2_AUTH_URL=x AUTH_OAUTH2_TOKEN_URL=x \
LOG_LEVEL=debug \
yarn start
```

Substitute `x` for actual values, or leave them as
dummy values just to try out the backend without using the auth or sentry features.

The backend starts up on port 7000 per default.

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called locations
to the backend. These are places where the backend can find some entity descriptor
data to consume and serve.

To get started, you can issue the following after starting the backend, from inside
the `plugins/catalog-backend` directory:

```bash
yarn mock-data
```

You should then start seeing data on `localhost:7000/catalog/entities`.

The catalog currently runs in-memory only, so feel free to try it out, but it will
need to be re-populated on next startup.

## Authentication

We chose [Passport](http://www.passportjs.org/) as authentication platform due to its comprehensive set of supported authentication [strategies](http://www.passportjs.org/packages/).

Read more about the [auth-backend](https://github.com/spotify/backstage/blob/master/plugins/auth-backend/README.md) and [how to add a new provider](https://github.com/spotify/backstage/blob/master/docs/auth/add-auth-provider.md)

## Documentation

- [Backstage Readme](https://github.com/spotify/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/spotify/backstage/blob/master/docs/README.md)
