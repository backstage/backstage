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

import React, { FC, useState } from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Page } from '../Page';
import { Header } from '../Header';
import { Content } from '../Content';
import { ContentHeader } from '../ContentHeader';
import { InfoCard } from '../InfoCard/InfoCard';
import {
  Grid,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  Link,
} from '@material-ui/core';

enum AuthType {
  GitHub,
}

export const LoginPage: FC<{}> = () => {
  const [githubUsername, setGithubUsername] = useState(String);
  const [githubPersonalAuthToken, setGithubPersonalAuthToken] = useState(
    String,
  );
  const [loginDetails, setLoginDetails] = useState(Object);

  const saveGithubInfo = (info: {}) => {
    localStorage.setItem('githubLoginDetails', JSON.stringify(info));
    setLoginDetails(info);
  };

  const deleteGithubInfo = () => {
    localStorage.removeItem('githubLoginDetails');
    setLoginDetails(undefined);
  };

  const handleTokenRegistration = (event: any) => {
    switch (event.target.name) {
      case 'github-username-tf':
        setGithubUsername(event.target.value);
        break;
      case 'github-auth-tf':
        setGithubPersonalAuthToken(event.target.value);
        break;
      default:
        break;
    }
  };

  const fetchGitHubToken = (username: String, token: String) => {
    fetch('https://api.github.com/user', {
      headers: new Headers({
        Authorization: `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw Error(`${response.status} ${response.statusText}`);
      })
      .then(data => {
        const info = {
          username: username,
          token: token,
          name: data.name || data.login,
        };
        saveGithubInfo(info);
      })
      .catch(() => {});
  };

  const validateUsernameAndToken = (username: String, token: String) => {
    if (username === undefined || username === null || username === '')
      return false;

    if (token === undefined || token === null || token === '') return false;

    return true;
  };

  const authenticate = (type: AuthType) => {
    switch (type) {
      case AuthType.GitHub:
        {
          const username = githubUsername;
          const token = githubPersonalAuthToken;
          if (validateUsernameAndToken(username, token))
            fetchGitHubToken(username, token);
        }
        break;
      default:
        break;
    }
  };

  const LoginIndicator = () => {
    const ls = localStorage.getItem('githubLoginDetails');
    if (ls !== null) {
      const obj = ls || loginDetails ? JSON.parse(ls) : loginDetails;
      return (
        <Typography variant="h6" component="h2">
          {`Welcome, ${obj.name}!`}
          <br />
          <Link onClick={deleteGithubInfo}>Logout</Link>
        </Typography>
      );
    }
    return (
      <Typography variant="h6" component="h2">
        Welcome, guest!
      </Typography>
    );
  };

  return (
    <Page>
      <Header title="Login">
        <LoginIndicator />
      </Header>
      <Content>
        <ContentHeader title="Choose a method to authenticate" />
        <Grid container>
          <Grid item>
            <InfoCard>
              <Typography variant="h6">
                <GitHubIcon /> GitHub
              </Typography>
              <List>
                <ListItem>
                  <TextField
                    name="github-username-tf"
                    label="Username"
                    onChange={handleTokenRegistration}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="github-auth-tf"
                    label="Token"
                    onChange={handleTokenRegistration}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    data-testid="github-auth-button"
                    variant="outlined"
                    color="primary"
                    onClick={() => authenticate(AuthType.GitHub)}
                  >
                    Authenticate
                  </Button>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
