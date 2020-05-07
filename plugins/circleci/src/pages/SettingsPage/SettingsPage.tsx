import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  List,
  Grid,
  ListItem,
  Snackbar,
} from '@material-ui/core';
import {
  InfoCard,
  Content,
  ContentHeader,
  SupportButton,
  // StatusOK,
  // StatusFailed,
} from '@backstage/core';
import { Link as RouterLink } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { SettingsState } from 'state/models/settings';
import { iRootState } from 'state/store';
import { Dispatch } from '../../state/store';
import { Alert } from '@material-ui/lab';

export const SettingsPage = () => {
  const {
    token: tokenFromStore,
    owner: ownerFromStore,
    repo: repoFromStore,
  } = useSelector(
    (state: iRootState): SettingsState =>
      (console.log({ state }) as any) || state.settings,
  );

  // const apiGitInfo = api.options.vcs;
  // const [authed] = React.useState(false);
  const [token, setToken] = React.useState(() => tokenFromStore);
  const [owner, setOwner] = React.useState(() => ownerFromStore);
  const [repo, setRepo] = React.useState(() => repoFromStore);

  const dispatch: Dispatch = useDispatch();

  React.useEffect(() => () => console.log('Settings unmounterd'), []);
  React.useEffect(() => {
    if (tokenFromStore !== token) {
      setToken(tokenFromStore);
    }
    if (ownerFromStore !== owner) {
      setOwner(ownerFromStore);
    }
    if (repoFromStore !== repo) {
      setRepo(repoFromStore);
    }
  }, [ownerFromStore, repoFromStore, tokenFromStore]);

  const [saved, setSaved] = useState(false);

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
                  Project Credentials
                  {/*{authed ? <StatusOK /> : <StatusFailed />} */}
                  <Snackbar autoHideDuration={3000} open={saved}>
                    <Alert severity="success">Credentials saved.</Alert>
                  </Snackbar>
                </>
              }
            >
              <List>
                <ListItem>
                  <TextField
                    name="circleci-token"
                    label="Token"
                    value={token}
                    variant="outlined"
                    onChange={e => setToken(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-owner"
                    label="Owner"
                    variant="outlined"
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-repo"
                    label="Repo"
                    variant="outlined"
                    value={repo}
                    onChange={e => setRepo(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    data-testid="github-auth-button"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSaved(true);
                      dispatch.settings.setCredentials({
                        owner,
                        repo,
                        token,
                      });
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
