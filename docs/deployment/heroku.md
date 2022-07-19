---
id: heroku
title: Deploying with Heroku
sidebar_label: Heroku
description: How to deploy Backstage to Heroku
---

Heroku is a Platform as a Service (PaaS) designed to handle application
deployment in a hands-off way. Heroku supports container deployment of Docker
images, a natural fit for Backstage.

## Configuring the CLI

First, install the
[heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) and login:

```shell
$ heroku login
```

If you have not yet created a project through the Heroku interface, you can create it through the CLI.

```shell
$ heroku create <your-app>
```

You _might_ also need to set your Heroku app's stack to `container`:

```bash
$ heroku stack:set container -a <your-app>
```

Configuring your `app-config.yaml`:

```yaml
app:
  # Should be the same as backend.baseUrl when using the `app-backend` plugin
  baseUrl: https://<your-app>.herokuapp.com

backend:
  baseUrl: https://<your-app>.herokuapp.com
  listen:
    port:
      $env: PORT
      # The $PORT environment variable is a feature of Heroku
      # https://devcenter.heroku.com/articles/dynos#web-dynos
```

> Make sure your file is being copied into your container in the `Dockerfile`.

Before building the Docker image, run the [backstage host build commands](https://backstage.io/docs/deployment/docker#host-build). They must be run whenever you are going to publish a new image.

Heroku runs a container registry on `registry.heroku.com`. To push Backstage
Docker images, log in to the container registry also:

```shell
$ heroku container:login
```

## Push and deploy a Docker image

Now we can push a Backstage [Docker image](docker.md) to Heroku's container
registry and release it to the `web` worker:

```bash
$ docker image build . -f packages/backend/Dockerfile --tag registry.heroku.com/<your-app>/web

$ docker push registry.heroku.com/<your-app>/web

$ heroku container:release web -a <your-app>
```

Now you should have Backstage up and running! 🎉
