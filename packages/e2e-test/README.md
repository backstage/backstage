# e2e-test

End-to-end test for verifying Backstage packages.

## Usage

This package is only meant for usage within the Backstage monorepo.

All packages need to be installed and built before running the test. In a fresh clone of this repo you first need to run the following from the repo root:

```sh
yarn install
yarn tsc
yarn build
```

Once those tasks have completed, you can now run the test using `yarn e2e-test run`.

If you make changes to other packages you will need to rerun `yarn tsc && yarn build`. Changes to this package do not require a rebuild.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
