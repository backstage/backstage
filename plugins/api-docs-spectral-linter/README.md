# Spectral Linter Plugin

Welcome to the [Spectral](https://stoplight.io/open-source/spectral) Linter plugin!

This plugin allows you to lint (validate) API's with rule sets.

![Spectral linter](./docs/spectral-linter.png)

## Setup

1. Install this plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-api-docs-spectral-linter
```

### Entity Pages

1. Add the plugin as a tab to your Entity pages:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityApiDocsSpectralLinterContent, isApiDocsSpectralLinterAvailable } from '@backstage/plugin-api-docs-spectral-linter';

...

const apiPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route if={isApiDocsSpectralLinterAvailable} path="/linter" title="Linter">
      <EntityApiDocsSpectralLinterContent />
    </EntityLayout.Route>
  </EntityLayout>
```

2. Add `backstage.io/spectral-ruleset-url` annotation to your `catalog-info.yaml`:

```yaml
metadata:
  annotations:
    backstage.io/spectral-ruleset-url: <url-to-your-yaml-or-json-file>
```

### Default rule sets

You can provide default rule sets in you `app-config.yaml` like this

```yaml
spectralLinter:
  openApiRulesetUrl: <url-to-your-yaml-or-json-file>
  asyncApiRulesetUrl: <url-to-your-yaml-or-json-file>
```
