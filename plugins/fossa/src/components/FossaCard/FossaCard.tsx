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

import {
  EmptyState,
  InfoCard,
  MissingAnnotationEmptyState,
  Progress,
  useApi,
} from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAsync } from 'react-use';
import { fossaApiRef } from '../../api';
import {
  FOSSA_PROJECT_NAME_ANNOTATION,
  useProjectName,
} from '../useProjectName';

const useStyles = makeStyles(theme => ({
  numberError: {
    fontSize: '5rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.error.main,
  },
  numberSuccess: {
    fontSize: '5rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.success.main,
  },
  description: {
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary,
  },
  disabled: {
    backgroundColor: theme.palette.background.default,
  },
  lastAnalyzed: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
  },
  branch: {
    textDecoration: 'underline dotted',
  },
}));

export const FossaCard = () => {
  const { entity } = useEntity();
  const fossaApi = useApi(fossaApiRef);

  const projectTitle = useProjectName(entity);

  const { value, loading } = useAsync(
    async () =>
      projectTitle ? fossaApi.getFindingSummary(projectTitle) : undefined,
    [fossaApi, projectTitle],
  );

  const deepLink = value
    ? {
        title: 'View more',
        link: value.projectUrl,
      }
    : undefined;

  const classes = useStyles();

  return (
    <>
      <InfoCard
        title="License Findings"
        deepLink={deepLink}
        variant="gridItem"
        className={
          !loading && (!projectTitle || !value) ? classes.disabled : undefined
        }
      >
        {loading && <Progress />}

        {!loading && !projectTitle && (
          <MissingAnnotationEmptyState
            annotation={FOSSA_PROJECT_NAME_ANNOTATION}
          />
        )}

        {!loading && projectTitle && !value && (
          <EmptyState
            missing="info"
            title="No information to display"
            description={`There is no Fossa project with title '${projectTitle}'.`}
          />
        )}

        {value && (
          <Grid
            item
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            style={{ height: '100%' }}
            spacing={0}
          >
            <Grid item>
              <p
                className={
                  value.issueCount > 0 || value.dependencyCount === 0
                    ? classes.numberError
                    : classes.numberSuccess
                }
              >
                {value.issueCount}
              </p>
              {value.dependencyCount > 0 && (
                <p className={classes.description}>Number of issues</p>
              )}
              {value.dependencyCount === 0 && (
                <p className={classes.description}>
                  No Dependencies.
                  <br />
                  Please check your FOSSA project settings.
                </p>
              )}
            </Grid>

            <Grid item className={classes.lastAnalyzed}>
              Last analyzed on{' '}
              {new Date(value.timestamp).toLocaleString('en-US', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Grid>
            <Grid item className={classes.lastAnalyzed}>
              Based on {value.dependencyCount} Dependencies on branch{' '}
              <Tooltip title="The default branch can be changed by a FOSSA admin.">
                <span className={classes.branch}>
                  {value.projectDefaultBranch}
                </span>
              </Tooltip>
              .
            </Grid>
          </Grid>
        )}
      </InfoCard>
    </>
  );
};
