---
'@backstage/plugin-tech-radar': minor
---

Migrating the Tech Radar to support using `ApiRefs` to load custom data.

If you had a `getData` function, you'll now need to encapsulate that logic in a class that can override the `techRadarApiRef`.

```ts
// app/src/lib/MyClient.ts
import {
  TechRadarApi,
  TechRadarLoaderResponse,
} from '@backstage/plugin-tech-radar';

class MyOwnClient implements TechRadarApi {
  async load(): Promise<TechRadarLoaderResponse> {
    // here's where you would put you logic to load the response that was previously passed into getData
  }
}

// app/src/apis.ts
import { MyOwnClient } from './lib/MyClient';
import { techRadarApiRef } from '@backstage/plugin-tech-radar';

export const apis: AnyApiFactory[] = [
  /*
  ...
  */
  createApiFactory(techRadarApiRef, new MyOwnClient()),
];
```
