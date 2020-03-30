# Deploying Backstage

## Heroku

Deploying to heroku is relatively easy following these steps.

First, make sure you have the [heroku CLI installed](https://devcenter.heroku.com/articles/heroku-cli) and log into it as well as loging into Heroku's [container registry](https://devcenter.heroku.com/articles/container-registry-and-runtime).

```bash
$ heroku login
$ heroku container:login
```

You _might_ also need to set your Heroku app's stack to `container`

```bash
$ heroku stack:set container -a <your-app>
```

We can now build/push the Docker image to Heroku's container registry and release it to the `web` worker.

```bash
$ heroku container:push web -a <your-app>
$ heroku container:release web -a <your-app>
```

With that, you should have Backstage up and running!
