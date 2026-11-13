---
'@backstage/cli-node': patch
---

Fixed the Node.js module transform loading ES module JavaScript files from packages without a `"type"` field as CommonJS, which broke named imports such as `import { DefaultGithubCredentialsProvider } from '@backstage/integration'` during local development. The format of these files is now detected by Node.js, while TypeScript files in such packages are still treated as CommonJS.
