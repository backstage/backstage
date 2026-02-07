# @backstage/plugin-mcp-actions-backend

## 0.1.8-next.0

### Patch Changes

- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.7

### Patch Changes

- 4d82a35: build(deps): bump `@modelcontextprotocol/sdk` from 1.24.3 to 1.25.2
- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1

## 0.1.7-next.1

### Patch Changes

- 4d82a35: build(deps): bump `@modelcontextprotocol/sdk` from 1.24.3 to 1.25.2
- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1

## 0.1.6

### Patch Changes

- e83e038: Added `@cfworker/json-schema` as a dependency to this package part of the `@modelcontextprotocol/sdk` bump as it's required in the types
- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 79ef471: Clarify error handling in readme and update handleError.ts to include all backstage/errors
- Updated dependencies
  - @backstage/backend-defaults@0.14.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.1.6-next.1

### Patch Changes

- e83e038: Added `@cfworker/json-schema` as a dependency to this package part of the `@modelcontextprotocol/sdk` bump as it's required in the types
- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.1.6-next.0

### Patch Changes

- 79ef471: Clarify error handling in readme and update handleError.ts to include all backstage/errors
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-client@1.12.1

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.1.5-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-node@1.19.1

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/catalog-client@1.12.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.0

## 0.1.3

### Patch Changes

- 1d47bf3: Proxy `/.well-known/oauth-authorization-server` to `/.well-known/openid-configuration` on `auth-backend` when `auth.experimentalDynamicClientRegistration.enabled` is enabled.
- 7f2a4a0: Updating docs
- d08b0c9: The MCP backend will now convert known Backstage errors into textual responses with `isError: true`.
  The error message can be useful for an LLM to understand and maybe give back to the user.
  Previously all errors where thrown out to `@modelcontextprotocol/sdk` which causes a generic 500.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.1.3-next.1

### Patch Changes

- 1d47bf3: Proxy `/.well-known/oauth-authorization-server` to `/.well-known/openid-configuration` on `auth-backend` when `auth.experimentalDynamicClientRegistration.enabled` is enabled.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1

## 0.1.3-next.0

### Patch Changes

- d08b0c9: The MCP backend will now convert known Backstage errors into textual responses with `isError: true`.
  The error message can be useful for an LLM to understand and maybe give back to the user.
  Previously all errors where thrown out to `@modelcontextprotocol/sdk` which causes a generic 500.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.1

### Patch Changes

- 6bc0799: Fixed the example in the README for generating a static token by adding a subject field
- Updated dependencies
  - @backstage/backend-defaults@0.11.1
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-node@1.17.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 0.1.1-next.0

### Patch Changes

- 6bc0799: Fixed the example in the README for generating a static token by adding a subject field
- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/catalog-client@1.10.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.0

### Minor Changes

- 4ed0fb6: Initial implementation of an `mcp-actions` backend

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
