/*
 * Copyright 2020 Spotify AB
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

import { createPlugin } from '@backstage/core';
import { ApiCatalogPage } from './components/ApiCatalogPage/ApiCatalogPage';
import { ApiEntityPage } from './components/ApiEntityPage/ApiEntityPage';
import { entityRoute, rootRoute } from './routes';

export const plugin = createPlugin({
  id: 'api-docs',
  register({ router }) {
    router.addRoute(rootRoute, ApiCatalogPage);
    router.addRoute(entityRoute, ApiEntityPage);
  },
});

// catalog/Component/playback-order/ci-cd
// 1. catalog/Component/playback-order/ - Overview with different metadata cards
// 1. catalog/Component/playback-order/ci-cd  - [GitHub Actions] table with all builds - visible only if applicable to the entity
// 1. catalog/Component/playback-order/ci-cd/31523221 - [GitHub Actions] detailed build view - visible only if applicable to the entity
// 1. catalog/Component/playback-order/ci-cd  - [CircleCI] table with all builds - visible only if applicable to the entity
// 1. catalog/Component/playback-order/ci-cd/15417989 - [CircleCI] detailed build view - visible only if applicable to the entity
// 1. catalog/Component/playback-order/docs - tech docs - visible only if applicable to the entity
// 1. catalog/Component/playback-order/docs/how-to/2/3/5 - tech docs - visible only if applicable to the entity
// 1. catalog/Component/playback-order/api - api docs - visible only if applicable to the entity

/**
 * 
 const SpotifyCiCdPage = () => (
  <Switch>
    <GithubWorkflowPage>
      <GithubWorkflowListPage />
      <GithubWorkflowDetailsPage />
    </GithubWorkflowPage>

    <CircleCiWorkflowPage>
      <CircleCiWorkflowListPage />
      <CircleCiWorkflowDetailsPage />
    </CircleCiWorkflowPage>
  </Switch>
);

 */

//*****************     JSX - based approach */
/** 
const App = (
  <>
    <CatalogPage>
      <ComponentList />
    </CatalogPage>

    //pages/components/service.tsx 
    <EntityContext filters={[kind('Component'), type('service')]}>
      <TabbedPage>
        <CardPage>
          <ReadmeCard />
          <GitHubWorkflowsCard />
          <MetadataCard />
        </CardPage>

        <SpotifyCiCdPage />
      </TabbedPage>
    </EntityContext>

//pages/components/website.tsx
    <EntityContext filters={[kind('Component'), type('website')]}>
      <TabbedPage>
        <TabbedPage.Tab title="Overview">
          <CardPage>
            <ReadmeCard size={2} />
            <LighthouseCard size={4} />
            <GitHubWorkflowsCard />
            <MetadataCard />
          </CardPage>
        </TabbedPage.Tab>

        <TabbedPage.Tab title="CI/CD">
          <SpotifyCiCdPage />
        </TabbedPage.Tab>
      </TabbedPage>
    </EntityContext>

    <ScaffolderPage>
      <ScaffolderTemplates />
    </ScaffolderPage>

    <GraphiQLPage>
      <GitHubEndpoint />
      <GitLabEndpoint />
      <BackstageEndpoint />
    </GraphiQLPage>
  </>
);
 */

//*****************     File structure - based approach */

/**
packages/app/src/catalog
├── service
│   ├── CICD.tsx
│   └── Overview.tsx
└── website
    ├── CICD.tsx
    └── Overview.tsx
 */
