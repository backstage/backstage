---
'@backstage/plugin-search-react': minor
---

We noticed a repeated check for the existence of a parent context before creating a child search context in more the one component such as Search Modal and Search Bar and to remove code duplication we extract the conditional to the context provider, now you can use it passing an `inheritParentContextIfAvailable` prop to the `SearchContextProvider`.

Note: This added property does not create a local context if there is a parent context and in this case, you cannot use it together with `initialState`, it will result in a type error because the parent context is already initialized.
