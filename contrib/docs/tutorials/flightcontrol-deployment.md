# Deploying Backstage to AWS with Flightcontrol

This guide explains how to deploy Backstage to [Flightcontrol](https://www.flightcontrol.dev?ref=backstage), a platform that fully automates deployments to Amazon Web Services (AWS). Flightcontrol supports git-driven and image registry deployments.

Before you begin, make sure you have a [Flightcontrol account](https://app.flightcontrol.dev/signup?ref=backstage) and a [GitHub account](https://github.com/login) to follow this guide.

# Creating a Dockerfile and .dockerignore

Once your Flightcontrol account is setup, you will need to prepare a `Dockerfile` and `.dockerignore` to deploy Backstage to your target AWS environment. The standard `Dockerfile` included in the Backstage repository assumes that the `skeleton.tar.gz` and `bundle.tar.gz` already exist. When integrating Flightcontrol directly with a GitHub repository, changes to files within this repository will automatically start a Flightcontrol deployment, unless you have configured deployments via a webhook. Regardless of which method you have chosen, when Flightcontrol starts a deployment process it will pull all files directly from the repository, and not from a GitHub runner or other location. As Flightcontrol does not contain CI steps this results in the zip files having to be committed to the repository in order to be available for the `Dockerfile` to copy.

A simple work around for this is to use a `Dockerfile` with a [multi-stage build](https://docs.docker.com/build/building/multi-stage/). Using this approach we can create our zip files in the first build stage, and copy them into the second stage ready for deployment.

The following two code snippets demonstrate this method. The first block of code is an example of a multi-stage build approach and should be added to a file called `Dockerfile.flightcontrol` in the `packages/backend` directory.

```dockerfile filename="Dockerfile.flightcontrol"
# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using `yarn build-image`
FROM node:20-bookworm-slim as build

USER node
WORKDIR /app
COPY --chown=node:node . .

RUN yarn install --frozen-lockfile

# tsc outputs type definitions to dist-types/ in the repo root, which are then consumed by the build
RUN yarn tsc

# Build the backend, which bundles it all up into the packages/backend/dist folder.
# The configuration files here should match the one you use inside the Dockerfile below.
RUN yarn build:backend --config ../../app-config.yaml

FROM node:20-bookworm-slim

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential && \
    yarn config set python /usr/bin/python3

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev

# From here on we use the least-privileged `node` user to run the backend.
USER node

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV=production

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --from=build app/yarn.lock app/package.json app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --frozen-lockfile --production --network-timeout 300000

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --from=build app/packages/backend/dist/bundle.tar.gz app/app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
```

In order to prevent the default `.dockerignore` file from preventing the copying of the relevant files into the first stage of our build, we need to override it with a custom one. This can also be added to the `packages/backend` directory, it should be called `Dockerfile.flightcontrol.dockerignore` and contain the following.

```ssh filename="Dockerfile.flightcontrol.dockerignore"
.git
.yarn/cache
.yarn/install-state.gz
node_modules
packages/*/node_modules
*.local.yaml
```

With these two new files, you will now have the necessary steps in place to build the zip files, copy them into the second stage of the build, and deploy them via Flightcontrol.

# Creating a custom app-config.production file

Our next steps before switching to the Flightcontrol dashboard is to create a custom app-config.production file. The purposes of this is to update how Backstage will connect to the RDS hosted Postgres DB. The default `app-config.production` file uses the `host`, `port`, `user` and `password` environment variables.

When creating a database via the Flightcontrol dashboard, we are given an environment variable with the single connection string. Therefore we need an `app-config.production` file which uses this variable.

Within your Backstage project create a new file called `app-config.production.flightcontrol.yaml`. Add the following configuration to it:

```yaml filename="app-config.production.flightcontrol.yaml"
app:
  # Should be the same as backend.baseUrl when using the `app-backend` plugin.
  baseUrl: http://localhost:7007

backend:
  # Note that the baseUrl should be the URL that the browser and other clients
  # should use when communicating with the backend, i.e. it needs to be
  # reachable not just from within the backend host, but from all of your
  # callers. When its value is "http://localhost:7007", it's strictly private
  # and can't be reached by others.
  baseUrl: http://localhost:7007
  # The listener can also be expressed as a single <host>:<port> string. In this case we bind to
  # all interfaces, the most permissive setting. The right value depends on your specific deployment.
  listen: ':7007'

  # config options: https://node-postgres.com/apis/client
  database:
    client: pg
    pluginDivisionMode: 'schema'
    connection:
      connectionString: ${POSTGRES_CON_STRING}
      ssl:
        require: true
        rejectUnauthorized: false

      # Flightcontrol provides a single DB connection string
      # environment variable which can be renamed to POSTGRES_CON_STRING.
      # the following default values are therefore not used:
      # host: ${POSTGRES_HOST}
      # port: ${POSTGRES_PORT}
      # user: ${POSTGRES_USER}
      # password: ${POSTGRES_PASSWORD}
      # https://node-postgres.com/features/ssl
      # you can set the sslmode configuration option via the `PGSSLMODE` environment variable
      # see https://www.postgresql.org/docs/current/libpq-ssl.html Table 33.1. SSL Mode Descriptions (e.g. require)
      # ssl:
      #   ca: # if you have a CA file and want to verify it you can uncomment this section
      #     $file: <file-path>/ca/server.crt

catalog:
  # Overrides the default list locations from app-config.yaml as these contain example data.
  # See https://backstage.io/docs/features/software-catalog/#adding-components-to-the-catalog for more details
  # on how to get entities into the catalog.
  locations: []
```

Make a note of the environment variable used in the `connectionString`. In our example above this is `POSTGRES_CON_STRING`. You will need this later when you have deployed the database via the Flightcontrol console, and wish to connect to it from Backstage.

# Deployment Via Dashboard

Ensure that custom `Dockerfile.flightcontrol`, `Dockerfile.flightcontrol.dockerignore` and `app-config.production.flightcontrol.yaml` have been committed to your repository before following the next steps.

Login into the Flightcontrol Dashboard and complete each of the following:

1. Create a new project from the Flightcontrol Dashboard

2. Select the GitHub repo for your Backstage project

3. Select `GUI` as the config type:

4. Then, choose `+ Add Web Server (Fargate)` under Services before entering the following server information:

| Field Name        | Value             |
| ----------------- | ----------------- |
| Build Type        | Custom Dockerfile |
| Health Check Path | /catalog          |
| Port              | 7007              |

5. Click `Create Project` and complete any required steps (like linking your AWS account). Remember to point the project to your custom files.

# Deployment via Code

1. Create a new project from the Flightcontrol Dashboard

2. Select the GitHub repo for your Backstage project

3. Select the `flightcontrol.json` Config Type. Update the example JSON below where applicable to your custom Dockerfile.

```json filename="flightcontrol.json"
{
  "$schema": "https://app.flightcontrol.dev/schema.json",
  "environments": [
    {
      "id": "backstage",
      "name": "Backstage",
      "region": "us-west-2",
      "source": {
        "branch": "main"
      },
      "services": [
        {
          "id": "backstage",
          "name": "Backstage",
          "type": "fargate",
          "buildType": "docker",
          "dockerfilePath": "Dockerfile",
          "dockerContext": ".",
          "healthCheckPath": "/catalog",
          "cpu": 0.5,
          "memory": 1,
          "domain": "backstage.yourapp.com",
          "port": 7007,
          "minInstances": 1,
          "maxInstances": 1
        }
      ]
    }
  ]
}
```

# Databases and Redis

If you need a database or Redis for your Backstage plugins, you can easily add those to your Flightcontrol deployment. For more information, see [the flightcontrol docs](https://www.flightcontrol.dev/docs/guides/flightcontrol/using-code?ref=backstage#redis).

When creating a Postgres RDS database you will need to update the connection string variable name to the one included in the `app-config.production.flightcontrol.yaml`. As noted above in our example we called this `POSTGRES_CON_STRING`.

## Troubleshooting

- [Flightcontrol Documentation](https://www.flightcontrol.dev/docs?ref=backstage)
- [Troubleshooting](https://www.flightcontrol.dev/docs/troubleshooting?ref=backstage)
