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

import React from 'react';
import { KubernetesStructuredMetadataTableDrawer } from '../../KubernetesDrawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

export const RolloutDrawer = ({
  rollout,
  expanded,
}: {
  rollout: any;
  expanded?: boolean;
}) => {
  const namespace = rollout.metadata?.namespace;
  return (
    <KubernetesStructuredMetadataTableDrawer
      object={rollout}
      expanded={expanded}
      kind="Rollout"
      renderObject={() => ({})}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item>
          <Typography variant="body1">
            {rollout.metadata?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="subtitle1">
            Rollout
          </Typography>
        </Grid>
        {namespace && (
          <Grid item>
            <Chip size="small" label={`namespace: ${namespace}`} />
          </Grid>
        )}
      </Grid>
    </KubernetesStructuredMetadataTableDrawer>
  );
};
