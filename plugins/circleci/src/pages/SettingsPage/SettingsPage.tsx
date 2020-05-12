/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useState } from 'react';
import {
  Button,
  TextField,
  List,
  Grid,
  ListItem,
  Snackbar,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { InfoCard, Content } from '@backstage/core';
import { Layout } from '../../components/Layout';
import { PluginHeader } from '../../components/PluginHeader';
import { withStore } from '../../components/Store';
import { useSettings } from './settings';

const SettingsPage = () => {
  const [
    { repo: repoFromStore, owner: ownerFromStore, token: tokenFromStore },
    { saveSettings },
  ] = useSettings();

  const [token, setToken] = React.useState(() => tokenFromStore);
  const [owner, setOwner] = React.useState(() => ownerFromStore);
  const [repo, setRepo] = React.useState(() => repoFromStore);

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
                  {/* {authed ? <StatusOK /> : <StatusFailed />} */}
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
                        saveSettings({ repo, owner, token });
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

export default withStore(SettingsPage);
