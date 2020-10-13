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
import {
  isPluginApplicableToEntity as isTravisCIAvailable,
  RecentTravisCIBuildsWidget,
  Router as TravisCIRouter,
} from '@roadiehq/backstage-plugin-travis-ci';
import {
  isPluginApplicableToEntity as isGitHubActionsAvailable,
  RecentWorkflowRunsCard,
  Router as GitHubActionsRouter,
} from '@backstage/plugin-github-actions';
import {
  Router as CloudbuildRouter,
  isPluginApplicableToEntity as isCloudbuildAvailable,
} from '@backstage/plugin-cloudbuild';
import {
  Router as JenkinsRouter,
  isPluginApplicableToEntity as isJenkinsAvailable,
  LatestRunCard as JenkinsLatestRunCard,
} from '@backstage/plugin-jenkins';
import {
  isPluginApplicableToEntity as isCircleCIAvailable,
  Router as CircleCIRouter,
} from '@backstage/plugin-circleci';
import { Router as ApiDocsRouter } from '@backstage/plugin-api-docs';
import { Router as SentryRouter } from '@backstage/plugin-sentry';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as KubernetesRouter } from '@backstage/plugin-kubernetes';
import {
  Router as GitHubInsightsRouter,
  isPluginApplicableToEntity as isGitHubAvailable,
  ReadMeCard,
  LanguagesCard,
  ReleasesCard,
} from '@roadiehq/backstage-plugin-github-insights';
import React, { ReactNode } from 'react';
import {
  AboutCard,
  EntityPageLayout,
  useEntity,
} from '@backstage/plugin-catalog';
import { Entity } from '@backstage/catalog-model';
import { Button, Grid } from '@material-ui/core';
import { EmptyState } from '@backstage/core';
import {
  EmbeddedRouter as LighthouseRouter,
  LastLighthouseAuditCard,
  isPluginApplicableToEntity as isLighthouseAvailable,
} from '@backstage/plugin-lighthouse/';

const CICDSwitcher = ({ entity }: { entity: Entity }) => {
  // This component is just an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  switch (true) {
    case isJenkinsAvailable(entity):
      return <JenkinsRouter entity={entity} />;
    case isGitHubActionsAvailable(entity):
      return <GitHubActionsRouter entity={entity} />;
    case isCircleCIAvailable(entity):
      return <CircleCIRouter entity={entity} />;
    case isCloudbuildAvailable(entity):
      return <CloudbuildRouter entity={entity} />;
    case isTravisCIAvailable(entity):
      return <TravisCIRouter entity={entity} />;
    default:
      return (
        <EmptyState
          title="No CI/CD available for this entity"
          missing="info"
          description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
          action={
            <Button
              variant="contained"
              color="primary"
              href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
            >
              Read more
            </Button>
          }
        />
      );
  }
};

const RecentCICDRunsSwitcher = ({ entity }: { entity: Entity }) => {
  let content: ReactNode;
  switch (true) {
    case isJenkinsAvailable(entity):
      content = <JenkinsLatestRunCard branch="master" />;
      break;
    case isGitHubActionsAvailable(entity):
      content = <RecentWorkflowRunsCard entity={entity} />;
      break;
    case isTravisCIAvailable(entity):
      content = <RecentTravisCIBuildsWidget entity={entity} />;
      break;
    default:
      content = null;
  }
  if (!content) {
    return null;
  }
  return (
    <Grid item sm={6}>
      {content}
    </Grid>
  );
};

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    <Grid item md={6}>
      <AboutCard entity={entity} />
    </Grid>
    <RecentCICDRunsSwitcher entity={entity} />
    {isGitHubAvailable(entity) && (
      <>
        <Grid item md={6}>
          <LanguagesCard entity={entity} />
          <ReleasesCard entity={entity} />
        </Grid>
        <Grid item md={6}>
          <ReadMeCard entity={entity} maxHeight={350} />
        </Grid>
      </>
    )}
    {isLighthouseAvailable(entity) && (
      <Grid item sm={4}>
        <LastLighthouseAuditCard />
      </Grid>
    )}
  </Grid>
);

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/sentry"
      title="Sentry"
      element={<SentryRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api/*"
      title="API"
      element={<ApiDocsRouter entity={entity} />}
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
      path="/code-insights"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/lighthouse/*"
      title="Lighthouse"
      element={<LighthouseRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/sentry"
      title="Sentry"
      element={<SentryRouter entity={entity} />}
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
      path="/code-insights"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
);
const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

export const EntityPage = () => {
  const { entity } = useEntity();
  switch (entity?.spec?.type) {
    case 'service':
      return <ServiceEntityPage entity={entity} />;
    case 'website':
      return <WebsiteEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
