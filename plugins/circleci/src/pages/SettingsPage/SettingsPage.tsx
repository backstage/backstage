import React, { useState, useEffect } from 'react';
import { Button, TextField, List, Grid, ListItem } from '@material-ui/core';
import { circleCIApiRef } from 'api';
import {
  InfoCard,
  useApi,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import { Link as RouterLink } from 'react-router-dom';
import { Layout } from 'components/Layout';

export const SettingsPage = () => {
  const api = useApi(circleCIApiRef);
  const apiGitInfo = api.options.vcs;
  const [authed, setAuthed] = React.useState(api.authed);
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    api
      .restorePersistedSettings()
      .then(() => api.validateToken())
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  useEffect(() => {
    if (apiGitInfo && apiGitInfo.owner !== owner && apiGitInfo.owner)
      setOwner(apiGitInfo.owner);
    if (apiGitInfo && apiGitInfo.repo !== repo && apiGitInfo.repo)
      setRepo(apiGitInfo.repo);
  }, [apiGitInfo]);

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
                      <TextField
                        name="circleci-owner"
                        label="Owner"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                      />
                    </ListItem>
                    <ListItem>
                      <TextField
                        name="circleci-repo"
                        label="Repo"
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                      />
                    </ListItem>
                    <ListItem>
                      <Button
                        data-testid="load-build-button"
                        variant="outlined"
                        color="primary"
                        onClick={() => api.setVCSOptions({ owner, repo })}
                      >
                        Save
                      </Button>
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
        </Grid>
      </Content>
    </Layout>
  );
};
