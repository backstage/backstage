# Publishing Documentation

## Prerequirsities

- [Docker](https://docs.docker.com/get-docker/)
- Static file hosting

## Create documentation

Create a directory that contains your documentation. The directory should have a
file called mkdocs.yml. As an example we will(you can?) create a directory
called `hello-docs` in your home directory. Below is a basic example of how it
could look.

`~/hello-docs/mkdocs.yml`

```yaml
site_name: 'example-docs'

nav:
  - Home: index.md

plugins:
  - techdocs-core
```

`~/hello-docs/docs/index.md`

```yaml
# example docs

This is a basic example of documentation.
```

## Build documentation

```bash
cd ~/hello-docs/
docker pull spotify/techdocs
docker run -it -w /content -v $(pwd):/content spotify/techdocs
```

You should now have a folder called `~/hello-docs/site/`.

## Deploy to a server

## Configure TechDocs to read from server
