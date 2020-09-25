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

import React, { Fragment } from 'react';
import { Chip, Grid } from '@material-ui/core';
import {
  StatusAborted,
  StatusError,
  StatusOK,
  SubvalueCell,
  Table,
  TableColumn,
} from '@backstage/core';
import {
  V1ComponentCondition,
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
} from '@kubernetes/client-node';
import { V1OwnerReference } from '@kubernetes/client-node/dist/gen/model/v1OwnerReference';
import { DeploymentTriple } from '../../types/types';

const renderCondition = (condition: V1ComponentCondition | undefined) => {
  if (!condition) {
    return <StatusAborted />;
  }

  const status = condition.status;

  if (status === 'True') {
    return <StatusOK />;
  } else if (status === 'False') {
    return <StatusError />;
  }
  return <StatusAborted />;
};

const columns: TableColumn<V1Pod>[] = [
  {
    title: 'name',
    highlight: true,
    width: '20%',
    render: (pod: V1Pod) => pod.metadata?.name ?? 'un-named pod',
  },
  {
    title: 'images',
    width: '20%',
    render: (pod: V1Pod) => {
      const containerStatuses = pod.status?.containerStatuses ?? [];
      return containerStatuses.map((cs, i) => {
        return <Chip key={i} label={`${cs.name}=${cs.image}`} size="small" />;
      });
    },
  },
  {
    title: 'phase',
    render: (pod: V1Pod) => pod.status?.phase ?? 'unknown',
  },
  {
    title: 'containers ready',
    align: 'center',
    render: (pod: V1Pod) => {
      const containerStatuses = pod.status?.containerStatuses ?? [];
      const containersReady = containerStatuses.filter(cs => cs.ready).length;

      return `${containersReady}/${containerStatuses.length}`;
    },
  },
  {
    title: 'total restarts',
    render: (pod: V1Pod) => {
      const containerStatuses = pod.status?.containerStatuses ?? [];
      return containerStatuses?.reduce((a, b) => a + b.restartCount, 0);
    },
    type: 'numeric',
  },
  {
    title: 'status',
    width: '20%',
    render: (pod: V1Pod) => {
      const containerStatuses = pod.status?.containerStatuses ?? [];
      const errors = containerStatuses.reduce((accum, next) => {
        if (next.state === undefined) {
          return accum;
        }

        const waiting = next.state.waiting;
        const terminated = next.state.terminated;

        const renderCell = (reason: string | undefined) => (
          <Fragment key={`${pod.metadata?.name}-${next.name}`}>
            <SubvalueCell
              value={<StatusError>Container: {next.name}</StatusError>}
              subvalue={reason}
            />
            <br />
          </Fragment>
        );

        if (waiting) {
          accum.push(renderCell(waiting.reason));
        }

        if (terminated) {
          accum.push(renderCell(terminated.reason));
        }

        return accum;
      }, [] as React.ReactNode[]);

      if (errors.length === 0) {
        return <StatusOK>OK</StatusOK>;
      }

      return errors;
    },
  },
  {
    title: 'Pod Initialized',
    align: 'center',
    render: (pod: V1Pod) => {
      const conditions = pod.status?.conditions ?? [];
      return renderCondition(conditions.find(c => c.type === 'Initialized'));
    },
  },
  {
    title: 'Pod Ready',
    align: 'center',
    render: (pod: V1Pod) => {
      const conditions = pod.status?.conditions ?? [];
      return renderCondition(conditions.find(c => c.type === 'Ready'));
    },
  },
  {
    title: 'Containers Ready',
    align: 'center',
    render: (pod: V1Pod) => {
      const conditions = pod.status?.conditions ?? [];
      return renderCondition(
        conditions.find(c => c.type === 'ContainersReady'),
      );
    },
  },
  {
    title: 'Pod Scheduled',
    align: 'center',
    render: (pod: V1Pod) => {
      const conditions = pod.status?.conditions ?? [];
      return renderCondition(conditions.find(c => c.type === 'PodScheduled'));
    },
  },
];

type DeploymentTablesProps = {
  deploymentTriple: DeploymentTriple;
  children?: React.ReactNode;
};

export const DeploymentTables = ({
  deploymentTriple,
}: DeploymentTablesProps) => {
  const isOwnedBy = (
    ownerReferences: V1OwnerReference[],
    obj: V1Pod | V1ReplicaSet | V1Deployment,
  ): boolean => {
    return ownerReferences?.some(or => or.name === obj.metadata?.name);
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      {deploymentTriple.deployments.map((deployment, i) => (
        <Grid container item key={i} xs>
          {deploymentTriple.replicaSets
            // Filter out replica sets with no replicas
            .filter(rs => rs.status && rs.status.replicas > 0)
            // Find the replica sets this deployment owns
            .filter(rs =>
              isOwnedBy(rs.metadata?.ownerReferences ?? [], deployment),
            )
            .map((rs, j) => {
              // Find the pods this replica set owns and render them in the table
              const ownedPods = deploymentTriple.pods.filter(pod =>
                isOwnedBy(pod.metadata?.ownerReferences ?? [], rs),
              );

              return (
                <Grid item key={j} xs>
                  <Table
                    options={{ paging: false, padding: 'dense', search: false }}
                    data={ownedPods}
                    columns={columns}
                    title={deployment.metadata?.name ?? ''}
                    subtitle="Deployment"
                  />
                </Grid>
              );
            })}
        </Grid>
      ))}
    </Grid>
  );
};
