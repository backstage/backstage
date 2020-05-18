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
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Content, InfoCard, Progress } from '@backstage/core';
import { BuildWithSteps, BuildStepAction } from '../../api';
import { Grid, Box, Link, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PluginHeader } from '../../components/PluginHeader';
import { ActionOutput } from './lib/ActionOutput/ActionOutput';
import { Layout } from '../../components/Layout';
import LaunchIcon from '@material-ui/icons/Launch';
import { useSettings } from '../../state/useSettings';
import { useBuildWithSteps } from '../../state/useBuildWithSteps';

const IconLink = IconButton as typeof Link;
const BuildName: FC<{ build?: BuildWithSteps }> = ({ build }) => (
  <Box display="flex" alignItems="center">
    #{build?.build_num} - {build?.subject}
    <IconLink href={build?.build_url} target="_blank">
      <LaunchIcon />
    </IconLink>
  </Box>
);
const useStyles = makeStyles((theme) => ({
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

const pickClassName = (
  classes: ReturnType<typeof useStyles>,
  build: BuildWithSteps = {} as BuildWithSteps,
) => {
  if (build.failed) return classes.failed;
  if (['running', 'queued'].includes(build.status!)) return classes.running;
  if (build.status === 'success') return classes.success;

  return classes.neutral;
};

const Page = () => (
  <Layout>
    <Content>
      <BuildWithSteps />
    </Content>
  </Layout>
);

const BuildWithSteps: FC<{}> = () => {
  const { buildId = '' } = useParams();
  const classes = useStyles();
  const [settings] = useSettings();
  const [{ loading, value }, { startPolling, stopPolling }] = useBuildWithSteps(
    parseInt(buildId, 10),
  );

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [buildId, settings]);

  return (
    <>
      <PluginHeader title="Build info" />

      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard
            className={pickClassName(classes, value)}
            title={<BuildName build={value} />}
            cardClassName={classes.cardContent}
          >
            {loading ? <Progress /> : <BuildsList build={value} />}
          </InfoCard>
        </Grid>
      </Grid>
    </>
  );
};

const BuildsList: FC<{ build?: BuildWithSteps }> = ({ build }) => (
  <Box>
    {build &&
      build.steps &&
      build.steps.map(
        ({ name, actions }: { name: string; actions: BuildStepAction[] }) => (
          <ActionsList name={name} actions={actions} />
        ),
      )}
  </Box>
);

const ActionsList: FC<{ actions: BuildStepAction[]; name: string }> = ({
  actions,
}) => {
  const classes = useStyles();
  return (
    <>
      {actions.map((action: BuildStepAction) => (
        <ActionOutput
          className={action.failed ? classes.failed : classes.success}
          action={action}
          name={action.name}
          url={action.output_url || ''}
        />
      ))}
    </>
  );
};

export default Page;
export { BuildWithSteps };
