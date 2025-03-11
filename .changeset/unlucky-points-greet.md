---
'@backstage/cli': patch
---

Added support for `?raw` query on imports, allowing any module to be imported as a static asset. For example:

```ts
import cssHref from './styles.css?raw';

console.log(cssHref); // e.g. "/static/styles.123456.css"
```
