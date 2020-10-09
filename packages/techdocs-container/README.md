# techdocs-container

This is the Docker container that powers the creation of static documentation sites that are supported by [TechDocs](https://github.com/spotify/backstage/blob/master/plugins/techdocs).

## Getting Started

Using the TechDocs CLI, we can invoke the latest version of `techdocs-container` via Docker Hub:

```bash
npx techdocs-cli serve
```

## Local Development

```bash
docker build . -t mkdocs:local-dev

docker run -w /content -v $(pwd)/mock-docs:/content -p 8000:8000 -it mkdocs:local-dev serve -a 0.0.0.0:8000
```

Then open up `http://localhost:8000` on your local machine.

## Publishing

This container is published on DockerHub - https://hub.docker.com/r/spotify/techdocs

The publishing is configured by [Automated Builds](https://hub.docker.com/repository/docker/spotify/techdocs/builds/edit) feature on Docker Hub which is triggered from GitHub (on new commits and releases). @spotify/techdocs-core team has access to the settings.

The `latest` tag on Docker Hub points to the recent commits in the `master` branch. The [version tags](https://hub.docker.com/r/spotify/techdocs/tags) (e.g. v0.1.1-alpha.24) point to the GitHub tags created from [releases](https://github.com/spotify/backstage/releases) of this GitHub repository.

Note: We recommend using a specific version of the container instead of `latest` release for stability and avoiding unexpected changes.
