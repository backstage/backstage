import React from 'react';
import { Button, TextField, List, Grid, ListItem } from '@material-ui/core';
import { circleCIApiRef } from 'api';
import {
  InfoCard,
  useApi,
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import { ProjectInput } from 'components/ProjectInput/ProjectInput';

export const SettingsPage = () => {
  const [authed, setAuthed] = React.useState(false);
  const [token, setToken] = React.useState('');

  const api = useApi(circleCIApiRef);

  React.useEffect(() => {
    api
      .restorePersistedSettings()
      .then(() => api.validateToken())
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  return (
    <Page theme={pageTheme.tool}>
      <Header title="Circle CI" subtitle="Settings">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Settings">
          <Button href="/circleci">Back</Button>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Authentication">
              <List>
                {authed ? (
                  <>Already authed</>
                ) : (
                  <>
                    <ListItem>
                      <TextField
                        name="circleci-token"
                        type="password"
                        label="Token"
                        value={token}
                        onChange={e => setToken(e.target.value)}
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
            <ProjectInput setGitInfo={(info) => 
            api.setVCSOptions(info)}/>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
