# Octopus Deploy Plugin

Welcome to the octopus-deploy plugin!

## Features

- Display the deployment status of the most recent releases for a project in Octopus Deploy straight from the Backstage catalog

## Getting started

### Installing

To get started, first install the plugin with the following command:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-octopus-deploy
```

### Setup

This plugin (currently) uses the Backstage proxy to securely communicate with the Octopus Deploy API.

To use it, you will need to generate an [API Key](https://octopus.com/docs/octopus-rest-api/how-to-create-an-api-key) within Octopus Deploy.

1. Add the following to your app-config.yaml to enable the proxy:

```
// app-config.yaml
proxy:
  '/octopus-deploy':
    target: 'https://<your-octopus-server-instance>/api'
    headers:
      X-Octopus-ApiKey: ${OCTOPUS_API_KEY}
```

Optionally, also add the following section to your app-config.yaml if you wish to enable linking to the Project Release page in the Octopus Deploy UI from the footer of the Backstage Release Table. Typically this will be the server URL above without the /api postfix.

```
octopusdeploy:
  webBaseUrl: "<your-octopus-web-url>"
```

2. Add the following to `EntityPage.tsx` to display Octopus Releases

```
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  isOctopusDeployAvailable,
  EntityOctopusDeployContent
} from '@backstage/plugin-octopus-deploy';

const cicdContent = (
    <EntitySwitch>
      {/* other components... */}
      <EntitySwitch.Case if={isOctopusDeployAvailable}>
        <EntityOctopusDeployContent defaultLimit={25} />
      </EntitySwitch.Case>
    </EntitySwitch>
)
```

3. Add `octopus.com/project-id` annotation in the catalog descriptor file.

To obtain a projects ID you will have to query the Octopus API. In the future we'll add support for using a projects slug as well.

```
// catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    octopus.com/project-id: Projects-102
spec:
  type: service
```

If your project is not part of the default space you can add the space ID to the annotation as a prefix. For example:

```
// catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    octopus.com/project-id: Spaces-2/Projects-102
spec:
  type: service
```

You can get the ID of the space from the URL in the Octopus Deploy UI.

All set, you will be able to see the plugin in action!
