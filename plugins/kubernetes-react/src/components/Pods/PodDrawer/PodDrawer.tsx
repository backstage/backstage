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
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { Pod } from 'kubernetes-models/v1';

import { ContainerCard } from './ContainerCard';

import { PodAndErrors } from '../types';
import { KubernetesDrawer } from '../../KubernetesDrawer';
import { PodDeleteButton } from '../PodDelete/PodDeleteButton';
import { PendingPodContent } from './PendingPodContent';
import { ErrorList } from '../ErrorList';
import { usePodMetrics } from '../../../hooks/usePodMetrics';
import { ResourceUtilization } from '../../ResourceUtilization';
import { bytesToMiB, formatMillicores } from '../../../utils/resources';
import { useIsPodDeleteEnabled } from '../../../hooks';

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

/**
 * Props for PodDrawer
 *
 * @public
 */
export interface PodDrawerProps {
  open?: boolean;
  podAndErrors: PodAndErrors;
}

/**
 * A Drawer for Kubernetes Pods
 *
 * @public
 */
export const PodDrawer = ({ podAndErrors, open }: PodDrawerProps) => {
  const classes = useDrawerContentStyles();
  const podMetrics = usePodMetrics(podAndErrors.cluster.name, podAndErrors.pod);
  const isPodDeleteEnabled = useIsPodDeleteEnabled();

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
        {isPodDeleteEnabled && (
          <PodDeleteButton
            podScope={{
              podName: podAndErrors.pod.metadata?.name ?? 'unknown',
              podNamespace: podAndErrors.pod.metadata?.namespace ?? 'default',
              cluster: podAndErrors.cluster,
            }}
          />
        )}
        {podMetrics && (
          <Grid container xs={12}>
            <Grid xs={12}>
              <Typography variant="h5">Resource utilization</Typography>
            </Grid>
            <Grid xs={6}>
              <ResourceUtilization
                title="CPU requests"
                usage={podMetrics.cpu.currentUsage}
                total={podMetrics.cpu.requestTotal}
                totalFormatted={formatMillicores(podMetrics.cpu.requestTotal)}
              />
              <ResourceUtilization
                title="CPU limits"
                usage={podMetrics.cpu.currentUsage}
                total={podMetrics.cpu.limitTotal}
                totalFormatted={formatMillicores(podMetrics.cpu.limitTotal)}
              />
            </Grid>
            <Grid xs={6}>
              <ResourceUtilization
                title="Memory requests"
                usage={podMetrics.memory.currentUsage}
                total={podMetrics.memory.requestTotal}
                totalFormatted={bytesToMiB(podMetrics.memory.requestTotal)}
              />
              <ResourceUtilization
                title="Memory limits"
                usage={podMetrics.memory.currentUsage}
                total={podMetrics.memory.limitTotal}
                totalFormatted={bytesToMiB(podMetrics.memory.limitTotal)}
              />
            </Grid>
          </Grid>
        )}
        {podAndErrors.pod.status?.phase === 'Pending' && (
          <PendingPodContent pod={podAndErrors.pod} />
        )}
        {podAndErrors.pod.status?.containerStatuses?.length && (
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Typography variant="h5">Containers</Typography>
            </Grid>
            <Grid xs={12}>
              <ItemCardGrid>
                {podAndErrors.pod.status?.containerStatuses?.map(
                  (containerStatus, i) => {
                    const containerSpec = getContainerSpecByName(
                      podAndErrors.pod,
                      containerStatus.name,
                    );
                    const containerMetrics = (
                      podMetrics?.containers ?? []
                    ).find(c => c.container === containerStatus.name);
                    return (
                      <ContainerCard
                        key={`container-card-${podAndErrors.pod.metadata?.name}-${i}`}
                        containerMetrics={containerMetrics}
                        podScope={{
                          podName: podAndErrors.pod.metadata?.name ?? 'unknown',
                          podNamespace:
                            podAndErrors.pod.metadata?.namespace ?? 'unknown',
                          cluster: podAndErrors.cluster,
                        }}
                        containerSpec={containerSpec}
                        containerStatus={containerStatus}
                      />
                    );
                  },
                )}
              </ItemCardGrid>
            </Grid>
            {podAndErrors.errors.length > 0 && (
              <Grid xs={12}>
                <Typography variant="h5">Errors</Typography>
              </Grid>
            )}
            {podAndErrors.errors.length > 0 && (
              <Grid xs={12}>
                <ErrorList podAndErrors={[podAndErrors]} />
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </KubernetesDrawer>
  );
};
