---
id: getting-started
title: Getting Started
---

> TechDocs is not yet feature complete - currently you can't set up a complete
> end-to-end working TechDocs plugin without customizing the plugin itself.

> What you can expect from TechDocs V.0 is a demonstration of how to integrate
> docs into Backstage. TechDocs can create docs using
> [mkdocs](https://www.mkdocs.org/), as well as read published docs. If you
> publish generated docs and pass in a `storageUrl` in your `app-config.yaml`,
> you can view them in Backstage by going to
> `http://localhost:3000/docs/<remote-folder>`.

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

TechDocs is not provided with the Backstage application by default, so you will
now need to set up TechDocs manually. It should take less than a minute.

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
`app-config` file. The URL provided here is for demo docs to use for testing
purposes.

To use the demo docs, add the following lines to `app-config.yaml`:

```yaml
techdocs:
  storageUrl: https://techdocs-mock-sites.storage.googleapis.com
```

## Run Backstage locally

Change folder to your Backstage application root and run the following command:

```bash
yarn start
```

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/).

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
