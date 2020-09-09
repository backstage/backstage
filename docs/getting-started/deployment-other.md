---
id: deployment-other
title: Other
---

## Deploying Locally

### Try on Docker

Run the following commands if you have Docker environment

```bash
$ yarn install
$ yarn docker-build
$ docker run --rm -it -p 7000:7000 -e NODE_ENV=development example-backend:latest
```

Then open http://localhost/ on your browser.

### Running with `docker-compose`

There is also a `docker-compose.yaml` that you can use to replace the previous
`docker run` command:

```bash
$ yarn install
$ yarn docker-build
$ docker-compose up
```
