---
'@backstage/create-app': patch
---

**Fully migrated the template to the new composability API**

The `create-app` template is now fully migrated to the new composability API, see [Composability System Migration Documentation](https://backstage.io/docs/plugins/composability) for explanations and more details. The final change which is now done was to migrate the `EntityPage` from being a component built on top of the `EntityPageLayout` and several more custom components, to an element tree built with `EntitySwitch` and `EntityLayout`.

To apply this change to an existing plugin, it is important that all plugins that you are using have already been migrated. In this case the most crucial piece is that no entity page cards of contents may require the `entity` prop, and they must instead consume the entity from context using `useEntity`.

Since this change is large with a lot of repeated changes, we'll describe a couple of common cases rather than the entire change. If your entity pages are unchanged from the `create-app` template, you can also just bring in the latest version directly from the [template itself](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx).

The first step of the change is to change the `packages/app/src/components/catalog/EntityPage.tsx` export to `entityPage` rather than `EntityPage`. This will require an update to `App.tsx`, which is the only change we need to do outside of `EntityPage.tsx`:

```diff
-import { EntityPage } from './components/catalog/EntityPage';
+import { entityPage } from './components/catalog/EntityPage';

 <Route
   path="/catalog/:namespace/:kind/:name"
   element={<CatalogEntityPage />}
 >
-  <EntityPage />
+  {entityPage}
 </Route>
```

The rest of the changes happen within `EntityPage.tsx`, and can be split into two broad categories, updating page components, and updating switch components.

#### Migrating Page Components

Let's start with an example of migrating a user page component. The following is the old code in the template:

```tsx
const UserOverviewContent = ({ entity }: { entity: UserEntity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <UserProfileCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={6}>
      <OwnershipCard entity={entity} variant="gridItem" />
    </Grid>
  </Grid>
);

const UserEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<UserOverviewContent entity={entity as UserEntity} />}
    />
  </EntityPageLayout>
);
```

There's the main `UserEntityPage` component, and the `UserOverviewContent` component. Let's start with migrating the page contents, which we do by rendering an element rather than creating a component, as well as replace the cards with their new composability compatible variants. The new cards and content components can be identified by the `Entity` prefix.

```tsx
const userOverviewContent = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <EntityUserProfileCard variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={6}>
      <EntityOwnershipCard variant="gridItem" />
    </Grid>
  </Grid>
);
```

Now let's migrate the page component, again by converting it into a rendered element instead of a component, as well as replacing the use of `EntityPageLayout` with `EntityLayout`.

```tsx
const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {userOverviewContent}
    </EntityLayout.Route>
  </EntityLayout>
);
```

At this point the `userPage` is quite small, so throughout this migration we have inlined the page contents for all pages. This is an optional step, but may help reduce noise. The final page now looks like this:

```tsx
const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);
```

#### Migrating Switch Components

Switch components were used to select what entity page components or cards to render, based on for example the kind of entity. For this example we'll focus on the root `EntityPage` switch component, but the process is the same for example for the CI/CD switcher.

The old `EntityPage` looked like this:

```tsx
export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLocaleLowerCase('en-US')) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    case 'group':
      return <GroupEntityPage entity={entity} />;
    case 'user':
      return <UserEntityPage entity={entity} />;
    case 'system':
      return <SystemEntityPage entity={entity} />;
    case 'domain':
      return <DomainEntityPage entity={entity} />;
    case 'location':
    case 'resource':
    case 'template':
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
```

In order to migrate to the composability API, we need to make this an element instead of a component, which means we're unable to keep the switch statement as is. To help with this, the catalog plugin provides an `EntitySwitch` component, which functions similar to a regular `switch` statement, which the first match being the one that is rendered. The catalog plugin also provides a number of built-in filter functions to use, such as `isKind` and `isComponentType`.

To migrate the `EntityPage`, we convert the `switch` statement into an `EntitySwitch` element, and each `case` statement into an `EntitySwitch.Case` element. We also move over to use our new element version of the page components, with the result looking like this:

```tsx
export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

Another example is the `ComponentEntityPage`, which is migrated from this:

```tsx
export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  switch (entity?.spec?.type) {
    case 'service':
      return <ServiceEntityPage entity={entity} />;
    case 'website':
      return <WebsiteEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
```

To this:

```tsx
const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

Note that if you want to conditionally render some piece of content, you can omit the default `EntitySwitch.Case`. If no case is matched in an `EntitySwitch`, nothing will be rendered.
