---
'@backstage/plugin-catalog-import': minor
---

Add initial support for customizing the catalog import page.

It is now possible to pass a custom layout to the import page, as it's already
supported by the search page. If no custom layout is passed, the default layout
is used.

```typescript
<Route path="/catalog-import" element={<CatalogImportPage />}>
  <Page themeId="home">
    <Header title="Register an existing component" />
    <Content>
      <ContentHeader title="Start tracking your components">
        <SupportButton>
          Start tracking your component in Backstage by adding it to the
          software catalog.
        </SupportButton>
      </ContentHeader>

      <Grid container spacing={2} direction="row-reverse">
        <Grid item xs={12} md={4} lg={6} xl={8}>
          Hello World
        </Grid>

        <Grid item xs={12} md={8} lg={6} xl={4}>
          <ImportStepper />
        </Grid>
      </Grid>
    </Content>
  </Page>
</Route>
```

Previously it was possible to disable and customize the automatic pull request
feature by passing options to `<CatalogImportPage>` (`pullRequest.disable` and
`pullRequest.preparePullRequest`). This functionality is moved to the
`CatalogImportApi` which now provides an optional `preparePullRequest()`
function. The function can either be overridden to generate a different content
for the pull request, or removed to disable this feature.

The export of the long term deprecated legacy `<Router>` is removed, migrate to
`<CatalogImportPage>` instead.
