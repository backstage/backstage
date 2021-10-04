# @backstage/test-utils-core

This package provides utilities for testing the Backstage core packages.

## Installation

This package should not be used directly, use `@backstage/test-utils` instead. All exports from this
package are re-exported by `@backstage/test-utils`.

The reason this package exists is to allow the Backstage core packages to use the testing utils exposed in this package. Since `@backstage/test-utils` needs to depend on `@backstage/core`, core is not able to use those test-utils. We put any test-utils that don't need to depend on other Backstage packages in this package, in order for them to be usable by any other `@backstage` packages.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
