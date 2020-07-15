# TechDocs CLI

Check out the [TechDocs README](https://github.com/spotify/backstage/blob/master/plugins/techdocs/README.md) to learn more.

**WIP: This cli is a work in progress. It is not ready for use yet. Follow our progress on [the Backstage Discord](https://discord.gg/MUpMjP2) under #docs-like-code or on [our GitHub Milestone](https://github.com/spotify/backstage/milestone/15).**

## Commands

```bash
# Serve localhost:3000 (and localhost:8000)
yarn serve

# Serve localhost:8000 containing your Mkdocs documentation.
yarn serve:mkdocs
```

## Getting Started

You'll need Docker installed and running to use this. You will also need to build the container located at `/packages/techdocs-container` under the tag `mkdocs:local-dev`, as you can see in the commands from below:

```bash
docker build packages/techdocs-container -t mkdocs:local-dev
```

From that point, you can invoke the CLI from any project with a docs folder. Try out our example!

```bash
cd packages/techdocs-container/mock-docs
npx @techdocs/cli serve
```

## Local Development

You'll need Docker installed and running to use this. You will also need to build the container located at `packages/techdocs-container` under the tag `mkdocs:local-dev` (for now until we deploy the container to a centralized Docker registry), as you can see in the commands from below:

```bash
docker build packages/techdocs-container -t mkdocs:local-dev
```

```bash
cd packages/techdocs-container/mock-docs
npx techdocs serve
```

You should have a `localhost:3000` serving TechDocs in Backstage, as well as `localhost:8000` serving Mkdocs (which won't open up and be exposed to the user).

Happy hacking!
