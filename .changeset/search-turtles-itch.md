---
'@backstage/plugin-search': patch
---

To allow people to use a global search context in the search modal, the code for the search modal has been changed to only create a local search context if there is no parent context already defined.

If you want to continue using a local context even if you define a global one, you will have to wrap the modal in a new local context manually:

```tsx
<SearchContextProvider>
  <SearchModal toggleModal={toggleModal} />
</SearchContextProvider>
```
