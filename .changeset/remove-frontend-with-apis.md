---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated `withApis` export. Wrap class components in a function component that uses `useApi` instead:

```tsx
import { errorApiRef, useApi } from '@backstage/frontend-plugin-api';
import { MyClassComponent, MyClassComponentProps } from './MyClassComponent';

export function MyComponent(props: Omit<MyClassComponentProps, 'errorApi'>) {
  const errorApi = useApi(errorApiRef);
  return <MyClassComponent {...props} errorApi={errorApi} />;
}
```
