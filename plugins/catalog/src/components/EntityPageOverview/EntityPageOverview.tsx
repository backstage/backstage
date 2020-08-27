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

import { Entity } from '@backstage/catalog-model';
import { Content } from '@backstage/core';
import { SentryIssuesWidget } from '@backstage/plugin-sentry';
import { Widget as GithubActionsWidget } from '@backstage/plugin-github-actions';
import {
  JenkinsBuildsWidget,
  JenkinsLastBuildWidget,
} from '@backstage/plugin-jenkins';
import { Grid } from '@material-ui/core';
import React, { FC } from 'react';
import { EntityMetadataCard } from '../EntityMetadataCard/EntityMetadataCard';

export const EntityPageOverview: FC<{ entity: Entity }> = ({ entity }) => {
  return (
    <Content>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <EntityMetadataCard entity={entity} />
        </Grid>
        {entity.metadata?.annotations?.[
          'backstage.io/jenkins-github-folder'
        ] && (
          <Grid item sm={4}>
            <JenkinsLastBuildWidget entity={entity} branch="master" />
          </Grid>
        )}
        {entity.metadata?.annotations?.[
          'backstage.io/jenkins-github-folder'
        ] && (
          <Grid item sm={8}>
            <JenkinsBuildsWidget entity={entity} />
          </Grid>
        )}
        {entity.metadata?.annotations?.['backstage.io/github-actions-id'] && (
          <Grid item sm={3}>
            <GithubActionsWidget entity={entity} branch="master" />
          </Grid>
        )}
        <Grid item sm={8}>
          <SentryIssuesWidget
            sentryProjectId="sample-sentry-project-id"
            statsFor="24h"
          />
        </Grid>
      </Grid>
    </Content>
  );
};
