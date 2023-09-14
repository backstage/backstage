# [Fianu](https://www.fianu.io/)

Welcome to the Backstage Fianu plugin. This plugin add an entity service page to display Fianu test reports related to the service.

## Install

```shell
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-fianu
```

## Configure

### Configure Fianu service

Add below configuration in the `app-config.yaml`.

```yaml
fianu:
  baseUrl: <FIANU_SERVICE_BASE_URL> # Example: https://fianu.my-company.com/api/badges
```

### Setup entity service page

Add `EntityFianuReportContent` in the `EntityPage.tsx` like below:

```diff
+ import { FianuPage } from '@backstage/plugin-fianu';

...

const serviceEntityPage = (
  <EntityLayout>
    ...
+    <EntityLayout.Route path="/fianu" title="Fianu">
+      <FianuPage />
+    </EntityLayout.Route>
    ...
  </EntityLayout>
...  
);
```
