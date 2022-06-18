---
'@backstage/plugin-home': patch
---

Added support for customizing the time format used in the `HeaderWorlClock` component

Here's an example of how this can be used in the `HomePage.tsx` found in `\packages\app\src\components\home` to change the clock to be in the 24hr time format:

```diff
+const timeFormat: Intl.DateTimeFormatOptions = {
+  hour: '2-digit',
+  minute: '2-digit',
+  hour12: false,
+};

export const homePage = (
  <Page themeId="home">
    <Header title={<WelcomeTitle />} pageTitleOverride="Home">
+      <HeaderWorldClock clockConfigs={clockConfigs} customTimeFormat={timeFormat} />
    </Header>
    <Content>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <HomePageSearchBar />
        </Grid>
```
