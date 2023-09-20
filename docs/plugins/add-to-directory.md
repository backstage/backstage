---
id: add-to-directory
title: Add to Directory
description: Documentation on Adding Plugin to Plugin Directory
---

## Adding a Plugin to the Directory

To add a new plugin to the [plugin directory](https://backstage.io/plugins)
create a file in
[`microsite/data/plugins`](https://github.com/backstage/backstage/tree/master/microsite/data/plugins)
with your plugin's information. Example:

```yaml
---
title: Your Plugin
author: Your Name
authorUrl: # A link to information about the author E.g. Company url, github user profile, etc
category: Monitoring # A single category e.g. CI, Machine Learning, Services, Monitoring
description: A brief description of the plugin. # Max 170 characters
documentation: # A link to your documentation E.g. Your github README
iconUrl: # Used as the src attribute for your logo.
# You can provide an external url or add your logo under static/img and provide a path
# relative to static/ e.g. img/my-logo.png
npmPackageName: # Your npm package name E.g. '@backstage/plugin-<etc>' quotes are required
addedDate: # The date plugin added to directory E.g. '2022-10-01' quotes are required
```
