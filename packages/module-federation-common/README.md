# @backstage/module-federation-common

This package provides a helper library for module federation, enabling a consistent management of shared dependencies
in both the module federation host (frontend application) at runtime, and remote modules at build-time through the CLI.

It provides:

- TypeScript types for both host and remote shared dependency definitions,
- a default list of shared dependencies (React, React Router, Material-UI, Backstage core packages, etc.) for both the host and remote modules,
- utilities used by the CLI to resolve versions of the shared dependencies for the host at build-time,
- utilities available for the frontend application to provide the list of resolved shared dependencies at runtime.
