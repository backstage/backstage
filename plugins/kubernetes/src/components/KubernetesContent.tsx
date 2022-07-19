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

import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { ErrorPanel } from './ErrorPanel';
import { ErrorReporting } from './ErrorReporting';
import { DetectedError, detectErrors } from '../error-detection';
import { Cluster } from './Cluster';
import EmptyStateImage from '../assets/emptystate.svg';
import { useKubernetesObjects } from '../hooks';
import { Content, Page, Progress } from '@backstage/core-components';

type KubernetesContentProps = {
  entity: Entity;
  refreshIntervalMs?: number;
  children?: React.ReactNode;
};

export const KubernetesContent = ({
  entity,
  refreshIntervalMs,
}: KubernetesContentProps) => {
  const { kubernetesObjects, error } = useKubernetesObjects(
    entity,
    refreshIntervalMs,
  );

  const clustersWithErrors =
    kubernetesObjects?.items.filter(r => r.errors.length > 0) ?? [];

  const detectedErrors =
    kubernetesObjects !== undefined
      ? detectErrors(kubernetesObjects)
      : new Map<string, DetectedError[]>();

  return (
    <Page themeId="tool">
      <Content>
        {kubernetesObjects === undefined && error === undefined && <Progress />}

        {/* errors retrieved from the kubernetes clusters */}
        {clustersWithErrors.length > 0 && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                clustersWithErrors={clustersWithErrors}
              />
            </Grid>
          </Grid>
        )}

        {/* other errors */}
        {error !== undefined && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                errorMessage={error}
              />
            </Grid>
          </Grid>
        )}

        {kubernetesObjects && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorReporting detectedErrors={detectedErrors} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Typography variant="h3">Your Clusters</Typography>
            </Grid>
            <Grid item container>
              {kubernetesObjects?.items.length <= 0 && (
                <Grid
                  container
                  justifyContent="space-around"
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={4}>
                    <Typography variant="h5">
                      No resources on any known clusters for{' '}
                      {entity.metadata.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      src={EmptyStateImage}
                      alt="EmptyState"
                      data-testid="emptyStateImg"
                    />
                  </Grid>
                </Grid>
              )}
              {kubernetesObjects?.items.length > 0 &&
                kubernetesObjects?.items.map((item, i) => {
                  const podsWithErrors = new Set<string>(
                    detectedErrors
                      .get(item.cluster.name)
                      ?.filter(de => de.kind === 'Pod')
                      .map(de => de.names)
                      .flat() ?? [],
                  );

                  return (
                    <Grid item key={i} xs={12}>
                      <Cluster
                        clusterObjects={item}
                        podsWithErrors={podsWithErrors}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
};
