# Deployment (Other)

## Deploying Locally

### Try on Docker

Run the following commands if you have Docker environment

```bash
$ yarn docker-build
$ docker run --rm -it -p 80:80 spotify/backstage
```

Then open http://localhost/ on your browser.

### Running with `docker-compose`

Run the following commands if you have docker and docker-compose for a full
example, with the example backend also deployed.

```bash
$ yarn docker-build:all
$ docker-compose up
```

Then open http://localhost/ on your browser to see the example app with an
example backend.
