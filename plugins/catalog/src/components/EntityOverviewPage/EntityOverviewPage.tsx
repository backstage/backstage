import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { Content } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { EntityMetadataCard } from '../EntityMetadataCard/EntityMetadataCard';
import {
  JenkinsLastBuildWidget,
  JenkinsBuildsWidget,
} from '@backstage/plugin-jenkins';
import { Widget as GithubActionsWidget } from '@backstage/plugin-github-actions';
import { SentryIssuesWidget } from '@backstage/plugin-sentry';

export const EntityOverviewPage = ({ entity }: { entity: Entity }) => {
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
      </Grid>
      <Grid item sm={8}>
        <SentryIssuesWidget
          sentryProjectId="sample-sentry-project-id"
          statsFor="24h"
        />
      </Grid>
    </Content>
  );
};
