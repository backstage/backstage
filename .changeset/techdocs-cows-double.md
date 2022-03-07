---
'@backstage/plugin-techdocs': minor
---

The `mkdocs` is now a replaceable option on your `TechDocsReaderPage` so you can get inspired and create other reader implementations that better fit with your Tech Docs API implementation:

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { techDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs'; 👈
 ...
<Route path="/:kind/:namespace/:name" element={<TechDocsReaderPage />}>
  {techDocsReaderPage}
</Route>
...
```

If you don't pass a `techDocsReaderPage` we use the `mkdocs` implementation by default, i.e. _these changes should not cause breaking changes_:

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
...
<Route path="/:kind/:namespace/:name" element={<TechDocsReaderPage />} />
...
```

A future Reader developer can use Shadow Root tools exported from `@backstage/plugin-techdocs` by following [this](https://github.com/backstage/backstage/pull/9385/files#diff-d77c2d428658da836c75baeca7056a52cadb50bbd140c4760af1078b3ea0887c) step-by-step, they can also see the TechDocsShadowDom implementation [here](https://github.com/backstage/backstage/pull/9385/files#diff-804ace957cb63b94209f40c4ec0e2829ab476443571ed6c65c504cab2c1d0a5e) and an example usage [here](https://github.com/backstage/backstage/pull/9385/files#diff-b1b7469e22b42d35adb2cd0abb3b2272f7d8f40e929009e56106d819172b7771).
