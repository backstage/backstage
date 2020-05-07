import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, List, Grid, ListItem } from '@material-ui/core';
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

export const SettingsPage = () => {
  const {
    token: tokenFromStore,
    owner: ownerFromStore,
    repo: repoFromStore,
  } = useSelector((state: iRootState): SettingsState => state.settings);

  const dispatch: Dispatch = useDispatch();
  // const api = useApi(circleCIApiRef);
  // const apiGitInfo = api.options.vcs;
  // const [authed] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [repo, setRepo] = React.useState('');

  React.useEffect(() => {
    dispatch.settings.rehydrate();
  }, []);

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
                </>
              }
            >
              <List>
                <ListItem>
                  <TextField
                    name="circleci-token"
                    label="Token"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-owner"
                    label="Owner"
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-repo"
                    label="Repo"
                    value={repo}
                    onChange={e => setRepo(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    data-testid="github-auth-button"
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      dispatch.settings.setCredentials({
                        owner,
                        repo,
                        token,
                      })
                    }
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
