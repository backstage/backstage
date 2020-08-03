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
import { useSearchParams } from 'react-router-dom';
import { Content, InfoCard, Progress } from '@backstage/core';
import { Grid, Box, Link, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PluginHeader } from '../../components/PluginHeader';
import { ActionOutput } from './lib/ActionOutput/ActionOutput';
import { Layout } from '../../components/Layout';
import LaunchIcon from '@material-ui/icons/Launch';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useBuildWithSteps } from '../../state/useBuildWithSteps';

const IconLink = IconButton as typeof Link;
const BuildName: FC<{ build?: any }> = ({ build }) => (
  <Box display="flex" alignItems="center">
    {build?.buildName}
    <IconLink href={build?.url} target="_blank" title="View on Jenkins">
      <LaunchIcon /> {/* TODO use Jenkins logo*/}
    </IconLink>
    <IconLink href={build?.source.url} target="_blank" title="View on GitHub">
      <GitHubIcon />
    </IconLink>
  </Box>
);
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

const pickClassName = (
  classes: ReturnType<typeof useStyles>,
  build: any = {},
) => {
  if (build.result === 'UNSTABLE') return classes.failed;
  if (build.result === 'FAILURE') return classes.failed;
  if (build.building) return classes.running;
  if (build.status === 'SUCCESS') return classes.success;

  return classes.neutral;
};

const Page = () => (
  <Layout>
    <Content>
      <BuildWithStepsView />
    </Content>
  </Layout>
);

const BuildWithStepsView = () => {
  const [searchParams] = useSearchParams();
  const buildPath = searchParams.get('url') || '';
  const classes = useStyles();
  const [{ loading, value }, { startPolling, stopPolling }] = useBuildWithSteps(
    buildPath,
  );

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [buildPath, startPolling, stopPolling]);
  return (
    <>
      <PluginHeader title={value?.source.displayName || 'Build details'} />

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

const BuildsList: FC<{ build?: any }> = ({ build }) => (
  <Box>
    {build &&
      build.steps &&
      build.steps.map(({ name, actions }: { name: string; actions: any[] }) => (
        <ActionsList name={name} actions={actions} />
      ))}
  </Box>
);

const ActionsList: FC<{ actions: any[]; name: string }> = ({ actions }) => {
  const classes = useStyles();
  return (
    <>
      {actions.map((action: any) => (
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
export { BuildWithStepsView as BuildWithSteps };
