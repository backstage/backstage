---
'@backstage/create-app': patch
---

Updated the default create-app `EntityPage` to include orphan and processing error alerts for all entity types. Previously these were only shown for entities with the `Component` kind. This also adds the `EntityLinkCard` for API entities.

As an example, you might add this to your `packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx`:

```tsx
const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);
```

and then add that at the top of your various content pages:

```diff
 const overviewContent = (
   <Grid container spacing={3} alignItems="stretch">
+    {entityWarningContent}
     <Grid item md={6}>
       <EntityAboutCard variant="gridItem" />
     </Grid>
```

or in actual page wrappers:

```diff
 const apiPage = (
   <EntityLayout>
     <EntityLayout.Route path="/" title="Overview">
       <Grid container spacing={3}>
+        {entityWarningContent}
         <Grid item md={6}>
           <EntityAboutCard />
         </Grid>
```

Note that there may be many such `*Page` pages in that file, and you probably want that warning at the top of them all.

You can also add the links card to your API page if you do not already have it:

```diff
const apiPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
+       {entityWarningContent}
         <Grid item md={6}>
           <EntityAboutCard />
         </Grid>
+        <Grid item md={4} xs={12}>
+          <EntityLinksCard />
+        </Grid>
```
