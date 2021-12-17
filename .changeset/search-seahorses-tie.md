---
'example-app': patch
'@backstage/plugin-search': patch
---

Standardizes the component used as a search box in the search modal and in the composable home page.

After these changes, all search boxes exported by the search plugin are based on the `<SearchBarBase />` component, and this one is based on the `<InputBase />` component of the Material UI. This means that when you use SearchBarBase or one of its derived components (like `SearchBar` and `HomePageSearchBar`) you can pass all properties accepted by InputBase that have not been replaced by the props type of those components.

For example:

```jsx
<SearchInputBase color="secondary" debouceTime={500} />
```

The `color` property is inherited from `InputBaseProps` type and `debouceTime` defined by `SearchBarBaseProps`.
