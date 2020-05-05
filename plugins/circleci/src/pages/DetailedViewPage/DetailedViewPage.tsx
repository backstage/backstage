import React, { FC } from 'react';
import { Content, InfoCard, useApi } from '@backstage/core';
import { Grid, List, ListItem } from '@material-ui/core';
import { PluginHeader } from 'components/PluginHeader';
import { BuildWithSteps, BuildStepAction } from 'circleci-api';
import { circleCIApiRef } from 'api';
import { useParams } from 'react-router-dom';
import { ActionOutput } from '../../components/ActionOutput/ActionOutput';

export const DetailedViewPage: FC<{}> = () => {
  let { buildId = '' } = useParams();

  const [authed, setAuthed] = React.useState(false);
  const [build, setBuild] = React.useState<BuildWithSteps | null>(null);
  const api = useApi(circleCIApiRef);

  React.useEffect(() => {
    const getBuildAsync = async () => {
      if (!authed) {
        await api.restorePersistedSettings();
        await api
          .validateToken()
          .then(() => {
            setAuthed(true);
          })
          .catch(() => setAuthed(false));
      }
      api.getBuild(buildId).then(setBuild);
    };
    getBuildAsync();
  }, [authed, buildId]);
  return (
    <Content>
      <PluginHeader />
      {!api.authed ? (
        <div>Not authenticated</div>
      ) : (
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Pipelines"></InfoCard>
            <BuildsList build={build} />
          </Grid>
        </Grid>
      )}
    </Content>
  );
};

const BuildsList: FC<{ build: BuildWithSteps | null }> = ({ build }) => (
  <List key={build?.build_num}>
    {build &&
      build.steps &&
      build.steps.map(
        ({ name, actions }: { name: string; actions: BuildStepAction[] }) => (
          <ListItem>
            {name}
            <br />
            <ActionsList actions={actions} />
          </ListItem>
        ),
      )}
  </List>
);

const ActionsList: FC<{ actions: BuildStepAction[] }> = ({ actions }) => (
  <List>
    {actions.map((action: BuildStepAction) => (
      <ListItem>
        <ActionOutput url={action.output_url || ''} />
      </ListItem>
    ))}
  </List>
);
