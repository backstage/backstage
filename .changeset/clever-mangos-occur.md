---
'@backstage/create-app': patch
---

Don't pull `@types/unist@3.0.0` transitively.

Both `@types/hast@^2.0.0` and `@types/mdast@^3.0.0` depend on`@types/unist@*` so that the recently published `@types/unist@3.0.0` is now automatically resolved by a `yarn install` in created apps, which leads to typescript errors, especially during E2E tests on CI.
