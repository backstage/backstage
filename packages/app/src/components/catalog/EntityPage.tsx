/*
 * Copyright 2020 The Backstage Authors
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
  Entity,
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { EmptyState } from '@backstage/core-components';
import {
  EntityApiDefinitionCard,
  EntityConsumedApisCard,
  EntityConsumingComponentsCard,
  EntityHasApisCard,
  EntityProvidedApisCard,
  EntityProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import {
  EntityAzurePipelinesContent,
  EntityAzureGitTagsContent,
  EntityAzurePullRequestsContent,
  isAzureDevOpsAvailable,
  isAzurePipelinesAvailable,
} from '@backstage/plugin-azure-devops';
import {
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLayout,
  EntityLinksCard,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  EntitySwitch,
  hasCatalogProcessingErrors,
  isComponentType,
  isKind,
  isOrphan,
} from '@internal/plugin-catalog-customized';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  EntityCircleCIContent,
  isCircleCIAvailable,
} from '@backstage/plugin-circleci';
import {
  EntityCloudbuildContent,
  isCloudbuildAvailable,
} from '@backstage/plugin-cloudbuild';
import { EntityCodeCoverageContent } from '@backstage/plugin-code-coverage';
import {
  DynatraceTab,
  isDynatraceAvailable,
} from '@backstage/plugin-dynatrace';
import {
  EntityGithubActionsContent,
  EntityRecentGithubActionsRunsCard,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import {
  EntityJenkinsContent,
  EntityLatestJenkinsRunCard,
  isJenkinsAvailable,
} from '@backstage/plugin-jenkins';
import { EntityKafkaContent } from '@backstage/plugin-kafka';
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';
import {
  EntityLastLighthouseAuditCard,
  EntityLighthouseContent,
  isLighthouseAvailable,
} from '@backstage/plugin-lighthouse';
import {
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
  EntityUserProfileCard,
} from '@backstage/plugin-org';
import {
  EntityPagerDutyCard,
  isPagerDutyAvailable,
} from '@backstage/plugin-pagerduty';
import {
  EntityRollbarContent,
  isRollbarAvailable,
} from '@backstage/plugin-rollbar';
import { EntitySentryContent } from '@backstage/plugin-sentry';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { EntityTechInsightsScorecardCard } from '@backstage/plugin-tech-insights';
import { EntityTodoContent } from '@backstage/plugin-todo';
import { Button, Grid } from '@material-ui/core';

import {
  EntityGithubInsightsContent,
  EntityGithubInsightsLanguagesCard,
  EntityGithubInsightsReadmeCard,
  EntityGithubInsightsReleasesCard,
  isGithubInsightsAvailable,
} from '@roadiehq/backstage-plugin-github-insights';
import {
  EntityGithubPullRequestsContent,
  EntityGithubPullRequestsOverviewCard,
  isGithubPullRequestsAvailable,
} from '@roadiehq/backstage-plugin-github-pull-requests';
import {
  EntityTravisCIContent,
  EntityTravisCIOverviewCard,
  isTravisciAvailable,
} from '@roadiehq/backstage-plugin-travis-ci';
import {
  EntityBuildkiteContent,
  isBuildkiteAvailable,
} from '@roadiehq/backstage-plugin-buildkite';
import {
  isNewRelicDashboardAvailable,
  EntityNewRelicDashboardContent,
  EntityNewRelicDashboardCard,
} from '@backstage/plugin-newrelic-dashboard';
import { EntityGoCdContent, isGoCdAvailable } from '@backstage/plugin-gocd';
import { EntityScoreCardContent } from '@oriflame/backstage-plugin-score-card';

import React from 'react';

import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  TextSize,
  ReportIssue,
} from '@backstage/plugin-techdocs-module-addons-contrib';
import { EntityCostInsightsContent } from '@backstage/plugin-cost-insights';
import { makePageEntries, makePageSwitch } from './page-entries';
import { EntityLayoutWrapper } from './EntityLayoutWrapper';

const customEntityFilterKind = ['Component', 'API', 'System'];

const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <TextSize />
      <ReportIssue />
    </TechDocsAddons>
  </EntityTechdocsContent>
);

/**
 * NOTE: This page is designed to work on small screens such as mobile devices.
 * This is based on Material UI Grid. If breakpoints are used, each grid item must set the `xs` prop to a column size or to `true`,
 * since this does not default. If no breakpoints are used, the items will equitably share the available space.
 * https://material-ui.com/components/grid/#basic-grid.
 */

export const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isJenkinsAvailable}>
      <EntityJenkinsContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isBuildkiteAvailable}>
      <EntityBuildkiteContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isCircleCIAvailable}>
      <EntityCircleCIContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isCloudbuildAvailable}>
      <EntityCloudbuildContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isTravisciAvailable}>
      <EntityTravisCIContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGoCdAvailable}>
      <EntityGoCdContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubActionsContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isAzurePipelinesAvailable}>
      <EntityAzurePipelinesContent defaultLimit={25} />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
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
    </EntitySwitch.Case>
  </EntitySwitch>
);

const cicdCard = (
  <EntitySwitch>
    <EntitySwitch.Case if={isJenkinsAvailable}>
      <Grid item sm={6}>
        <EntityLatestJenkinsRunCard branch="master" variant="gridItem" />
      </Grid>
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isTravisciAvailable as (e: Entity) => boolean}>
      <Grid item sm={6}>
        <EntityTravisCIOverviewCard />
      </Grid>
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <Grid item sm={6}>
        <EntityRecentGithubActionsRunsCard limit={4} variant="gridItem" />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
);

const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

const errorsContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isRollbarAvailable}>
      <EntityRollbarContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EntitySentryContent />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const pullRequestsContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isAzureDevOpsAvailable}>
      <EntityAzurePullRequestsContent defaultLimit={25} />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EntityGithubPullRequestsContent />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item md={6} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>

    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <EntitySwitch>
      <EntitySwitch.Case if={isPagerDutyAvailable}>
        <Grid item md={6}>
          <EntityPagerDutyCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isNewRelicDashboardAvailable}>
        <Grid item md={6} xs={12}>
          <EntityNewRelicDashboardCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>

    {cicdCard}

    <EntitySwitch>
      <EntitySwitch.Case if={isGithubInsightsAvailable}>
        <Grid item md={6}>
          <EntityGithubInsightsLanguagesCard />
          <EntityGithubInsightsReleasesCard />
        </Grid>
        <Grid item md={6}>
          <EntityGithubInsightsReadmeCard maxHeight={350} />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isLighthouseAvailable}>
        <Grid item sm={4}>
          <EntityLastLighthouseAuditCard variant="gridItem" />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isGithubPullRequestsAvailable}>
        <Grid item sm={4}>
          <EntityGithubPullRequestsOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);

export const componentPageEntries = makePageEntries({
  overview: {
    path: '/',
    title: 'Overview',
    content: overviewContent,
  },
  cicd: {
    path: '/ci-cd',
    title: 'CI/CD',
    content: cicdContent,
  },
  lighthouse: {
    path: '/lighthouse',
    title: 'Lighthouse',
    content: <EntityLighthouseContent />,
  },
  errors: {
    path: '/errors',
    title: 'Errors',
    content: errorsContent,
  },
  api: {
    path: '/api',
    title: 'API',
    content: (
      <>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <EntityProvidedApisCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityConsumedApisCard />
          </Grid>
        </Grid>
      </>
    ),
  },
  dependencies: {
    path: '/dependencies',
    title: 'Dependencies',
    content: (
      <>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </>
    ),
  },
  docs: {
    path: '/docs',
    title: 'Docs',
    content: techdocsContent,
  },
  newrelic: {
    path: '/newrelic-dashboard',
    title: 'New Relic Dashboard',
    if: isNewRelicDashboardAvailable,
    content: <EntityNewRelicDashboardContent />,
  },
  kubernetes: {
    path: '/kubernetes',
    title: 'Kubernetes',
    content: <EntityKubernetesContent />,
  },
  azureGitTags: {
    path: '/git-tags',
    title: 'Git Tags',
    content: <EntityAzureGitTagsContent />,
    if: isAzureDevOpsAvailable,
  },
  pullRequests: {
    path: '/pull-requests',
    title: 'Pull Requests',
    content: pullRequestsContent,
  },
  codeInsights: {
    path: '/code-insights',
    title: 'Code Insights',
    content: <EntityGithubInsightsContent />,
  },
  techInsights: {
    path: '/tech-insights',
    title: 'Scorecards',
    content: (
      <>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <EntityTechInsightsScorecardCard
              title="Scorecard 1"
              description="This is a sample scorecard no. 1"
              checksId={['titleCheck']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityTechInsightsScorecardCard
              title="Scorecard 2"
              checksId={['techDocsCheck']}
            />
          </Grid>
        </Grid>
      </>
    ),
  },
  codeCoverage: {
    path: '/code-coverage',
    title: 'Code Coverage',
    content: <EntityCodeCoverageContent />,
  },
  kafka: {
    path: '/kafka',
    title: 'Kafka',
    content: <EntityKafkaContent />,
  },
  todos: {
    path: '/todos',
    title: 'TODOs',
    content: <EntityTodoContent />,
  },
  costs: {
    path: '/costs',
    title: 'Costs',
    content: <EntityCostInsightsContent />,
  },
  dynatrace: {
    path: '/dynatrace',
    title: 'Dynatrace',
    content: <DynatraceTab />,
    if: isDynatraceAvailable,
  },
});

export const serviceComponentPageEntries = [
  componentPageEntries.overview,
  componentPageEntries.cicd,
  componentPageEntries.errors,
  componentPageEntries.api,
  componentPageEntries.dependencies,
  componentPageEntries.docs,
  componentPageEntries.newrelic,
  componentPageEntries.kubernetes,
  componentPageEntries.pullRequests,
  componentPageEntries.codeInsights,
  componentPageEntries.techInsights,
  componentPageEntries.codeCoverage,
  componentPageEntries.kafka,
  componentPageEntries.todos,
  componentPageEntries.costs,
  componentPageEntries.dynatrace,
];

export const websiteComponentPageEntries = [
  componentPageEntries.overview,
  componentPageEntries.cicd,
  componentPageEntries.lighthouse,
  componentPageEntries.errors,
  componentPageEntries.dependencies,
  componentPageEntries.docs,
  componentPageEntries.newrelic,
  componentPageEntries.kubernetes,
  componentPageEntries.dynatrace,
  componentPageEntries.azureGitTags,
  componentPageEntries.pullRequests,
  componentPageEntries.codeInsights,
  componentPageEntries.codeCoverage,
  componentPageEntries.todos,
];

export const defaultPageEntries = [
  componentPageEntries.overview,
  componentPageEntries.docs,
  componentPageEntries.todos,
];

export const componentPageSwitch = makePageSwitch([
  {
    if: isComponentType('service'),
    entries: serviceComponentPageEntries,
  },
  {
    if: isComponentType('website'),
    entries: websiteComponentPageEntries,
  },
  {
    entries: defaultPageEntries,
  },
]);

const componentPage = (
  <EntitySwitch>
    {componentPageSwitch.map(({ entitySwitchCase }) => entitySwitchCase)}
  </EntitySwitch>
);

const apiPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item md={6} xs={12}>
          <EntityAboutCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <EntityProvidingComponentsCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <EntityConsumingComponentsCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/definition" title="Definition">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const userPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard
            variant="gridItem"
            entityFilterKind={customEntityFilterKind}
          />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const groupPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityGroupProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard
            variant="gridItem"
            entityFilterKind={customEntityFilterKind}
          />
        </Grid>
        <Grid item xs={12}>
          <EntityMembersListCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const systemPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={6}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/score" title="Score">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <EntityScoreCardContent />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntityCatalogGraphCard
        variant="gridItem"
        direction={Direction.TOP_BOTTOM}
        title="System Diagram"
        height={700}
        relations={[
          RELATION_PART_OF,
          RELATION_HAS_PART,
          RELATION_API_CONSUMED_BY,
          RELATION_API_PROVIDED_BY,
          RELATION_CONSUMES_API,
          RELATION_PROVIDES_API,
          RELATION_DEPENDENCY_OF,
          RELATION_DEPENDS_ON,
        ]}
        unidirectional={false}
      />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const domainPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={6}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>
      <EntityLayoutWrapper>
        {defaultPageEntries.map(({ route }) => route)}
      </EntityLayoutWrapper>
    </EntitySwitch.Case>
  </EntitySwitch>
);
