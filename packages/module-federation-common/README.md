# @backstage/module-federation-common

This package provides a helper library for module federation, enabling a consistent management of shared dependencies
in both the module federation host (frontend application) at runtime, and remote modules at build-time through the CLI.

It provides utility functions that can be used for both the CLI and the frontend to:

- merge a list of shared dependencies (typically the default shared dependencies) with additional shared dependencies provided as an optional configuration
- resolve the versions of the merged shared dependencies for the module federation host at build-time, to store them in an additional frontend application entrypoint
- provide the list of resolved shared dependencies for the module federation host at runtime in the frontend application, possibly overridden by the runtime application configuration
- provide the same list of shared dependencies when building remote modules (plugin bundles or dynamic frontend plugins) through the CLI.
