# [Allure](https://docs.qameta.io/allure/)

Welcome to the Backstage Allure plugin. This plugin add an entity service page to display Allure test reports related to the service.

## Install

```shell
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-allure
```

## Configure

### Configure Allure service

Add below configuration in the `app-config.yaml`.

```yaml
allure:
  baseUrl: <ALLURE_SERVICE_BASE_URL> # Example: https://allure.my-company.net or when running allure locally, http://localhost:5050/allure-docker-service
```

### Setup entity service page

Add `EntityAllureReportContent` in the `EntityPage.tsx` like below:

```diff
+ import { EntityAllureReportContent } from '@backstage/plugin-allure';

...

const serviceEntityPage = (
  <EntityLayoutWrapper>
    ...
+    <EntityLayout.Route path="/allure" title="Allure Report">
+        <EntityAllureReportContent />
+    </EntityLayout.Route>
  </EntityLayoutWrapper>
);
```
