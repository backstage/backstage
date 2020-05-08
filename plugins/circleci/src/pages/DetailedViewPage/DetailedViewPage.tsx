import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Content, InfoCard, useApi } from '@backstage/core';
import { circleCIApiRef, BuildWithSteps, BuildStepAction } from '../../api';
import { Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PluginHeader } from '../../components/PluginHeader';
import { ActionOutput } from './lib/ActionOutput/ActionOutput';
import { Layout } from '../../components/Layout';
import { Dispatch, iRootState } from '../../state/store';

const BuildName: FC<{ build: BuildWithSteps | null }> = ({ build }) => (
  <>
    #{build?.build_num} - {build?.subject}
  </>
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
export const DetailedViewPage: FC<{}> = () => {
  let { buildId = '' } = useParams();
  const classes = useStyles();
  const dispatch: Dispatch = useDispatch();
  const api = useApi(circleCIApiRef);

  React.useEffect(() => {
    dispatch.buildWithSteps.startPolling({ api, buildId: Number(buildId) });
    return () => {
      dispatch.buildWithSteps.stopPolling();
    };
  }, []);
  const { builds } = useSelector((state: iRootState) => state.buildWithSteps);
  const build = builds[parseInt(buildId, 10)];

  return (
    <Layout>
      <Content>
        <PluginHeader title="Build info" />

        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard
              className={pickClassName(classes, build)}
              title={<BuildName build={build} />}
              cardClassName={classes.cardContent}
            >
              <BuildsList build={build} />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Layout>
  );
};

const BuildsList: FC<{ build: BuildWithSteps | null }> = ({ build }) => (
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
