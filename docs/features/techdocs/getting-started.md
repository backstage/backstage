---
id: getting-started
title: Getting Started
---

TechDocs functions as a plugin to Backstage, so you will need to use Backstage
to use TechDocs.

## What is Backstage?

Backstage is an open platform for building developer portals. It’s based on the
developer portal we’ve been using internally at Spotify for over four years.
[Read more here](https://github.com/spotify/backstage).

## Prerequisities

In order to use Backstage and TechDocs, you need to have the following
installed:

- [Node.js](https://nodejs.org) Active LTS (long term support), currently v12
- [Yarn](https://yarnpkg.com/getting-started/install)

## Creating a new Backstage app

> If you have already created a Backstage application, jump to
> [Installing TechDocs](#installing-techdocs), otherwise complete this step.

To create a new Backstage application for TechDocs, run the following command:

```bash
npx @backstage/cli create-app
```

You will then be prompted to enter a name for your application. Once that's
done, a new Backstage application will be created in a new folder. For example,
if you choose the name `hello-world`, a new `hello-world` folder is created
containing your new Backstage application.

## Installing TechDocs

TechDocs is provided with the Backstage application by default. If you want to
set up TechDocs manually, keep follow the instructions below.

### Adding the package

The first step is to add the TechDocs plugin to your Backstage application.
Navigate to your new Backstage application folder:

```bash
cd hello-world/
```

Then navigate to your `packages/app` folder to install TechDocs:

```bash
cd packages/app
yarn add @backstage/plugin-techdocs
```

After a short while, the TechDocs plugin should be successfully installed.

Next, you need to set up some basic configuration. Enter the following command:

```bash
yarn install
```

Add this to `packages/app/src/plugins.ts`:

```typescript
export { plugin as TechDocs } from '@backstage/plugin-techdocs';
```

### Setting the configuration

TechDocs allows for configuration of the docs storage URL through your
`app-config` file.

The default storage URL:

```yaml
techdocs:
  storageUrl: http://localhost:7000/techdocs/static/docs
```

If you want to configure this to point to another storage URL, change the value
of `storageUrl`.

## Run Backstage locally

Change folder to `<backstage-project-root>/packages/backend` and run the
following command:

```bash
yarn start
```

Open a new command line window. Change directory to your Backstage application
root and run the following command:

```bash
yarn start
```

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/).

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
