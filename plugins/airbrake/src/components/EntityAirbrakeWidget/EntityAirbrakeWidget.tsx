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
import { Entity } from '@backstage/catalog-model';
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import {
  EmptyState,
  InfoCard,
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';
import hash from 'object-hash';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import { ErrorApi, errorApiRef, useApi } from '@backstage/core-plugin-api';
import { airbrakeApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import { AIRBRAKE_PROJECT_ID_ANNOTATION, useProjectId } from '../useProjectId';
import { NoProjectIdError } from '../../api/AirbrakeApi';

const useStyles = makeStyles<BackstageTheme>(() => ({
  multilineText: {
    whiteSpace: 'pre-wrap',
  },
}));

enum ComponentState {
  Loading,
  NoProjectId,
  Error,
  Loaded,
}

export const EntityAirbrakeWidget = ({ entity }: { entity: Entity }) => {
  const classes = useStyles();

  const projectId = useProjectId(entity);
  const errorApi = useApi<ErrorApi>(errorApiRef);
  const airbrakeApi = useApi(airbrakeApiRef);
  const [componentState, setComponentState] = useState<ComponentState>(
    ComponentState.Loading,
  );

  useEffect(() => {
    if (!projectId) {
      setComponentState(ComponentState.NoProjectId);
    } else {
      setComponentState(ComponentState.Loading);
    }
  }, [projectId]);

  const { loading, value, error } = useAsync(async () => {
    try {
      const result = await airbrakeApi.fetchGroups(projectId);
      setComponentState(ComponentState.Loaded);
      return result;
    } catch (e) {
      if (e instanceof NoProjectIdError) {
        setComponentState(ComponentState.NoProjectId);
      } else {
        setComponentState(ComponentState.Error);
      }
      throw e;
    }
  }, [airbrakeApi, projectId]);

  useEffect(() => {
    if (
      componentState === ComponentState.Error &&
      error &&
      !(error instanceof NoProjectIdError)
    ) {
      errorApi.post(error);
    }
  }, [componentState, error, errorApi]);

  useEffect(() => {
    if (loading) {
      setComponentState(ComponentState.Loading);
    }
  }, [loading]);

  switch (componentState) {
    case ComponentState.Loaded:
      return (
        <Grid container spacing={3} direction="column">
          {value?.groups?.map(group => (
            <Grid item key={group.id}>
              {group.errors?.map(groupError => (
                <InfoCard title={groupError.type} key={hash(groupError)}>
                  <Typography variant="body1" className={classes.multilineText}>
                    {groupError.message}
                  </Typography>
                </InfoCard>
              ))}
            </Grid>
          ))}
        </Grid>
      );
    case ComponentState.NoProjectId:
      return (
        <MissingAnnotationEmptyState
          annotation={AIRBRAKE_PROJECT_ID_ANNOTATION}
        />
      );
    case ComponentState.Loading:
      return <Progress />;
    case ComponentState.Error:
    default:
      return (
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There is no Airbrake project with id '${projectId}' or there was an issue communicating with Airbrake.`}
        />
      );
  }
};
