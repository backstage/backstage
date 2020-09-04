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

// TODO(shmidt-i): move to the app
import { Entity } from '@backstage/catalog-model';
import { Content } from '@backstage/core';
import { LatestWorkflowsForBranchCard } from '@backstage/plugin-github-actions';
import { Grid } from '@material-ui/core';
import React, { FC } from 'react';

export const EntityPageCi: FC<{ entity: Entity }> = ({ entity }) => {
  return (
    <Content>
      <Grid container spacing={3}>
        {entity.metadata?.annotations?.['backstage.io/github-actions-id'] && (
          <Grid item sm={12}>
            <LatestWorkflowsForBranchCard entity={entity} branch="master" />
          </Grid>
        )}
      </Grid>
    </Content>
  );
};
