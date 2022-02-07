---
'@backstage/plugin-explore': patch
---

The component `DomainExplorerContent` now has a filter prop. This allows for the user to only display certain `Domains` or even custom `Entities`. In your explore page you can declare the component like this:

```tsx
const filter = { kind: 'Domain', 'spec.owner': 'team-a' }
<ExploreLayout
    title={`Explore the ${organizationName} ecosystem`}
    subtitle="Discover solutions available in your ecosystem"
  >
    <ExploreLayout.Route path="domains" title="Domains">
      <DomainExplorerContent filter={filter}/>
    </ExploreLayout.Route>
</ExploreLayout>
```
