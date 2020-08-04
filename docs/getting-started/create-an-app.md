# Backstage App

To get set up quickly with your own Backstage project you can create a Backstage
App.

A Backstage App is a monorepo setup with `lerna` that includes everything you
need to run Backstage in your own environment.

## Create an app

To create a Backstage app, you will need to have
[NodeJS](https://nodejs.org/en/download/) Active LTS Release installed
(currently v12).

With `npx`:

```bash
npx @backstage/cli create-app
```

This will create a new Backstage App inside the current folder. The name of the
app-folder is the name that was provided when prompted.

<p align='center'>
    <img src='https://github.com/spotify/backstage/raw/master/docs/create-app_output.png' width='600' alt='create app'>
</p>

Inside that directory, it will generate all the files and folder structure
needed for you to run your app.

### Folder structure

```
app
├── README.md
├── lerna.json
├── package.json
├── prettier.config.js
├── tsconfig.json
├── packages
│   └── app
│       ├── package.json
│       ├── tsconfig.json
│       ├── public
│       │   └──  ...
│       └── src
│           ├── App.test.tsx
│           ├── App.tsx
│           ├── index.tsx
│           ├── plugins.ts
│           └── setupTests.ts
└── plugins
    └── welcome
        ├── README.md
        ├── package.json
        ├── tsconfig.json
        └── src
            ├── index.ts
            ├── plugin.test.ts
            ├── plugin.ts
            ├── setupTests.ts
            └── components
                ├── Timer
                │   └──  ...
                └── WelcomePage
                    └──  ...
```

## Run the app

When the installation is complete you can open the app folder and start the app.

```bash
cd my-backstage-app
yarn start
```

_When `yarn start` is ready it should open up a browser window displaying your
app, if not you can navigate to `http://localhost:3000`._
