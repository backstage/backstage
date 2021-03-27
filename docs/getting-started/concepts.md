---
id: concepts
title: Key Concepts
# prettier-ignore
description: High level key concepts used in the Backstage project
---

For users of Backstage, there are certain concepts which are central to its
design and functionality. Being an expert in each of these concepts is not
necessary, however having a base understanding of each will make administering,
configuring, and operating Backstage easier.

- CHANGELOG - https://keepachangelog.com
- Docker - https://www.docker.com/
- Monorepo - https://semaphoreci.com/blog/what-is-monorepo
- Node.js - https://nodejs.org
- React - https://reactjs.org
- Semantic Versioning - https://semver.org
- TypeScript - https://www.typescriptlang.org
- YAML - https://yaml.org
- Yarn - https://www.pluralsight.com/guides/yarn-a-package-manager-for-node-js

## Environment Validation

Before commencing work, you may want to ensure the necessary tools are installed you can so by running the following commands. If any of this commands fail refer to the relevant link above to install and / or configure.

### Run Backstage

To run Backstage locally you should first ensure the following commands run as expected.

- docker

```bash
docker --version
```

- node

```bash
node --version
```

- npx

```bash
npx --version
```

- nvm

```bash
nvm --version
```

- yarn

```bash
yarn --version
```

Note: running the following command should display the version number and patch yarn if needed

```bash
yarn
```

### Contribute to Backstage

If you want to contribute to Backstage you should also ensure the following command runs as expected.

- TypeScript

```bash
tcs -version
```
