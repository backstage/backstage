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
  ApiEntity,
  Entity,
  GroupEntity,
  UserEntity,
} from '@backstage/catalog-model';
import { EmptyState } from '@backstage/core';
import {
  ApiDefinitionCard,
  ConsumedApisCard,
  ConsumingComponentsCard,
  ProvidedApisCard,
  ProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import { AboutCard, EntityPageLayout } from '@backstage/plugin-catalog';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  isPluginApplicableToEntity as isCircleCIAvailable,
  Router as CircleCIRouter,
} from '@backstage/plugin-circleci';
import {
  isPluginApplicableToEntity as isCloudbuildAvailable,
  Router as CloudbuildRouter,
} from '@backstage/plugin-cloudbuild';
import {
  isPluginApplicableToEntity as isGitHubActionsAvailable,
  RecentWorkflowRunsCard,
  Router as GitHubActionsRouter,
} from '@backstage/plugin-github-actions';
import {
  isPluginApplicableToEntity as isJenkinsAvailable,
  LatestRunCard as JenkinsLatestRunCard,
  Router as JenkinsRouter,
} from '@backstage/plugin-jenkins';
import { Router as KafkaRouter } from '@backstage/plugin-kafka';
import { Router as KubernetesRouter } from '@backstage/plugin-kubernetes';
import {
  EmbeddedRouter as LighthouseRouter,
  isPluginApplicableToEntity as isLighthouseAvailable,
  LastLighthouseAuditCard,
} from '@backstage/plugin-lighthouse';
import {
  GroupProfileCard,
  MembersListCard,
  OwnershipCard,
  UserProfileCard,
} from '@backstage/plugin-org';
import {
  isPluginApplicableToEntity as isPagerDutyAvailable,
  PagerDutyCard,
} from '@backstage/plugin-pagerduty';
import {
  isRollbarAvailable,
  Router as RollbarRouter,
} from '@backstage/plugin-rollbar';
import { Router as SentryRouter } from '@backstage/plugin-sentry';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';
import { Button, Grid } from '@material-ui/core';
import {
  isPluginApplicableToEntity as isBuildkiteAvailable,
  Router as BuildkiteRouter,
} from '@roadiehq/backstage-plugin-buildkite';
import {
  isPluginApplicableToEntity as isGitHubAvailable,
  LanguagesCard,
  ReadMeCard,
  ReleasesCard,
  Router as GitHubInsightsRouter,
} from '@roadiehq/backstage-plugin-github-insights';
import {
  isPluginApplicableToEntity as isPullRequestsAvailable,
  PullRequestsStatsCard,
  Router as PullRequestsRouter,
} from '@roadiehq/backstage-plugin-github-pull-requests';
import {
  isPluginApplicableToEntity as isTravisCIAvailable,
  RecentTravisCIBuildsWidget,
  Router as TravisCIRouter,
} from '@roadiehq/backstage-plugin-travis-ci';
import React, { ReactNode } from 'react';

export const CICDSwitcher = ({ entity }: { entity: Entity }) => {
  // This component is just an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  switch (true) {
    case isJenkinsAvailable(entity):
      return <JenkinsRouter entity={entity} />;
    case isBuildkiteAvailable(entity):
      return <BuildkiteRouter entity={entity} />;
    case isCircleCIAvailable(entity):
      return <CircleCIRouter entity={entity} />;
    case isGitHubActionsAvailable(entity):
      return <GitHubActionsRouter entity={entity} />;
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
      content = <JenkinsLatestRunCard branch="master" variant="gridItem" />;
      break;
    case isGitHubActionsAvailable(entity):
      content = (
        <RecentWorkflowRunsCard entity={entity} limit={4} variant="gridItem" />
      );
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

export const ErrorsSwitcher = ({ entity }: { entity: Entity }) => {
  switch (true) {
    case isRollbarAvailable(entity):
      return <RollbarRouter entity={entity} />;
    default:
      return <SentryRouter entity={entity} />;
  }
};

const ComponentOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    {isPagerDutyAvailable(entity) && (
      <Grid item md={6}>
        <PagerDutyCard entity={entity} />
      </Grid>
    )}
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
        <LastLighthouseAuditCard variant="gridItem" />
      </Grid>
    )}
    {isPullRequestsAvailable(entity) && (
      <Grid item sm={4}>
        <PullRequestsStatsCard entity={entity} />
      </Grid>
    )}
  </Grid>
);

const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <ProvidedApisCard entity={entity} />
    </Grid>
    <Grid item md={6}>
      <ConsumedApisCard entity={entity} />
    </Grid>
  </Grid>
);

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/errors/*"
      title="Errors"
      element={<ErrorsSwitcher entity={entity} />}
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

const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
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
      path="/errors/*"
      title="Errors"
      element={<ErrorsSwitcher entity={entity} />}
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

const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<ComponentOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  switch (entity?.spec?.type) {
    case 'service':
      return <ServiceEntityPage entity={entity} />;
    case 'website':
      return <WebsiteEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};

const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    <Grid item md={6}>
      <AboutCard entity={entity} />
    </Grid>
    <Grid container item md={12}>
      <Grid item md={6}>
        <ProvidingComponentsCard entity={entity} />
      </Grid>
      <Grid item md={6}>
        <ConsumingComponentsCard entity={entity} />
      </Grid>
    </Grid>
  </Grid>
);

const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <ApiDefinitionCard apiEntity={entity} />
    </Grid>
  </Grid>
);

const ApiEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<ApiOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/definition/*"
      title="Definition"
      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
    />
  </EntityPageLayout>
);

const UserOverviewContent = ({ entity }: { entity: UserEntity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <UserProfileCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={6}>
      <OwnershipCard entity={entity} variant="gridItem" />
    </Grid>
  </Grid>
);

const UserEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<UserOverviewContent entity={entity as UserEntity} />}
    />
  </EntityPageLayout>
);

const GroupOverviewContent = ({ entity }: { entity: GroupEntity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <GroupProfileCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={6}>
      <OwnershipCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item xs={12}>
      <MembersListCard entity={entity} />
    </Grid>
  </Grid>
);

const GroupEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<GroupOverviewContent entity={entity as GroupEntity} />}
    />
  </EntityPageLayout>
);

export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLowerCase()) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    case 'group':
      return <GroupEntityPage entity={entity} />;
    case 'user':
      return <UserEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
