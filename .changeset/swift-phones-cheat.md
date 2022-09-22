---
'@backstage/cli': patch
---

Removed `tsx` and `jsx` as supported extensions in backend packages. For most
repos, this will not have any effect. But if you inadvertently had added some
`tsx`/`jsx` files to your backend package, you may now start to see `code: 'MODULE_NOT_FOUND'` errors when launching the backend locally. The reason for
this is that the offending files get ignored during transpilation. Hence, the
importing file can no longer find anything to import.

The fix is to rename any `.tsx` files in your backend packages to `.ts` instead,
or `.jsx` to `.js`.
