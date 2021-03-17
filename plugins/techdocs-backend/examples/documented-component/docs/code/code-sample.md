# Sample Code

This page provides some sample code which may be used in your example component.

This code uses TypeScript, and the Markdown code fence to wrap the code.

```typescript
const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);
```

Here is an example of Python code:

```python
def getUsersInGroup(targetGroup, secure=False):

    if __debug__:
        print('targetGroup=[' + targetGroup + ']')
```
