import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  List,
  Grid,
  ListItem,
  Snackbar,
  Box,
} from '@material-ui/core';
import { InfoCard, Content } from '@backstage/core';
import { Layout } from 'components/Layout';
import { SettingsState } from 'state/models/settings';
import { iRootState } from 'state/store';
import { Dispatch } from '../../state/store';
import { Alert } from '@material-ui/lab';
import { PluginHeader } from 'components/PluginHeader';

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
        <PluginHeader title="Settings" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <InfoCard
              title={
                <>
                  Project Credentials
                  {/*{authed ? <StatusOK /> : <StatusFailed />} */}
                  <Snackbar
                    autoHideDuration={1000}
                    open={saved}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setSaved(false)}
                  >
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
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setToken(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-owner"
                    fullWidth
                    label="Owner"
                    variant="outlined"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="circleci-repo"
                    label="Repo"
                    fullWidth
                    variant="outlined"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Box
                    mt={2}
                    display="flex"
                    width="100%"
                    justifyContent="center"
                  >
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
                  </Box>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Layout>
  );
};
