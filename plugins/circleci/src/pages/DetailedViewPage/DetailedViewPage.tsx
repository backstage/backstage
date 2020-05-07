import React, { FC } from 'react';
import { Content, InfoCard, useApi } from '@backstage/core';
import { Grid, Box } from '@material-ui/core';
import { PluginHeader } from 'components/PluginHeader';
import { BuildWithSteps, BuildStepAction } from 'circleci-api';
import { circleCIApiRef } from 'api';
import { useParams } from 'react-router-dom';
import { ActionOutput } from './lib/ActionOutput/ActionOutput';
import { Layout } from 'components/Layout';
import { Dispatch, iRootState } from 'state/store';
import { useDispatch, useSelector } from 'react-redux';

const BuildName: FC<{ build: BuildWithSteps | null }> = ({ build }) => (
  <>
    #{build?.build_num} - {build?.branch}
  </>
);
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
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
  const { build } = useSelector((state: iRootState) => state.buildWithSteps);

  return (
    <Layout>
      <Content>
        <PluginHeader title="Build info" />

        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard
              className={build?.failed ? classes.failed : classes.success}
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
