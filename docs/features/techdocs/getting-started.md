# Getting Started

> TechDocs is not feature complete and currently you can't set up a complete
> end-to-end working TechDocs plugin without customizing the plugin itself.

> With TechDocs V.0 you can expect a demonstration of how to integrate docs into
> Backstage. Currently it can create docs using
> [mkdocs](https://www.mkdocs.org/), as well as reading published docs. If you
> publish generated docs and passing in a storageUrl in your `app-config.yaml`
> you can view it in Backstage by going to
> `http://localhost:3000/docs/<remote-folder>`.

Getting started with TechDocs is easy. TechDocs functions as a plugin to
Backstage, why you will need to use Backstage to use TechDocs.

## What is Backstage?

Backstage is an open platform for building developer portals. It’s based on the
developer portal we’ve been using internally at Spotify for over four years.
[Read more](https://github.com/spotify/backstage).

## Prerequisities

In order to use Backstage and TechDocs, you will need to have the following
installed:

- [Node.js](https://nodejs.org) Active LTS (long term support), currently v12
- [Yarn](https://yarnpkg.com/getting-started/install)

## Creating a new Backstage app

> If you have already created a Backstage application for this purpose, jump to
> [Installing TechDocs](#installing-techdocs), otherwise complete this step.

To create a new Backstage application for us to set up TechDocs, you will need
to run the following command:

```bash
npx @backstage/cli create-app
```

You will then be prompted to enter a name for your application. Once you do so,
this will create a new Backstage application for you in a new folder. For
example, if we chose the name `hello-world` for our application, it would create
a new `hello-world` folder containing our new Backstage application.

## Installing TechDocs

Inside of our new Backstage application, TechDocs is not provided by default.
For this reason we will need to manually set up TechDocs. It should take less
than a minute.

### Adding the package

We will need to add our plugin to your Backstage application. To do so, you can
navigate to your new Backstage application folder and then run a single command
to install TechDocs.

```bash
cd hello-world/
```

Then you need to navigate to your `packages/app` folder to install TechDocs:

```bash
cd packages/app
yarn add @backstage/plugin-techdocs
```

After a short while, it should successfully install the TechDocs plugin. Now we
just need to set up some basic configuration!

Enter the following command:

```bash
yarn install
```

Add this to `packages/app/src/plugins.ts`:

```typescript
export { plugin as TechDocs } from '@backstage/plugin-techdocs';
```

### Setting the configuration

TechDocs allows for configuration of the docs storage URL through your
app-config file. The URL provided here is demo docs used to testing.

To use the demo docs, add the following lines to `app-config.yaml`:

```yaml
techdocs:
  storageUrl: https://techdocs-mock-sites.storage.googleapis.com
```

## Run Backstage Locally

Change folder to your Backstage application root.

```bash
yarn start
```

Open browser at [http://localhost:3000/docs/](http://localhost:3000/docs/)

## Extra Reading

[Back to Docs](README.md)
