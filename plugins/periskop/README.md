# periskop

[Periskop](https://periskop.io/) is a pull-based, language agnostic exception aggregator for microservice environments.

![periskop-logo](https://i.imgur.com/z8BLePO.png)

### `PeriskopErrorsTable`

The Periskop Backstage Plugin exposes an entity tab component named `PeriskopErrorsTable`. Each of the entries in the table will direct you to the error details in your deployed Periskop instance location.

![periskop-errors-card](./docs/periskop-plugin-screenshot.png)

Now your plugin should be visible as a tab at the top of the entity pages.
However, it warns of a missing `periskop.io/name` annotation.

Add the annotation to your component descriptor file as shown in the highlighted example below:

```yaml
annotations:
  periskop.io/name: '<THE NAME OF THE PERISKOP APP>'
```

### Instances

The periskop plugin can be configured to fetch aggregated errors from multiple deployment instances.  
This is especially useful if you have a multi-zone deployment, or a federated setup and would like to drill deeper into a single instance of the federation. Each of the configured instances will be included in the plugin's UI via a dropdown on the errors table.

The plugin requires to configure _at least one_ Periskop API location in the [app-config.yaml](https://github.com/backstage/backstage/blob/master/app-config.yaml):

```yaml
periskop:
  instances:
    - name: <name of the instance>
      url: <HTTP/S url for the Periskop instance's API>
```
