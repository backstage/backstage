---
'@backstage/create-app': patch
---

debounceTime prop is removed from the SearchBar component in the SearchPage as the default is set to 200. The prop is safe to remove and makes it easier to stay up to date with any changes in the future.
