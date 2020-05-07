import React from 'react';
import { Button, TextField, List, Grid, ListItem } from '@material-ui/core';
import { circleCIApiRef } from 'api';
import {
  InfoCard,
  useApi,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import { ProjectInput } from 'components/ProjectInput/ProjectInput';
import { Link as RouterLink } from 'react-router-dom';
import { Layout } from 'components/Layout';

export const SettingsPage = () => {
  const api = useApi(circleCIApiRef);
  const [authed, setAuthed] = React.useState(api.authed);
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    api
      .restorePersistedSettings()
      .then(() => api.validateToken())
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  return (
    <Layout>
      <Content>
        <ContentHeader title="Settings">
          <Button component={RouterLink} to="/circleci">
            Back
          </Button>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <InfoCard title="Authentication">
              <List>
                {authed ? (
                  <>Authenticated</>
                ) : (
                  <>
                    <ListItem>
                      <TextField
                        name="circleci-token"
                        type="password"
                        label="Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                      />
                    </ListItem>

                    <ListItem>
                      <Button
                        data-testid="github-auth-button"
                        variant="outlined"
                        color="primary"
                        onClick={async () => {
                          api.setToken(token);
                          api
                            .validateToken()
                            .then(() => setAuthed(true))
                            .catch(() => setAuthed(false));
                        }}
                      >
                        Authenticate
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </InfoCard>
          </Grid>
          <Grid item xs={6}>
            <InfoCard title="Project configuration">
              <ProjectInput
                apiGitInfo={api.options.vcs}
                setGitInfo={(info) => api.setVCSOptions(info)}
              />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Layout>
  );
};
