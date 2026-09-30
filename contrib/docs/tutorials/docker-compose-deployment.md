# Deploying Backstage with Docker Compose

This guide describes how to run a Backstage backend image together with a
PostgreSQL database using Docker Compose. This setup is useful for trying a
containerized Backstage deployment locally, running a proof of concept, or
validating that your Docker image and production configuration work together.

For production deployments, you should still review the broader
[deployment overview](https://backstage.io/docs/deployment/),
[Docker image guide](https://backstage.io/docs/deployment/docker), and
[database guide](https://backstage.io/docs/getting-started/config/database).

## Prerequisites

Complete the prerequisites in
[Building a Docker image](https://backstage.io/docs/deployment/docker#prerequisites)
before using this guide. In particular, make sure your app has a production auth
provider configured and that your `app-config.production.yaml` uses PostgreSQL:

```yaml title="app-config.production.yaml"
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

You also need Docker Compose, or a compatible implementation such as
`podman-compose`.

## Create the Compose file

Create a `docker-compose.yaml` file in the root of your Backstage app:

```yaml title="docker-compose.yaml"
services:
  postgres:
    image: postgres:18-trixie
    environment:
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
      POSTGRES_DB: backstage
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U backstage -d backstage']
      interval: 5s
      timeout: 5s
      retries: 10
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data

  backstage:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile
    image: backstage:local
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: '5432'
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage
    ports:
      - '7007:7007'

volumes:
  postgres-data:
```

The `postgres` service creates a local PostgreSQL database with persistent data
stored in the `postgres-data` volume. The `backstage` service builds the image
from `packages/backend/Dockerfile`, waits until PostgreSQL is healthy, and then
connects to it through the internal Compose network using the hostname
`postgres`.

> [!CAUTION]
> The credentials in this example are for local development and proofs of
> concept. Use secret management and stronger credentials for any shared or
> production environment.

## Build and run

The `packages/backend/Dockerfile` expects the backend bundle to exist before the
image is built. Run the same host build steps from the Docker image guide first:

```shell
yarn install --immutable
yarn tsc
yarn build:backend
```

Then start Backstage and PostgreSQL:

```shell
docker compose up --build
```

When the backend has started, open `http://localhost:7007`.

To stop the containers, run:

```shell
docker compose down
```

To stop the containers and remove the PostgreSQL data volume, run:

```shell
docker compose down -v
```

## Optional justfile

You can add a `justfile` to the root of your Backstage app to make the repeated
commands shorter. `just` is a command runner that reads recipes from a file named
`justfile`.

Install `just` using your package manager, by downloading a pre-built binary, or
by running `cargo install just`. For example, on macOS with Homebrew:

```shell
brew install just
```

Then create the `justfile`:

```makefile title="justfile"
compose := env_var_or_default('COMPOSE', 'docker compose')

default: up

prepare:
    yarn install --immutable
    yarn tsc
    yarn build:backend

up: prepare
    {{compose}} up --build

down:
    {{compose}} down

reset:
    {{compose}} down -v
```

Run the local deployment with:

```shell
just up
```

If you use Podman Compose instead of Docker Compose, set the `COMPOSE`
environment variable:

```shell
COMPOSE=podman-compose just up
```

Use `just down` to stop the containers, or `just reset` to stop the containers
and remove the PostgreSQL volume.
