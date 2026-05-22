/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';
import { MarkdownContent } from '@backstage/core-components';

const content = `
## Welcome to Backstage! 👋

Backstage is your developer portal — a single place to manage all your
software, services, and documentation.

### Quick Start

- **Explore the catalog** — Browse all your organization's software in
  the [Software Catalog](/catalog)
- **Create something new** — Use a [Software Template](/create) to
  scaffold a new project in minutes
- **Read the docs** — Find technical documentation for any service
  right from its catalog page

### Helpful Links

- [Backstage Documentation](https://backstage.io/docs)
- [Customizing Your Homepage](https://backstage.io/docs/getting-started/homepage)
- [Adding Plugins](https://backstage.io/docs/plugins)
- [Contributing](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)

### How to Edit This Card

This widget is defined in \`packages/app/src/modules/home/homeModule.tsx\`.
You can update the markdown content there to welcome your team with
your own links and getting started tips.

To remove this card entirely, delete the file and remove the
\`appModuleHome\` import and reference from \`packages/app/src/App.tsx\`.
`;

const gettingStartedWidget = HomePageWidgetBlueprint.make({
  name: 'getting-started',
  params: {
    name: 'GettingStarted',
    title: 'Getting Started',
    description: 'Tips and links to help you get started with Backstage',
    components: async () => ({
      Content: () => <MarkdownContent content={content} />,
    }),
  },
});

export const appModuleHome = createFrontendModule({
  pluginId: 'home',
  extensions: [gettingStartedWidget],
});
