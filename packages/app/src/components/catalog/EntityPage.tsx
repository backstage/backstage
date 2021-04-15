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
  DomainEntity,
  Entity,
  GroupEntity,
  SystemEntity,
  UserEntity,
} from '@backstage/catalog-model';
import { EmptyState } from '@backstage/core';
import {
  ApiDefinitionCard,
  ConsumedApisCard,
  ConsumingComponentsCard,
  EntityHasApisCard,
  ProvidedApisCard,
  ProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import { EntityBadgesDialog } from '@backstage/plugin-badges';
import {
  AboutCard,
  EntityHasComponentsCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLinksCard,
  EntityPageLayout,
  EntitySystemDiagramCard,
} from '@backstage/plugin-catalog';
import { EntityProvider, useEntity } from '@backstage/plugin-catalog-react';
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
import { EntityTodoContent } from '@backstage/plugin-todo';
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
import React, { ReactNode, useMemo, useState } from 'react';
import BadgeIcon from '@material-ui/icons/CallToAction';
import { EntityGithubDeploymentsCard } from '@backstage/plugin-github-deployments';

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
    case isCloudbuildAvailable(entity):
      return <CloudbuildRouter entity={entity} />;
    case isTravisCIAvailable(entity):
      return <TravisCIRouter entity={entity} />;
    case isGitHubActionsAvailable(entity):
      return <GitHubActionsRouter entity={entity} />;
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
    case isTravisCIAvailable(entity):
      content = <RecentTravisCIBuildsWidget entity={entity} />;
      break;
    case isGitHubActionsAvailable(entity):
      content = (
        <RecentWorkflowRunsCard entity={entity} limit={4} variant="gridItem" />
      );
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

const EntityPageLayoutWrapper = (props: { children?: React.ReactNode }) => {
  const [badgesDialogOpen, setBadgesDialogOpen] = useState(false);

  const extraMenuItems = useMemo(() => {
    return [
      {
        title: 'Badges',
        Icon: BadgeIcon,
        onClick: () => setBadgesDialogOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <EntityPageLayout UNSTABLE_extraContextMenuItems={extraMenuItems}>
        {props.children}
      </EntityPageLayout>
      <EntityBadgesDialog
        open={badgesDialogOpen}
        onClose={() => setBadgesDialogOpen(false)}
      />
    </>
  );
};

const ComponentOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item xs={12} md={6}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    {isPagerDutyAvailable(entity) && (
      <Grid item xs={12} md={6}>
        <EntityProvider entity={entity}>
          <PagerDutyCard />
        </EntityProvider>
      </Grid>
    )}
    <Grid item xs={12} md={6}>
      <EntityLinksCard entity={entity} />
    </Grid>
    <RecentCICDRunsSwitcher entity={entity} />
    {isGitHubAvailable(entity) && (
      <>
        <Grid item xs={12} md={6}>
          <LanguagesCard entity={entity} />
          <ReleasesCard entity={entity} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReadMeCard entity={entity} maxHeight={350} />
        </Grid>
      </>
    )}
    {isLighthouseAvailable(entity) && (
      <Grid item xs={12} sm={4}>
        <LastLighthouseAuditCard variant="gridItem" />
      </Grid>
    )}
    {isPullRequestsAvailable(entity) && (
      <Grid item xs={12} sm={4}>
        <PullRequestsStatsCard entity={entity} />
      </Grid>
    )}
    <Grid item xs={12} md={6}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={6}>
      <EntityGithubDeploymentsCard />
    </Grid>
  </Grid>
);

const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item xs={12} md={6}>
      <ProvidedApisCard entity={entity} />
    </Grid>
    <Grid item xs={12} md={6}>
      <ConsumedApisCard entity={entity} />
    </Grid>
  </Grid>
);

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayoutWrapper>
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
    <EntityPageLayout.Content
      path="/todos"
      title="TODOs"
      element={<EntityTodoContent />}
    />
  </EntityPageLayoutWrapper>
);

const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayoutWrapper>
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
    <EntityPageLayout.Content
      path="/todos"
      title="TODOs"
      element={<EntityTodoContent />}
    />
  </EntityPageLayoutWrapper>
);

const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayoutWrapper>
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
    <EntityPageLayout.Content
      path="/todos"
      title="TODOs"
      element={<EntityTodoContent />}
    />
  </EntityPageLayoutWrapper>
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
  <EntityPageLayoutWrapper>
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
  </EntityPageLayoutWrapper>
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
  <EntityPageLayoutWrapper>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<UserOverviewContent entity={entity as UserEntity} />}
    />
  </EntityPageLayoutWrapper>
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
  <EntityPageLayoutWrapper>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<GroupOverviewContent entity={entity as GroupEntity} />}
    />
  </EntityPageLayoutWrapper>
);

const SystemOverviewContent = ({ entity }: { entity: SystemEntity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item md={6}>
      <EntityHasComponentsCard variant="gridItem" />
    </Grid>
    <Grid item md={6}>
      <EntityHasApisCard variant="gridItem" />
    </Grid>
  </Grid>
);

const SystemEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayoutWrapper>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<SystemOverviewContent entity={entity as SystemEntity} />}
    />
    <EntityPageLayout.Content
      path="/diagram/*"
      title="Diagram"
      element={<EntitySystemDiagramCard />}
    />
  </EntityPageLayoutWrapper>
);

const DomainOverviewContent = ({ entity }: { entity: DomainEntity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item md={6}>
      <EntityHasSystemsCard variant="gridItem" />
    </Grid>
  </Grid>
);

const DomainEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayoutWrapper>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<DomainOverviewContent entity={entity as DomainEntity} />}
    />
  </EntityPageLayoutWrapper>
);

export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLocaleLowerCase('en-US')) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    case 'group':
      return <GroupEntityPage entity={entity} />;
    case 'user':
      return <UserEntityPage entity={entity} />;
    case 'system':
      return <SystemEntityPage entity={entity} />;
    case 'domain':
      return <DomainEntityPage entity={entity} />;
    case 'location':
    case 'resource':
    case 'template':
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
