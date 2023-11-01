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
import { Build, BuildStepAction, BuildStep } from '../../../../types';
import { Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ActionOutput } from '../ActionOutput';
import { useBuildWithSteps } from '../../../../hooks';
import { InfoCard, Progress } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  neutral: {},
  failed: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.error.main}`,
    },
  },
  running: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.info.main}`,
    },
  },
  cardContent: {
    backgroundColor: theme.palette.background.default,
  },
  success: {
    position: 'relative',
    '&:after': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      boxShadow: `inset 4px 0px 0px ${theme.palette.success.main}`,
    },
  },
}));

const ActionsList = ({
  actions,
  buildNumber,
}: {
  actions: BuildStepAction[];
  name: string;
  buildNumber: number;
}) => {
  const classes = useStyles();
  return (
    <>
      {actions.map((action: BuildStepAction) => (
        <ActionOutput
          key={`${action.index}-${action.step}`}
          className={action.failed ? classes.failed : classes.success}
          action={action}
          buildNumber={buildNumber}
        />
      ))}
    </>
  );
};

const StepsList = ({ build }: { build?: Build }) => (
  <Box>
    {build &&
      build.steps &&
      build.steps.map(
        ({ name, actions }: BuildStep) =>
          build.build_num && (
            <ActionsList
              key={name}
              name={name}
              buildNumber={build.build_num}
              actions={actions}
            />
          ),
      )}
  </Box>
);

export const BuildWithSteps = ({ jobNumber }: { jobNumber: number }) => {
  const classes = useStyles();
  const { loading, build } = useBuildWithSteps(jobNumber);

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <InfoCard title="Steps" cardClassName={classes.cardContent}>
          {loading ? <Progress /> : <StepsList build={build} />}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
