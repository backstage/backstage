# Jenkins Plugin (Alpha)

Website: [https://jenkins.io/](https://jenkins.io/)

<img src="./src/assets/last-master-build.png"  alt="Last master build"/>
<img src="./src/assets/folder-results.png"  alt="Folder results"/>
<img src="./src/assets/build-details.png"  alt="Build details"/>

## Setup

1. If you have a standalone app (you didn't clone this repo), then do

```bash
yarn add @backstage/plugin-jenkins
```

2. Add the `EntityJenkinsContent` extension to the entity page in the app:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityJenkinsContent } from '@backstage/plugin-circleci';

// ...
const serviceEntityPage = (
  <EntityPageLayout>
    ...
    <EntityLayout.Route path="/jenkins" title="Jenkins">
      <EntityJenkinsContent />
    </EntityLayout.Route>
    ...
  </EntityPageLayout>
);
```

3. Add proxy configuration to `app-config.yaml`

```yaml
proxy:
  '/jenkins/api':
    target: 'http://localhost:8080' # your Jenkins URL
    changeOrigin: true
    headers:
      Authorization: Basic ${JENKINS_BASIC_AUTH_HEADER}
```

4. Add an environment variable which contains the Jenkins credentials, (note: use an API token not your password). Here user is the name of the user created in Jenkins.

```shell
export JENKINS_BASIC_AUTH_HEADER=$(echo -n user:api-token | base64)
```

5. Run app with `yarn start`
6. Add the Jenkins folder annotation to your `catalog-info.yaml`, (note: currently this plugin only supports folders and Git SCM)

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: 'your-component'
  description: 'a description'
  annotations:
    jenkins.io/github-folder: 'folder-name/project-name'
spec:
  type: service
  lifecycle: experimental
  owner: your-name
```

7. Register your component

8. Click the component in the catalog you should now see Jenkins builds, and a last build result for your master build.

Note:

If you are not using environment variable then you can directly type API token in app-config.yaml

```yaml
proxy:
  '/jenkins/api':
    target: 'http://localhost:8080' # your Jenkins URL
    changeOrigin: true
    headers:
      Authorization: Basic YWRtaW46MTFlYzI1NmU0Mzg1MDFjM2Y1Yzc2Yjc1MWE3ZTQ3YWY4Mw==
```

YWRtaW46MTFlYzI1NmU0Mzg1MDFjM2Y1Yzc2Yjc1MWE3ZTQ3YWY4Mw== is the base64 of user and it's API token e.g. admin:11ec256e438501c3f5c76b751a7e47af83

## Features

- View all runs inside a folder
- Last build status for specified branch
- View summary of a build

## Limitations

- Only works with organization folder projects backed by GitHub
- No pagination support currently, limited to 50 projects - don't run this on a Jenkins with lots of builds
