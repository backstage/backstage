# @backstage/codemods

A collection of codemods for use with Backstage projects.

## Usage

This package is a wrapper around [`jscodeshift`](https://github.com/facebook/jscodeshift) with some included transforms. The transforms can either be executed via the included CLI or directly via `jscodeshift`.

To run the `core-imports` codemod towards all source files in a package, run the following:

```sh
npx @backstage/codemods core-imports .
```

Note that this will modify the source files directly, but it's possible to do a dry-run by adding the `--dry` flag.

The transforms are located within the `transforms/` directory in this package, so running directly with `jscodeshift` looks like this:

```sh
npx jscodeshift --parser=tsx --extensions=tsx,js,ts,tsx --transform=node_modules/@backstage/codemods/transforms/core-imports.js .
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
