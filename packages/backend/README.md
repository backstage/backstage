# example-backend

This package is an EXAMPLE of a Backstage backend.

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork
by adding dependencies and routes to this backend, to try things out.

Our goal is to eventually amend the create-app flow of the CLI, such that a
production ready version of a backend skeleton is made alongside the frontend
app. Until then, feel free to experiment here!

## Development

To run the example backend in watch mode, use

```bash
AUTH_GOOGLE_CLIENT_ID=x AUTH_GOOGLE_CLIENT_SECRET=x SENTRY_TOKEN=x yarn start
```

in the backend directory. Substitute `x` for actual values, or leave them as
dummy values just to try out the backend without using the auth or sentry features.

You may have to issue a `yarn build` command in the project root before doing
this for the first time.

The backend starts up on port 7000 per default.

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called locations
to the backend. These are places where the backend can find some entity descriptor
data to consume and serve.

To get started, you can issue the following after starting the backend:

```bash
curl -i \
  -H "Content-Type: application/json"
  -d '{"type":"github","target":"https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/fixtures/two_components.yaml"}' \
  localhost:7000/catalog/locations
```

After a short while, you should start seeing data on `localhost:7000/catalog/entities`.

If you changed the `type` to `file` in the command above, and set the `target`
to the absolute path of a YAML file on disk, you could consume your own experimental data.

The catalog currently runs in-memory only, so feel free to try it out, but it will
need to be re-populated on next startup.

## Documentation

- [Backstage Readme](https://github.com/spotify/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/spotify/backstage/blob/master/docs/README.md)
