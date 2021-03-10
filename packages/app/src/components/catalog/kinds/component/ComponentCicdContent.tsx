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
import { EmptyState } from '@backstage/core';
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
import { Button, Grid } from '@material-ui/core';
import {
  isPluginApplicableToEntity as isBuildkiteAvailable,
  Router as BuildkiteRouter,
} from '@roadiehq/backstage-plugin-buildkite';
import {
  isPluginApplicableToEntity as isTravisCIAvailable,
  RecentTravisCIBuildsWidget,
  Router as TravisCIRouter,
} from '@roadiehq/backstage-plugin-travis-ci';
import React, { ReactNode } from 'react';

export const ComponentCicdContent = ({ entity }: { entity: Entity }) => {
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

export const RecentCICDRunsSwitcher = ({ entity }: { entity: Entity }) => {
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
