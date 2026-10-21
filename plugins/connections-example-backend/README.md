# connections-example-backend

This example shows how a backend plugin declares and consumes connections using
the experimental connections service.

**Use dummy credentials only.** The example returns the full connection, including
its credentials, without requiring authentication. Run it locally, not in
production.

## Run the example

Run `yarn install` from the repository root. Then enter the example package and
run `yarn start`:

```sh
cd plugins/connections-example-backend
yarn start
```

This loads [`app-config.example.yaml`](./app-config.example.yaml), which contains
a dummy GitLab token. Keep any credentials you add to this example fake.

In another terminal, look up the dummy connection:

```sh
curl 'http://localhost:7007/api/connections-example-backend/find?type=gitlab&url=https%3A%2F%2Fgitlab.example.com&auth=token'
```

The response includes the host and dummy token in `auth.token`. No request is
made to GitLab.
