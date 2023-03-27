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

import { ItemCardGrid } from '@backstage/core-components';
import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Typography,
} from '@material-ui/core';

import { Pod } from 'kubernetes-models/v1';

import { ContainerCard } from './ContainerCard';

import { PodAndErrors } from './types';
import { KubernetesDrawer } from '../KubernetesDrawer';

const useDrawerContentStyles = makeStyles((_theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    content: {
      height: '80%',
    },
    icon: {
      fontSize: 20,
    },
    podoklist: {
      width: '100%',
      maxWidth: 360,
      maxHeight: 360,
    },
  }),
);

function getContainerSpecByName(pod: Pod, containerName: string) {
  return pod.spec?.containers.find(c => c.name === containerName);
}
interface PodDrawerProps {
  open?: boolean;
  podAndErrors: PodAndErrors;
}

export const PodDrawer = ({ podAndErrors, open }: PodDrawerProps) => {
  const classes = useDrawerContentStyles();

  return (
    <KubernetesDrawer
      open={open}
      drawerContentsHeader={
        <Typography variant="subtitle1">
          Pod{' '}
          {podAndErrors.pod.status?.podIP &&
            `(${podAndErrors.pod.status?.podIP})`}
        </Typography>
      }
      kubernetesObject={podAndErrors.pod}
      label={
        <Typography variant="subtitle1">
          {podAndErrors.pod.metadata?.name ?? 'unknown'}
        </Typography>
      }
    >
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Containers</Typography>
          </Grid>
          <Grid item xs={12}>
            <ItemCardGrid>
              {podAndErrors.pod.status?.containerStatuses?.map(
                (containerStatus, i) => {
                  const containerSpec = getContainerSpecByName(
                    podAndErrors.pod,
                    containerStatus.name,
                  );
                  return (
                    <ContainerCard
                      key={`container-card-${podAndErrors.pod.metadata?.name}-${i}`}
                      logContext={{
                        podName: podAndErrors.pod.metadata?.name ?? 'unknown',
                        podNamespace:
                          podAndErrors.pod.metadata?.namespace ?? 'unknown',
                        clusterName: podAndErrors.clusterName,
                      }}
                      containerSpec={containerSpec}
                      containerStatus={containerStatus}
                    />
                  );
                },
              )}
            </ItemCardGrid>
          </Grid>
        </Grid>
      </div>
    </KubernetesDrawer>
  );
};
