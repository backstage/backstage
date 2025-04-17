# @backstage/canon

## 0.3.1

### Patch Changes

- 2175122: Fix Canon missing dependencies

## 0.3.0

### Minor Changes

- df4e292: Improve class name structure using data attributes instead of class names.
- f038613: Updated TextField and Select component to work with React Hook Form.
- 1b0cf40: Add new Select component for Canon
- 5074d61: **BREAKING**: Added a new TextField component to replace the Field and Input component. After feedback, it became clear that we needed to build a more opinionated version to avoid any problem in the future.

### Patch Changes

- 6af7b16: Updated styles for the Menu component in Canon.
- bcbc593: Fix Checkbox styles on dark theme in Canon.
- e7efb7d: Add new breakpoint helpers up(), down() and current breakpoint to help you use our breakpoints in your React components.
- f7cb538: Internal refactor and fixes to the prop extraction logic for layout components.
- 35b36ec: Add new Collapsible component for Canon.
- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- 513477f: Add global CSS reset for anchor tags.
- 24f0e08: Improved Container styles, changing our max-width to 120rem and improving padding on smaller screens.
- 851779d: Add new Avatar component to Canon.
- ec5ebd1: Add new TableCellProfile component for Table and DataTable in Canon.
- 5e80f0b: Fix types on the Icon component.
- 0e654bf: Add new DataTable component and update Table component styles.
- 7ae28ba: Move styles to the root of the TextField component.
- 4fe5b08: We added a render prop to the Link component to make sure it can work with React Router.
- 74d463c: Fix Select styles on small sizes + with long option names in Canon.
- f25a5be: Added a new gray scale for Canon for both light and dark theme.
- 5ee4fc2: Add support for column sizing in DataTable.
- 05a5003: Fix the Icon component when the name is not found to return null instead of an empty SVG.

## 0.3.0-next.2

### Minor Changes

- f038613: Updated TextField and Select component to work with React Hook Form.
- 1b0cf40: Add new Select component for Canon
- 5074d61: **BREAKING**: Added a new TextField component to replace the Field and Input component. After feedback, it became clear that we needed to build a more opinionated version to avoid any problem in the future.

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- 24f0e08: Improved Container styles, changing our max-width to 120rem and improving padding on smaller screens.
- 7ae28ba: Move styles to the root of the TextField component.
- 4fe5b08: We added a render prop to the Link component to make sure it can work with React Router.

## 0.2.1-next.1

### Patch Changes

- f7cb538: Internal refactor and fixes to the prop extraction logic for layout components.
- 5e80f0b: Fix types on the Icon component.

## 0.2.1-next.0

### Patch Changes

- 6af7b16: Updated styles for the Menu component in Canon.
- 513477f: Add global CSS reset for anchor tags.
- 05a5003: Fix the Icon component when the name is not found to return null instead of an empty SVG.

## 0.2.0

### Minor Changes

- 5a5db29: Fix CSS imports and move CSS outputs out of the dist folder.
- 4557beb: Added a new Tooltip component to Canon.
- 1e4dfdb: We added a new IconButton component with fixed sizes showcasing a single icon.
- e8d12f9: Added about 40 new icons to Canon.
- 8689010: We are renaming CanonProvider to IconProvider to improve clarity on how to override icons.
- bf319b7: Added a new Menu component to Canon.
- cb7e99d: Updating styles for Text and Link components as well as global surface tokens.
- bd8520d: Added a new ScrollArea component for Canon.

### Patch Changes

- 56850ca: Fix Button types that was preventing the use of native attributes like onClick.
- 89e8686: To avoid conflicts with Backstage, we removed global styles and set font-family and font-weight for each components.
- 05e9d41: Introducing Canon to Backstage. Canon styling system is based on pure CSS. We are adding our styles.css at the top of your Backstage instance.

## 0.2.0-next.1

### Minor Changes

- 8689010: We are renaming CanonProvider to IconProvider to improve clarity on how to override icons.

### Patch Changes

- 89e8686: To avoid conflicts with Backstage, we removed global styles and set font-family and font-weight for each components.

## 0.2.0-next.0

### Minor Changes

- 5a5db29: Fix CSS imports and move CSS outputs out of the dist folder.

## 0.1.0

### Minor Changes

- 72c9800: **BREAKING**: Merged the Stack and Inline component into a single component called Flex.
- 65f4acc: This is the first alpha release for Canon. As part of this release we are introducing 5 layout components and 7 components. All theming is done through CSS variables.
- 1e4ccce: **BREAKING**: Fixing css structure and making sure that props are applying the correct styles for all responsive values.
- 8309bdb: Updated core CSS tokens and fixing the Button component accordingly.

### Patch Changes

- 989af25: Removed client directive as they are not needed in React 18.
- f44e5cf: Fix spacing props not being applied for custom values.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.0-next.2

### Minor Changes

- 8309bdb: Updated core CSS tokens and fixing the Button component accordingly.

### Patch Changes

- f44e5cf: Fix spacing props not being applied for custom values.

## 0.1.0-next.1

### Minor Changes

- 72c9800: **BREAKING**: Merged the Stack and Inline component into a single component called Flex.
- 1e4ccce: **BREAKING**: Fixing css structure and making sure that props are applying the correct styles for all responsive values.

### Patch Changes

- 989af25: Removed client directive as they are not needed in React 18.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.0-next.0

### Minor Changes

- 65f4acc: This is the first alpha release for Canon. As part of this release we are introducing 5 layout components and 7 components. All theming is done through CSS variables.
