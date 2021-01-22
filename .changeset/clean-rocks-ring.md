---
"@backstage/cli": minor
---

We've bumped the `@eslint-typescript` packages to the latest, which now add some additional rules that might cause lint failures. 
The main one which could become an issue is the [no-use-before-define](https://eslint.org/docs/rules/no-use-before-define) rule.

Every plugin and app has the ability to override these rules if you want to ignore them for now.

You can reset back to the default behaviour by using the following in your own `.eslint.js`


```js
rules: {
  'no-use-before-define': 'off'
}
```

Because of the nature of this change, we're unable to provide a grace period for the update :(
