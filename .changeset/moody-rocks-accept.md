---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

The `useEntityList` hook has been updated to send a list of entity fields to the
backend. This optimizes the catalog query, especially in the case of a catalog
with many API definitions.

This is a transparent change _unless_ you have added custom components that use
the `useEntityList` hook. If this applies to you, you can update those
components to use the new exported `addEntityFields` function to add any entity
fields used by your component:

```diff
export function MyCustomPicker = () => {
-    const { updateFilters, filters } = useEntityList();
+    const { updateFilters, filters, addEntityFields } = useEntityList();
    const [values, setValues] = useState<string[]>([]);

+    useEffect(() => addEntityFields(['spec.otherfield']), [addEntityFields]);
    useEffect(() => {
        // filter implementation that uses spec.otherfield
        updateFilters({ val: new MyCustomFilter(values) });
    }, [values]);
    ...
}
```
