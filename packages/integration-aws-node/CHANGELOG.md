# @backstage/integration-aws-node

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/config@1.3.1-next.0

## 0.1.13

### Patch Changes

- 52ae92d: The `getDefaultCredentialsChain` function now accepts and applies a `region` parameter, preventing it from defaulting to `us-east-1` when no region is specified.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5

## 0.1.13-next.0

### Patch Changes

- 52ae92d: The `getDefaultCredentialsChain` function now accepts and applies a `region` parameter, preventing it from defaulting to `us-east-1` when no region is specified.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.12

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- 823cf8e: Updated dependency `aws-sdk-client-mock-jest` to `^4.0.0`.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.11

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- 823cf8e: Updated dependency `aws-sdk-client-mock-jest` to `^4.0.0`.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/config@1.1.2-next.0

## 0.1.9

### Patch Changes

- 6d898f7: All single-line secrets read from config will now have both leading and trailing whitespace trimmed. This is done to ensure that the secrets are always valid HTTP header values, since many fetch implementations will include the header value itself when an error is thrown due to invalid header values.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.9-next.0

### Patch Changes

- 6d898f7: All single-line secrets read from config will now have both leading and trailing whitespace trimmed. This is done to ensure that the secrets are always valid HTTP header values, since many fetch implementations will include the header value itself when an error is thrown due to invalid header values.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.8

### Patch Changes

- 20d97d28a3: Updated dependency `aws-sdk-client-mock-jest` to `^3.0.0`.
- 3d043526f4: Updated dependency `aws-sdk-client-mock` to `^3.0.0`.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3-next.0
  - @backstage/config@1.1.1-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/errors@1.2.1

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/config@1.0.8

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/config@1.0.8

## 0.1.4

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8

## 0.1.4-next.1

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/config@1.0.7

## 0.1.3

### Patch Changes

- 3659c71c5d9: Standardize `@aws-sdk` v3 versions
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5
  - @backstage/config@1.0.7

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/config@1.0.7-next.0

## 0.1.1

### Patch Changes

- 89062b8ba0: Skip STS API calls where not needed, to support Minio use cases
- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## 0.1.0

### Minor Changes

- 13278732f6: New package for AWS integration node library

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.4
  - @backstage/config@1.0.5

## 0.1.0-next.0

### Minor Changes

- 13278732f6: New package for AWS integration node library

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
