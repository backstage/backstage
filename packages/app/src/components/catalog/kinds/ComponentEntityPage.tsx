/*
 * Copyright 2021 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { EntityPageLayout } from '@backstage/plugin-catalog';
import { Router as KafkaRouter } from '@backstage/plugin-kafka';
import { Router as KubernetesRouter } from '@backstage/plugin-kubernetes';
import { EmbeddedRouter as LighthouseRouter } from '@backstage/plugin-lighthouse';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as GitHubInsightsRouter } from '@roadiehq/backstage-plugin-github-insights';
import { Router as PullRequestsRouter } from '@roadiehq/backstage-plugin-github-pull-requests';
import React from 'react';
import { ComponentApisContent } from './component/ComponentApisContent';
import { ComponentCicdContent } from './component/ComponentCicdContent';
import { ComponentErrorsContent } from './component/ComponentErrorsContent';
import { ComponentOverviewContent } from './component/ComponentOverviewContent';
import { DefaultEntityPage } from './DefaultEntityPage';

const ServicePage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<ComponentCicdContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/errors/*"
      title="Errors"
      element={<ComponentErrorsContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api/*"
      title="API"
      element={<ComponentApisContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/kubernetes/*"
      title="Kubernetes"
      element={<KubernetesRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/pull-requests"
      title="Pull Requests"
      element={<PullRequestsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/code-insights"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/kafka/*"
      title="Kafka"
      element={<KafkaRouter entity={entity} />}
    />
  </EntityPageLayout>
);

const WebsitePage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<ComponentCicdContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/lighthouse/*"
      title="Lighthouse"
      element={<LighthouseRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/errors/*"
      title="Errors"
      element={<ComponentErrorsContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/kubernetes/*"
      title="Kubernetes"
      element={<KubernetesRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/pull-requests"
      title="Pull Requests"
      element={<PullRequestsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/code-insights"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  switch (entity?.spec?.type) {
    case 'service':
      return <ServicePage entity={entity} />;
    case 'website':
      return <WebsitePage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
