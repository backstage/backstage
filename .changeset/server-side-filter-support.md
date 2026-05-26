---
'@backstage/ui': patch
---

Added controlled input and loading-state props to `Combobox`, `Select`, `MenuAutocomplete`, and `MenuAutocompleteListbox` so that server-side / async filtering can be wired up without reimplementing the components. When the controlled input value is set, the built-in client-side filter is disabled and the parent is expected to supply the filtered options. A new `isLoading` prop shows a "Searching..." indicator while results are being fetched.

**Affected components:** Combobox, Select, MenuAutocomplete, MenuAutocompleteListbox
