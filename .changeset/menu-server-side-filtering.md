---
'@backstage/ui': patch
---

Added support for server-side filtering of items in `MenuAutocomplete` and `MenuAutocompleteListbox`. Pass `filter={null}` to disable the built-in client-side filtering when items are already filtered server-side, or pass a custom filter function to change how items are matched against the search input. The search input can now also be observed and controlled with the new `onInputChange`, `inputValue`, and `defaultInputValue` props.
