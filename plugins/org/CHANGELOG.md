# @backstage/plugin-org

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0

## 0.5.6

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 306d0b4fdd: Added the ability to use an additional `filter` when fetching groups in `MyGroupsSidebarItem` component. Example:

  ```diff
  // app/src/components/Root/Root.tsx
  <SidebarPage>
      <Sidebar>
        //...
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          //...
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
  +         filter={{ 'spec.type': 'team' }}
          />
         //...
        </SidebarGroup>
      </ Sidebar>
  </SidebarPage>
  ```

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.5.6-next.2

### Patch Changes

- 306d0b4fdd: Added the ability to use an additional `filter` when fetching groups in `MyGroupsSidebarItem` component. Example:

  ```diff
  // app/src/components/Root/Root.tsx
  <SidebarPage>
      <Sidebar>
        //...
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          //...
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
  +         filter={{ 'spec.type': 'team' }}
          />
         //...
        </SidebarGroup>
      </ Sidebar>
  </SidebarPage>
  ```

- Updated dependencies
  - @backstage/core-components@0.9.5-next.2

## 0.5.6-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0

## 0.5.5

### Patch Changes

- dfee1002d7: Fixed overflow bug of name and email on EntitiyMembersListCard component which can occur on specific 'screen width' + ’character length' combinations
- cb0db62344: Fix linking ownership card to catalog owner filter when namespaces are used
- 8da4a207dd: Fix ref to filtered catalog table view when using aggregated relations.
- 2025d7c123: Include namespace in `MyGroupSidebarItem` if not default and remove root item routing if there are multiple groups
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/catalog-model@1.0.2

## 0.5.5-next.3

### Patch Changes

- 2025d7c123: Include namespace in `MyGroupSidebarItem` if not default and remove root item routing if there are multiple groups
- Updated dependencies
  - @backstage/core-components@0.9.4-next.2

## 0.5.5-next.2

### Patch Changes

- dfee1002d7: Fixed overflow bug of name and email on EntitiyMembersListCard component which can occur on specific 'screen width' + ’character length' combinations
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.5.5-next.1

### Patch Changes

- cb0db62344: Fix linking ownership card to catalog owner filter when namespaces are used
- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1

## 0.5.5-next.0

### Patch Changes

- 8da4a207dd: Fix ref to filtered catalog table view when using aggregated relations.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0

## 0.5.4

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- cb592bfce7: Provides the ability to hide the relations toggle on the `OwnershipCard` as well as setting a default relation type.

  To hide the toggle simply include the `hideRelationsToggle` prop like this:

  ```tsx
  <EntityOwnershipCard
    variant="gridItem"
    entityFilterKind={customEntityFilterKind}
    hideRelationsToggle
  />
  ```

  To set the default relation type, add the `relationsType` prop with a value of direct or aggregated, the default if not provided is direct. Here is an example:

  ```tsx
  <EntityOwnershipCard
    variant="gridItem"
    entityFilterKind={customEntityFilterKind}
    relationsType="aggregated"
  />
  ```

- d014fe2cb4: Introduced a new MyGroupsSidebarItem SidebarItem that links to one or more groups based on the logged in user's membership.

  To use MyGroupsSidebarItem you'll need to add it to your `Root.tsx` like this:

  ```diff
  // app/src/components/Root/Root.tsx
  + import { MyGroupsSidebarItem } from '@backstage/plugin-org';
  + import GroupIcon from '@material-ui/icons/People';

  <SidebarPage>
      <Sidebar>
        //...
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          //...
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
  +       <MyGroupsSidebarItem
  +         singularTitle="My Squad"
  +         pluralTitle="My Squads"
  +         icon={GroupIcon}
  +       />
         //...
        </SidebarGroup>
      </ Sidebar>
  </SidebarPage>
  ```

- 111995470d: add aggregated ownership type for kind group in OwnershipCard
- 230ad0826f: Bump to using `@types/node` v16
- 0bada4fc4d: Added the `metadata.description` to the bottom of each member on the MembersListCard
- 99063c39ae: Minor API report cleanup
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1

## 0.5.4-next.3

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 0.5.4-next.2

### Patch Changes

- cb592bfce7: Provides the ability to hide the relations toggle on the `OwnershipCard` as well as setting a default relation type.

  To hide the toggle simply include the `hideRelationsToggle` prop like this:

  ```tsx
  <EntityOwnershipCard
    variant="gridItem"
    entityFilterKind={customEntityFilterKind}
    hideRelationsToggle
  />
  ```

  To set the default relation type, add the `relationsType` prop with a value of direct or aggregated, the default if not provided is direct. Here is an example:

  ```tsx
  <EntityOwnershipCard
    variant="gridItem"
    entityFilterKind={customEntityFilterKind}
    relationsType="aggregated"
  />
  ```

- d014fe2cb4: Introduced a new MyGroupsSidebarItem SidebarItem that links to one or more groups based on the logged in user's membership.

  To use MyGroupsSidebarItem you'll need to add it to your `Root.tsx` like this:

  ```diff
  // app/src/components/Root/Root.tsx
  + import { MyGroupsSidebarItem } from '@backstage/plugin-org';
  + import GroupIcon from '@material-ui/icons/People';

  <SidebarPage>
      <Sidebar>
        //...
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          //...
          <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
  +       <MyGroupsSidebarItem
  +         singularTitle="My Squad"
  +         pluralTitle="My Squads"
  +         icon={GroupIcon}
  +       />
         //...
        </SidebarGroup>
      </ Sidebar>
  </SidebarPage>
  ```

- 0bada4fc4d: Added the `metadata.description` to the bottom of each member on the MembersListCard
- 99063c39ae: Minor API report cleanup
- Updated dependencies
  - @backstage/core-components@0.9.3-next.1
  - @backstage/plugin-catalog-react@1.0.1-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 0.5.4-next.1

### Patch Changes

- 111995470d: add aggregated ownership type for kind group in OwnershipCard
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1-next.1

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0

## 0.5.3

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- 132189e466: Updated the code to handle User kind `spec.memberOf` now being optional.
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0

## 0.5.2

### Patch Changes

- 2986f8e09d: Fixed EntityOwnerPicker and OwnershipCard url filter issue with more than 21 owners
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0

## 0.5.2-next.0

### Patch Changes

- 2986f8e09d: Fixed EntityOwnerPicker and OwnershipCard url filter issue with more than 21 owners
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.5.1

### Patch Changes

- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- 8f0e8e039b: Removed usage of deprecated `getEntityMetadataViewUrl` and `getEntityMetadataEditUrl` helpers.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0

## 0.5.0

### Minor Changes

- 2262fe19c9: **BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.

### Patch Changes

- cd8c6970ed: Add entity sync button to Group page
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0

## 0.4.3

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/theme@0.2.15

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0

## 0.4.1

### Patch Changes

- ef86143c16: Added `relations.memberof` filter to the catalog api call in `MemberListCard` to avoid fetching all the User entity kinds from catalog-backend.
- 64cbca7839: The description from `metadata.description` will now show as the `subheader` on the UserProfileCard in the same way as the GroupProfileCard
- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13

## 0.4.1-next.0

### Patch Changes

- ef86143c16: Added `relations.memberof` filter to the catalog api call in `MemberListCard` to avoid fetching all the User entity kinds from catalog-backend.
- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.4.0

### Minor Changes

- 1285c2fe60: **BREAKING**: Added a new and required `catalogIndex` external route. It should typically be linked to the `catalogIndex` route of the Catalog plugin:

  ```ts
  bind(orgPlugin.externalRoutes, {
    catalogIndex: catalogPlugin.routes.catalogIndex,
  });
  ```

### Patch Changes

- f006fe2529: For the component `EntityMembersListCard` you can now specify the pageSize. For example:

  ```tsx
  <Grid item xs={12}>
    <EntityMembersListCard pageSize={100} />
  </Grid>
  ```

  If left empty it will by default use 50.

- 2908a41b9b: Fixed typo in `MembersListCard` component
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/catalog-model@0.9.10

## 0.3.35-next.0

### Patch Changes

- f006fe2529: For the component `EntityMembersListCard` you can now specify the pageSize. For example:

  ```tsx
  <Grid item xs={12}>
    <EntityMembersListCard pageSize={100} />
  </Grid>
  ```

  If left empty it will by default use 50.

- 2908a41b9b: Fixed typo in `MembersListCard` component
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.3.34

### Patch Changes

- 3f08dcd696: For the component `EntityMembersListCard` you can now specify the type of members you have in a group. For example:

  ```tsx
  <Grid item xs={12}>
    <EntityMembersListCard memberDisplayTitle="Ninja's" />
  </Grid>
  ```

  If left empty it will by default use 'Members'.

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/catalog-model@0.9.9

## 0.3.33

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.3.32

### Patch Changes

- 6f263c2cbc: Fixed bug in OwnershipCard component where text wasn't correctly pluralized
- 7a4bd2ceac: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2

## 0.3.31

### Patch Changes

- fe86adbcd2: Added `entityFilterKind` property for `EntityOwnershipCard`
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/catalog-model@0.9.8
  - @backstage/plugin-catalog-react@0.6.7

## 0.3.30

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.3.29

### Patch Changes

- 2f4a686411: Use email links in the catalog's members list instead of text to display a member's email
- Updated dependencies
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.3.28

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.3.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.3.26

### Patch Changes

- 614da39174: Change the OwnershipCard link on an user profile, including the user's groups on the filters.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4

## 0.3.25

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.3.24

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3

## 0.3.23

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.3.22

### Patch Changes

- 6ad8fe1a0: Make ownership card style customizable via custom `theme.getPageTheme()`.
- 70718686f: Use correct `Link` in ownership card to avoid a full reload of the app while navigating.
- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/catalog-model@0.9.2
  - @backstage/core-plugin-api@0.1.7

## 0.3.21

### Patch Changes

- c9927b1c7: Don't open a new tab when clicking on the ownership card.
- 7e5f14dda: This change hides pagination counter of search tables and group members list when results fit in one page
- ff304cfc3: Fix OwnershipCard links to support namespaced owners
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1

## 0.3.20

### Patch Changes

- a60143c37: Link group ownership boxes through filtered catalog page
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.4
  - @backstage/core-components@0.3.3

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/core-plugin-api@0.1.5
  - @backstage/plugin-catalog-react@0.4.1

## 0.3.18

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.3.17

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.3.16

### Patch Changes

- 34352a79c: Add edit button to Group Profile Card
- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6

## 0.3.15

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- ce4abc1e0: Display a tooltip for ownership cards listing the related entities
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.3.14

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [d597a50c6]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/core-api@0.2.20
  - @backstage/plugin-catalog-react@0.2.0

## 0.3.13

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- f59a945b7: Paginate group members to only display 50 members maximum.
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/core-api@0.2.18
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.3.12

### Patch Changes

- 97d53f686: Optimize data fetched for the `OwnershipCard`.
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [b051e770c]
- Updated dependencies [98dd5da71]
  - @backstage/core@0.7.4
  - @backstage/core-api@0.2.16
  - @backstage/catalog-model@0.7.6

## 0.3.11

### Patch Changes

- 7c6e1463b: Correctly route to namespaced group members
- 87171d57d: Correctly include group members via matching namespace relation
- baa39809e: Fixed MembersList showing members from a previous group when navigating to a new group
- 9f48b548c: Some cleanup in how types and components are used; leverage `EntityRefLinks`
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.3.10

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [a51dc0006]
- Updated dependencies [e7f9b9435]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d88dd219e]
- Updated dependencies [c8b54c370]
  - @backstage/core-api@0.2.14
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.3.9

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core-api@0.2.12
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.3.8

### Patch Changes

- e3bc5aad7: Use the `pageTheme` to colour the OwnershipCard boxes with their respective theme colours.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [b6c4f485d]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core-api@0.2.11
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.3.7

### Patch Changes

- f4c2bcf54: Use a more strict type for `variant` of cards.
- e8692df4a: - Fixes padding in `MembersListCard`
  - Fixes email icon size in `GroupProfileCard`
  - Uniform sizing across `GroupProfileCard` and `UserProfileCard`
- Updated dependencies [f10950bd2]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core-api@0.2.10
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.6

### Patch Changes

- 14aef4b94: Visual updates to User and Group pages
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.5

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- 0269f4fd9: Migrate to new composability API, exporting the plugin instance as `orgPlugin`, and the entity cards as `EntityGroupProfileCard`, `EntityMembersListCard`, `EntityOwnershipCard`, and `EntityUserProfileCard`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.4

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

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
