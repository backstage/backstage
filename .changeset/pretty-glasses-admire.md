---
'@backstage/cli': patch
---

Removed the `import/no-duplicates` lint rule from the frontend and backend ESLint configurations. This rule is quite expensive to execute and only provides a purely cosmetic benefit, so we opted to remove it from the set of default rules. If you would like to keep this rule you can add it back in your local ESLint configuration:

```js
  'import/no-duplicates': 'warn'
```
