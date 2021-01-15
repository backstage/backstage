# @backstage/plugin-org

## 0.3.3

### Patch Changes

- f573cf368: Fixed - normalizing strings for comparison when ignoring when one is in low case.
- Updated dependencies [f3b064e1c]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.3.2

### Patch Changes

- c0fac6163: Wrap entity cards on smaller screens
- ab805860a: Ensure a name is always displayed for user entities in the org plugin. This can happen when there is no profile
  displayName provided (e.g. a GitHub user that has not added a name to their profile)
- 8ef71ed32: Add a `<Avatar>` component to `@backstage/core`.
- c5297baeb: Display the new `profile` fields (`displayName`, `email`, and `picture`) for
  groups on the `GroupProfileCard`.

  This also resolves some cases where `profile` fields are missing for users or
  groups and for example falls back to displaying the entity name. Adds additional test data to the ACME Corp dataset.

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.3.1

### Patch Changes

- 2b71db211: Support transitive ownerships of users and groups.
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2
