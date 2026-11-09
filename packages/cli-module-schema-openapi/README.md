# @backstage/cli-module-schema-openapi

CLI module that provides OpenAPI schema generation, validation and diffing commands for the Backstage repo tools CLI.

## Commands

| Command                                   | Description                                                                   |
| :---------------------------------------- | :---------------------------------------------------------------------------- |
| `package schema openapi generate`         | Generate a client and/or a server stub from an OpenAPI spec                   |
| `package schema openapi validate`         | Validate that the OpenAPI spec is a valid OpenAPI 3.x document                |
| `package schema openapi fuzz`             | Fuzz an OpenAPI schema by generating random data and sending it to the server |
| `package schema openapi diff`             | Diff the OpenAPI spec of a package against a specific ref                     |
| `repo schema openapi validate [paths...]` | Validate that all OpenAPI schemas are valid and set up correctly              |
| `repo schema openapi lint [paths...]`     | Lint OpenAPI schemas                                                          |
| `repo schema openapi fuzz`                | Fuzz all packages                                                             |
| `repo schema openapi diff`                | Diff all OpenAPI specs in the repository against a specific ref               |

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
