/*
 * Copyright 2021 The Backstage Authors
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
import { V1Job } from '@kubernetes/client-node';
import { KubernetesStructuredMetadataTableDrawer } from '../KubernetesDrawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const JobDrawer = ({
  job,
  expanded,
}: {
  job: V1Job;
  expanded?: boolean;
}) => {
  return (
    <KubernetesStructuredMetadataTableDrawer
      object={job}
      expanded={expanded}
      kind="Job"
      renderObject={(jobObj: V1Job) => {
        return {
          parallelism: jobObj.spec?.parallelism ?? '???',
          completions: jobObj.spec?.completions ?? '???',
          backoffLimit: jobObj.spec?.backoffLimit ?? '???',
          startTime: jobObj.status?.startTime ?? '???',
        };
      }}
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
            {job.metadata?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="subtitle1">
            Job
          </Typography>
        </Grid>
      </Grid>
    </KubernetesStructuredMetadataTableDrawer>
  );
};
