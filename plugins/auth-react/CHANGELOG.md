# @backstage/plugin-auth-react

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 0.1.1-next.0

### Patch Changes

- c297afd: When using `CookieAuthRefreshProvider` or `useCookieAuthRefresh`, a 404 response from the cookie endpoint will now be treated as if cookie auth is disabled and is not needed.
- Updated dependencies
  - @backstage/core-components@0.14.5-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/errors@1.2.4

## 0.1.0

### Minor Changes

- c884b9a: **BREAKING**: Removed the path option from `CookieAuthRefreshProvider` and `useCookieAuthRefresh`.

  A new `CookieAuthRedirect` component has been added to redirect a public app bundle to the protected one when using the `app-backend` with a separate public entry point.

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/errors@1.2.4

## 0.1.0-next.1

### Minor Changes

- c884b9a: **BREAKING**: Removed the path option from `CookieAuthRefreshProvider` and `useCookieAuthRefresh`.

  A new `CookieAuthRedirect` component has been added to redirect a public app bundle to the protected one when using the `app-backend` with a separate public entry point.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4

## 0.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4

## 0.0.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4

## 0.0.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/errors@1.2.4

## 0.0.1

### Patch Changes

- 62bcaf8: Create a generic React component for refreshing user cookie.
- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/errors@1.2.4
  - @backstage/core-plugin-api@1.9.1
