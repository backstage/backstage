---
'@backstage/plugin-scaffolder': patch
---

Added a `context` parameter to validator functions, letting them have access to
the API holder.

If you have implemented custom validators and use `createScaffolderFieldExtension`,
your `validation` function can now optionally accept a third parameter,
`context: { apiHolder: ApiHolder }`.
