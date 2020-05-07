import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, List, Grid, ListItem } from '@material-ui/core';
import {
  InfoCard,
  Content,
  ContentHeader,
  SupportButton,
  StatusOK,
  StatusFailed,
} from '@backstage/core';
import { Link as RouterLink } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { SettingsState } from 'state/models/settings';
import { iRootState } from 'state/store';
import { Dispatch } from '../../state/store';

export const SettingsPage = () => {
  const { token, owner, repo } = useSelector(
    (state: iRootState): SettingsState => state.settings,
  );

  const dispatch: Dispatch = useDispatch();

  // const api = useApi(circleCIApiRef);
  // const apiGitInfo = api.options.vcs;
  const [authed] = React.useState(false);

  // React.useEffect(() => {
  //   api
  //     .restorePersistedSettings()
  //     .then(() => api.validateToken())
  //     .then(() => setAuthed(true))
  //     .catch(() => setAuthed(false));
  // }, []);

  // useEffect(() => {
  //   if (apiGitInfo && apiGitInfo.owner !== owner && apiGitInfo.owner)
  //     setOwner(apiGitInfo.owner);
  //   if (apiGitInfo && apiGitInfo.repo !== repo && apiGitInfo.repo)
  //     setRepo(apiGitInfo.repo);
  // }, [apiGitInfo]);

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
            <InfoCard
              title={
                <>
                  Project Credentials{authed ? <StatusOK /> : <StatusFailed />}
                </>
              }
            >
              <List>
                <ListItem>
                  <TextField
                    name="circleci-token"
                    label="Token"
                    value={token}
                    onChange={e => dispatch.settings.setToken(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-owner"
                    label="Owner"
                    value={owner}
                    // onChange={(e) => setOwner(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-repo"
                    label="Repo"
                    value={repo}
                    // onChange={(e) => setRepo(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    data-testid="github-auth-button"
                    variant="outlined"
                    color="primary"
                    onClick={async () => {
                      // api.setVCSOptions({ owner, repo });
                      // api.setToken(token);
                      // api
                      //   .validateToken()
                      //   .then(() => setAuthed(true))
                      //   .catch(() => setAuthed(false));
                    }}
                  >
                    Save credentials
                  </Button>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Layout>
  );
};
