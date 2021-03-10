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
import {
  AboutCard,
  EntityHasSubcomponentsCard,
  EntityLinksCard,
} from '@backstage/plugin-catalog';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  isPluginApplicableToEntity as isLighthouseAvailable,
  LastLighthouseAuditCard,
} from '@backstage/plugin-lighthouse';
import {
  isPluginApplicableToEntity as isPagerDutyAvailable,
  PagerDutyCard,
} from '@backstage/plugin-pagerduty';
import { Grid } from '@material-ui/core';
import {
  isPluginApplicableToEntity as isGitHubAvailable,
  LanguagesCard,
  ReadMeCard,
  ReleasesCard,
} from '@roadiehq/backstage-plugin-github-insights';
import {
  isPluginApplicableToEntity as isPullRequestsAvailable,
  PullRequestsStatsCard,
} from '@roadiehq/backstage-plugin-github-pull-requests';
import React from 'react';
import { RecentCICDRunsSwitcher } from './ComponentCicdContent';

export const ComponentOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container alignItems="stretch">
    <Grid item md={6}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    {isPagerDutyAvailable(entity) && (
      <Grid item md={6}>
        <EntityProvider entity={entity}>
          <PagerDutyCard />
        </EntityProvider>
      </Grid>
    )}
    <Grid item md={4} sm={6}>
      <EntityLinksCard entity={entity} />
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
        <LastLighthouseAuditCard variant="gridItem" />
      </Grid>
    )}
    {isPullRequestsAvailable(entity) && (
      <Grid item sm={4}>
        <PullRequestsStatsCard entity={entity} />
      </Grid>
    )}
    <Grid item md={6}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);
