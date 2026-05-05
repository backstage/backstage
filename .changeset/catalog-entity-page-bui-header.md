---
'@backstage/plugin-catalog': minor
---

The new frontend system entity page can now opt in to a header and tabs
rendered with the `Header` component from `@backstage/ui`. Multi-content
groups become dropdown menus inside the header navigation, single-content
groups collapse to flat links, and the title row uses BUI components for
the favorite toggle and the kebab menu.

Adopters opt in by setting `useBuiHeader: true` on the
`page:catalog/entity` extension. Opting in also re-enables the framework
`PluginHeader` above the BUI entity header, since the BUI mode no longer
needs the page-level header suppressed:

```yaml
app:
  extensions:
    - page:catalog/entity:
        config:
          useBuiHeader: true
```

The legacy Material UI header remains the default and is also used
automatically for entities matched by a custom `EntityHeaderBlueprint`,
since `EntityHeaderBlueprint` and `EntityContextMenuItemBlueprint` output
Material UI primitives that don't render inside the BUI header.
