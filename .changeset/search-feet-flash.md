---
'@backstage/plugin-search-react': patch
---

Add the term autocomplete functionality to the search bar with a `SearchAutocomplete` component. Additionally, we provide a `SearchAutocompleteDefaultOption` to render options with an icon, a primary text and a secondary text.
Example:

```jsx
// import { SearchAutocomplete, SearchAutocompleteDefaultOption} from '@backstage/plugin-search-react';
<SearchAutocomplete
  options={options}
  getOptionLabel={option => option.title}
  renderOption={option => (
    <SearchAutocompleteDefaultOption
      icon={<OptionIcon />}
      primaryText={option.title}
      secondaryText={option.text}
    />
  )}
/>
```
