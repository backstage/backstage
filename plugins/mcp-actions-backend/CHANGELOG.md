# @backstage/plugin-mcp-actions-backend

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
