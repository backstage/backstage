import React, { FC } from 'react';
import { Content, InfoCard, useApi } from '@backstage/core';
import { Grid, List, ListItem } from '@material-ui/core';
import { PluginHeader } from 'components/PluginHeader';
import { BuildWithSteps, BuildStep } from 'circleci-api';
import { circleCIApiRef } from 'api';
// import { LazyLog } from 'react-lazylog';
import { useParams } from 'react-router-dom';

export const DetailedViewPage: FC<{}> = () => {
  let { buildId = '' } = useParams();

  console.log(useParams());

  const [authed, setAuthed] = React.useState(false);

  //@ts-ignore
  const [build, setBuild] = React.useState<BuildWithSteps>({});
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
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Pipelines">
            <List>
                {build.steps && build.steps.map<BuildStep>(({name}: {name: string}) => (<ListItem>{name}</ListItem>))}
            </List>
          </InfoCard>
        </Grid>
      </Grid>
    </Content>
  );
};
