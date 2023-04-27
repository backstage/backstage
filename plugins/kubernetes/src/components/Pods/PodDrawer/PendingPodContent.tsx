/*
 * Copyright 2023 The Backstage Authors
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
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { IPodCondition, Pod } from 'kubernetes-models/v1';
import {
  StatusError,
  StatusOK,
  StatusWarning,
} from '@backstage/core-components';
import { DateTime } from 'luxon';

interface PodConditionProps {
  condition: IPodCondition;
}

export const PodCondition = ({ condition }: PodConditionProps) => {
  return (
    <>
      {condition.status === 'False' && (
        <StatusError>
          {condition.type} - ({condition.reason}{' '}
          {condition.lastTransitionTime &&
            DateTime.fromISO(condition.lastTransitionTime).toRelative({
              locale: 'en',
            })}
          ) - {condition.message}{' '}
        </StatusError>
      )}
      {condition.status === 'True' && (
        <StatusOK>
          {condition.type} - (
          {condition.lastTransitionTime &&
            DateTime.fromISO(condition.lastTransitionTime).toRelative({
              locale: 'en',
            })}
          )
        </StatusOK>
      )}
      {condition.status === 'Unknown' && (
        <StatusWarning>
          {condition.type} - (
          {condition.lastTransitionTime &&
            DateTime.fromISO(condition.lastTransitionTime).toRelative({
              locale: 'en',
            })}
          ) {condition.message}
        </StatusWarning>
      )}
    </>
  );
};

interface PendingPodContentProps {
  pod: Pod;
}

export const PendingPodContent = ({ pod }: PendingPodContentProps) => {
  // TODO add PodHasNetwork when it's out of alpha
  // https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
  const startupConditions = [
    pod.status?.conditions?.find(c => c.type === 'PodScheduled'),
    pod.status?.conditions?.find(c => c.type === 'Initialized'),
    pod.status?.conditions?.find(c => c.type === 'ContainersReady'),
    pod.status?.conditions?.find(c => c.type === 'Ready'),
  ].filter((c): c is IPodCondition => !!c); // filter out undefined
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Pod is Pending. Conditions:</Typography>
        <List>
          {startupConditions.map(c => (
            <ListItem key={c.type}>
              <PodCondition condition={c} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};
