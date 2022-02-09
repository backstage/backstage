---
'@backstage/plugin-search': minor
---

**BREAKING**: `useSearch` doesn't return anymore `open` and `toggleModal`.
The two properties have been moved to the `useSearchModal` hook.

```
import { SearchModal, useSearchModal } from '@backstage/plugin-search';

const Foo = () => {
  const { state, setOpen, toggleModal } = useSearchModal();

  return (
    <SearchModal {...state} toggleModal={toggleModal} />
  );
};
```
