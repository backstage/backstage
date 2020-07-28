# Jenkins Plugin (Alpha)

Website: [https://jenkins.io/](https://jenkins.io/)

<img src="./src/assets/last-master-build.png"  alt="Last master build"/>
<img src="./src/assets/folder-results.png"  alt="Folder results"/>
<img src="./src/assets/build-details.png"  alt="Build detials"/>

## Setup

1. If you have a standalone app (you didn't clone this repo), then do

```bash
yarn add @backstage/plugin-jenkins
```

2. Add plugin API to your Backstage instance:

```js
// packages/app/src/api.ts
import { JenkinsApi, jenkinsApiRef } from '@backstage/plugin-jenkins';

const builder = ApiRegistry.builder();
builder.add(jenkinsApiRef, new JenkinsApi(`${backendUrl}/proxy/jenkins/api`));
```

2. Add plugin itself:

```js
// packages/app/src/plugins.ts
export { plugin as Jenkins } from '@backstage/plugin-jenkins';
```

3. Add proxy configuration to `app-config.yaml`

```yaml
proxy:
  '/jenkins/api':
    target: 'http://localhost:8080' # your Jenkins URL
    changeOrigin: true
    headers:
      Authorization:
        $secret:
          env: JENKINS_BASIC_AUTH_HEADER
    pathRewrite:
      '^/proxy/jenkins/api/': '/'
```

4. Add an environment variable which contains the Jenkins credentials, (note: use an API token not your password)

```shell
HEADER=$(echo -n user:api-token | base64)
export JENKINS_BASIC_AUTH_HEADER="Authorization: Basic $HEADER"
```

5. Run app with `yarn start`
6. Add the Jenkins folder annotation to your `component-info.yaml`, (note: currently this plugin only supports folders and Git SCM)

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: 'your-component'
  description: 'a description'
  annotations:
    backstage.io/jenkins-github-folder: 'folder-name/job-name'
spec:
  type: service
  lifecycle: experimental
  owner: your-name
```

7. Register your component

8. Click the component in the catalog you should now see Jenkins builds, and a last build result for your master build.

## Features

- View all runs inside a folder
- Last build status for specified branch
- View summary of a build

## Limitations

- Only works with projects that use the Git SCM
- It requires jobs to be organised into folders
