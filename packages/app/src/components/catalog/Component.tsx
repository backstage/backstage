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
import React from 'react';
import {
  GitHubActionsPlugin,
  GITHUB_ACTIONS_ANNOTATION,
} from '@backstage/plugin-github-actions';
import {
  useEntity,
  EntityPageTabs as Tabs,
  EntityMetadataCard,
} from '@backstage/plugin-catalog';
import { Grid } from '@material-ui/core';

const OverviewPage = () => {
  const entity = useEntity();
  return (
    <Grid item sm={4}>
      <EntityMetadataCard entity={entity} />
    </Grid>
  );
};

// Just for illustration purposes, gonna live in plugin-circle-ci
const CIRCLE_CI_ANNOTATION = 'circle-ci-slug-dummy';

const DefaultEntity = () => {
  const entity = useEntity();

  const isCIAvailable = [
    entity!.metadata!.annotations?.[GITHUB_ACTIONS_ANNOTATION],
    entity!.metadata!.annotations?.[CIRCLE_CI_ANNOTATION],
  ].some(Boolean);

  return (
    <Tabs>
      <Tabs.Tab title="Overview" path="/" exact>
        <OverviewPage />
      </Tabs.Tab>
      {isCIAvailable && (
        <Tabs.Tab title="CI/CD" path="/ci-cd">
          {entity!.metadata!.annotations?.[GITHUB_ACTIONS_ANNOTATION] && (
            <GitHubActionsPlugin entity={entity} />
          )}
        </Tabs.Tab>
      )}
      <Tabs.Tab title="Docs" path="/docs">
        {/* eslint-disable-next-line no-console */}
        <div>{console.log('was here /docs')}Docs tab contents</div>
      </Tabs.Tab>
    </Tabs>
  );
};

const Service = () => <DefaultEntity />;
const Website = () => <DefaultEntity />;
const UnkownEntity = () => <div>Unknown entity!</div>;

export const ComponentEntity = () => {
  const entity = useEntity();
  switch (entity.spec!.type) {
    case 'service':
      return <Service />;
    case 'website':
      return <Website />;
    default:
      return <UnkownEntity />;
  }
};
