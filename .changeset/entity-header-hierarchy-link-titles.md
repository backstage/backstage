---
'@backstage/plugin-catalog': patch
---

Fixed the BUI entity header (`EntityHeaderBui`) rendering a hierarchy relation's (System, Domain, parent Component) raw catalog name instead of its resolved title. `HierarchyLinks` now resolves each relation the same way the rest of the header resolves entity presentation, via `useEntityPresentation`, instead of printing the bare `CompoundEntityRef.name`.
