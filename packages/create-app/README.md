# @backstage/create-app

This package provides a CLI for creating a copy of the Backstage app.

You can use the flag `--skip-install` to skip the install.

## Usage

With `npx`:

```sh
npx @backstage/create-app
```

With a local clone of this repo, from the main `create-app/` folder, run:

```sh
yarn install
yarn backstage-create-app
```

## Testing Changes Locally

If you want to be able to test changes to `create-app` locally you can run the following command:

```sh
./path/to/your/backstage/fork/backstage/packages/create-app/bin/backstage-create-app
```

If your fork lives in `~/repos/forks` then it would be:

```sh
~/repos/forks/backstage/packages/create-app/bin/backstage-create-app
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs/)
