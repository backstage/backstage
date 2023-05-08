---
id: index
title: Backstage Accessibility
description: Documentation on Backstage Accessibility
---

In an effort to bake accessibility practices further into our process of building features for Backstage, we’ve rolled out automated CI tests to the OSS project on some of our core features, Software Catalog, Software Templates, Search and TechDocs. As these are just a few plugins of many out there, we want to encourage you to consider the accessibility implications of your work on Backstage in order to build a great experience for everyone.

## How to contribute

There are multiple ways to contribute to making Backstage accessible to everyone, below we list examples of some ways you can do that.

### Run Lighthouse in CI on your plugin

If your plugin lives in the [Backstage main repository](https://github.com/backstage/backstage/) you can modify the [urls in the Lighthouse config](https://github.com/backstage/backstage/blob/39ba2284d73885b7ca8290cb38e2b1e4d983c8d6/lighthouserc.js#L19-L34) to run the Lighthouse checks on urls where your plugin exists as well. E.g.

```diff
 ci: {
    collect: {
      url: [
+        /** Your plugin paths */
+        'http://localhost:3000/your-plugin-path,
        /** Software Catalog */
        'http://localhost:3000/catalog',
        'http://localhost:3000/catalog-import',
        'http://localhost:3000/catalog/default/component/backstage',
        ...
      ],
      settings: {
       ...
      },
     ...
    },
    assert: {
      ...
    },
  },
```

To make sure the [Accessibility Github workflow](https://github.com/backstage/backstage/blob/master/.github/workflows/verify_accessibility.yml) is running when changes are made to your plugin folders, also modify the [list of paths](https://github.com/backstage/backstage/blob/10759b6ad2561bd86183ad940256f9a309c7a6b0/.github/workflows/verify_accessibility.yml#L7-L16).

### Run the Lighthouse CLI locally when developing new features

If you want to use the Lighthouse CLI and run the checks based on the config you can use the following command:

```
yarn dlx @lhci/cli@0.11.x autorun
```

> Note: running this command will use the [Lighthouse config](https://github.com/backstage/backstage/blob/39ba2284d73885b7ca8290cb38e2b1e4d983c8d6/lighthouserc.js#L19-L34) so make sure to adjust it to your needs if needed.

### Use Lighthouse Github Action on your own repo

If your Backstage plugin lives outside of the [Backstage main repository](https://github.com/backstage/backstage/), and you use Github Actions for continuous integration, we encourage you to add and modify the [Accessibility Github workflow](https://github.com/backstage/backstage/blob/master/.github/workflows/verify_accessibility.yml) to your needs.

### Report identified issues

It’s important to remember that the automated checks can just catch a very low number of accessibility issues, therefore we encourage you to do manual testing of your plugins using Assistive technology (e.g. Screen readers, alternative navigation, screen magnifiers, to mention a few) as well.

If you have identified accessibility issues and don’t have time right now for a contribution, please open an issue over at [Backstage Issues](https://github.com/backstage/backstage/issues) to let us know.
