---
'@backstage/cli': patch
---

The frontend configuration is now available as a `config` global during templating of the `index.html` file. This allows for much more flexibility as the values available during templating is not longer hardcoded to a fixed set of values.

For example, to access the app title, you would now do the following:

```html
<title><%= config.getString('app.title') %></title>
```

Along with this change, usage of the existing `app.<key>` values has been deprecated and will be removed in a future release. The general pattern for migrating existing usage is to replace `<%= app.<key> %>` with `<%= config.getString('app.<key>') %>`, although in some cases you may need to use for example `config.has('app.<key>')` or `config.getOptionalString('app.<key>')` instead.

The [`@backstage/create-app` changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#049) also contains more details how to migrate existing usage.
