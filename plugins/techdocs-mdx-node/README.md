# @backstage/plugin-techdocs-mdx-node

Use this plugin to generate documentation files on demand in your Backstage backend using Tech Docs and MDX, you can find a complete guide on setting up a backend for Tech Docs [here](https://backstage.io/docs/features/techdocs/getting-started#adding-techdocs-backend-plugin).

**backend/src/plugins/techdocs.ts**

```ts
import { Generators } from '@backstage/plugin-techdocs-node';
import { TechDocsGenerator } from '@backstage/plugin-techdocs-mdx-node';

const generators = await Generators.fromConfig(config, options);
generators.register('techdocs', TechDocsGenerator.fromConfig(options));
```
