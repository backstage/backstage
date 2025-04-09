---
'@backstage/cli': minor
---

Removes default React imports from template files, aligning with the requirements for the upcoming React 19 migration. Introduces a new ESLint rule to disallow `import React from 'react'` and `import * as React from 'react'`.

<https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>
