# Deploying Backstage to Heroku

Heroku is a Platform as a Service (PaaS) designed to simplify application deployment.

## Create App

Starting with an existing Backstage app or follow the [getting started guide](https://backstage.io/docs/getting-started/) to create a new one.

Install the
[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and create a new Heroku app:

```shell
cd your-app/
heroku apps:create <your-app>
```

## Domain

Get Heroku app URL:

```shell
heroku domains -a <your-app>
<your-app-123>.herokuapp.com
```

The core [app-backend plugin](https://www.npmjs.com/package/@backstage/plugin-app-backend) allows a single Heroku app to serve the frontend and backend. To make this work you need to update the `baseUrl` and `port` in `app-config.production.yaml`:

```yaml
app:
  baseUrl: https://<your-app-123>.herokuapp.com

backend:
  baseUrl: https://<your-app-123>.herokuapp.com
  listen:
    port:
      $env: PORT
      # The $PORT environment variable is a feature of Heroku
      # https://devcenter.heroku.com/articles/dynos#web-dynos
```

## Build Script

Add a build script in `package.json` to compile frontend during deployment:

```json
"scripts": {
  "build": "yarn build:backend --config ../../app-config.yaml --config ../../app-config.production.yaml"
```

## Start Command

Create a [Procfile](https://devcenter.heroku.com/articles/procfile) in the app's root:

```shell
echo "web: yarn workspace backend start --config ../../app-config.yaml --config ../../app-config.production.yaml" > Procfile
```

## Database

Provision a [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) database:

```shell
heroku addons:create heroku-postgresql -a <your-app>
```

Update `database` in `app-config.production.yaml`:

```yaml
backend:
  database:
    client: pg
    pluginDivisionMode: schema
    ensureExists: false
    ensureSchemaExists: true
    connection: ${DATABASE_URL}
```

Allow postgres self-signed certificates:

```shell
heroku config:set PGSSLMODE=no-verify -a <your-app>
```

## Deployment

Commit changes and push to Heroku to build and deploy:

```shell
git add Procfile && git commit -am "configure heroku"
git push heroku main
```

View the app in the browser:

```shell
heroku open -a <your-app>
```

View logs:

```shell
heroku logs -a <your-app>
```

## Docker

As an alternative to git deploys, Heroku also [supports container images](https://devcenter.heroku.com/articles/container-registry-and-runtime).

Login to Heroku's container registry:

```shell
heroku container:login
```

Configure the Heroku app to run a container image:

```shell
heroku stack:set container -a <your-app>
```

Locally run the [host build commands](https://backstage.io/docs/deployment/docker/#host-build), they must be run whenever you are going to publish a new image:

```shell
yarn install --immutable
yarn tsc
yarn build:backend --config ../../app-config.yaml --config ../../app-config.production.yaml
```

Build, push, and release the container image to the `web` dyno:

```shell
docker image build . -f packages/backend/Dockerfile --tag registry.heroku.com/<your-app>/web
docker push registry.heroku.com/<your-app>/web
heroku container:release web -a <your-app>
```
