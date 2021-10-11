---
'@backstage/plugin-home': patch
---

Adds a `<WelcomeTitle>` component that shows a playful greeting on the home page.
To use it, pass it to the home page header:

```typescript
<Page themeId="home">
  <Header title={<WelcomeTitle />} pageTitleOverride="Home">
    <HomepageTimer />
  </Header>
  …
</Page>
```
