# @backstage/plugin-home

## 0.4.5

### Patch Changes

- 4a336fd292: Add name option to `createCardExtension` to remove deprecation warnings for extensions without name. Name will be required for extensions in a future release of `core-plugin-api` and therefore also in `createCardExtension`.
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13

## 0.4.4

### Patch Changes

- ef5bf4235a: Adds a `<WelcomeTitle>` component that shows a playful greeting on the home page.
  To use it, pass it to the home page header:

  ```typescript
  <Page themeId="home">
    <Header title={<WelcomeTitle />} pageTitleOverride="Home">
      <HomepageTimer />
    </Header>
    …
  </Page>
  ```

- 87b2d5ad88: Fix `<ComponentTabs>` to display only the selected tab, not the other way around.
- 2435d7a49b: Added HeaderWorldClock to the Home plugin which is a copy of the HomepageTimer from core-components that has been updated to use props over static config from app-config.yaml. To use HeaderWorldClock you'll need to create an array of ClockConfig like this:

  ```ts
  const clockConfigs: ClockConfig[] = [
    {
      label: 'NYC',
      timeZone: 'America/New_York',
    },
    {
      label: 'UTC',
      timeZone: 'UTC',
    },
    {
      label: 'STO',
      timeZone: 'Europe/Stockholm',
    },
    {
      label: 'TYO',
      timeZone: 'Asia/Tokyo',
    },
  ];
  ```

  Then you can pass `clockConfigs` into the HeaderWorldClock like this:

  ```ts
  <Page themeId="home">
    <Header title="Home">
      <HeaderWorldClock clockConfigs={clockConfigs} />
    </Header>
    <Content>...</Content>
  </Page>
  ```

- Updated dependencies
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.4.3

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10

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
