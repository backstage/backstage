# @backstage/plugin-home

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0

## 0.4.0

### Minor Changes

- bcf312fa52: The homepage `<Header />` is now part of the composable canvas (allowing you to add the <HomepageTimer />, for example).

  You will need to wrap your existing composed `<HomePage />` component in `<Page />`, `<Header />`, and `<Content />` components, like this:

  ```diff
  // app/src/components/home/HomePage.tsx

  + import { Content, Header, Page, HomePageTimer } from '@backstage/core-components';

  export const HomePage = () => (
  +  <Page themeId="home">
  +    <Header title="Home">
  +      <HomepageTimer />
  +    </Header>
  +    <Content>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <HomePageSearchBar />
      </Grid>
      // ...
  +    </Content>
  +  </Page>
  );
  ```

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- 1da51fec2b: Adjust dependencies to `@types/react` and `react-router` to follow the pattern
  used by all other Backstage packages.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.3.0

### Minor Changes

- 7f00902d9: Rename RandomJokeHomePageComponent to HomePageRandomJoke to fit convention, and update example app accordingly.
  **NOTE**: If you're using the RandomJoke component in your instance, it now has to be renamed to `HomePageRandomJoke`

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/core-plugin-api@0.1.7

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.2.0

### Minor Changes

- 2b7d3455b: Create the `Home` plugin which exports some basic functionality that's used to compose a homepage. An example of a composed homepage is added to the example app.

  This change also introduces the `createCardExtension` which creates a lazy loaded card that is intended to be used for homepage components.

  Adoption of this homepage requires setup similar to what can be found in the example app.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.2
  - @backstage/theme@0.2.10
