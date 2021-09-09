---
'@backstage/plugin-home': minor
---

The homepage `<Header />` is now part of the composable canvas (allowing you to add the <HomepageTimer />, for example).

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
