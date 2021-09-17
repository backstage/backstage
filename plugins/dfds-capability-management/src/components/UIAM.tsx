/*
 * Copyright 2021 Spotify AB
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
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { useAuthContext } from './App/App';

const apps = [
  {
    name: 'Application #1',
    description: 'Description for Application #1',
  },
  {
    name: 'Application #2',
    description: 'Description for Application #2',
  },
  {
    name: 'Application #3',
    description: 'Description for Application #3',
  },
];

export const ApplicationsList = () => {
  //   const b = useAuthContext();
  //   console.log(b);
  const [data, setData] = React.useState([]);
  const [authorizationServers, setAuthorizationServers] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const a = await fetch(
        `http://localhost:7000/api/proxy/dfds-api/iam/Applications`,
        {
          headers: {
            Authorization:
              'Bearer eyJraWQiOiJFRUdjdDNfVEJPeWYySEJXX3lhZldUNmI2TzFRYzM0UGx2b0FORkJCcXRJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnA0Rkx2dnJkQU1jZU83dzZERnQyTFA4M0xnQlZJMl9tWjVyTGI0dmlZNzgiLCJpc3MiOiJodHRwczovL2Rldi1hY2NvdW50cy5kZmRzLmNvbS9vYXV0aDIvYXVzZjJhdmRkbUVKTUd1cXEweDYiLCJhdWQiOiJhcGk6Ly9DdXN0b21lci1JQU0iLCJpYXQiOjE2MzE2OTkzNjEsImV4cCI6MTYzMTcwMjk2MSwiY2lkIjoiMG9hZjFxN2R0Y0JWTWRhdjMweDYiLCJ1aWQiOiIwMHUxZDAweHRuNGdaZWI4MzB4NyIsInNjcCI6WyJDdXN0b21lci1JQU0uU2VsZnNlcnZpY2UuR3JvdXAuQ3JlYXRlIiwiQ3VzdG9tZXItSUFNLlNlbGZzZXJ2aWNlLkFwcGxpY2F0aW9uLkNyZWF0ZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLk1hbmFnZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLlJlYWQiXSwic3ViIjoia29kaWNAZGZkcy5jb20iLCJkZmRzVXNlcklkIjoiZThjNmFmOTctM2M4NC00ODI3LTg3M2EtN2NjYTI0M2U0YTg0In0.vw9WYHUd-SQyJle47T4nAUudMQ_S1HpDDBLCJfB7umIaurZKda5Wzb0Kg0o3pD82o1uiOyX-WxcNNfdbuczcLHBJetTYNBuUw6Ij4bwujdIqWqDOvT94VwNG9s4mZwp-f17TCR5vo6Xc5oa6_I3VPbZb9anJHZoEbeJuUvw0qkr2bA1Wz8rnkjPxa269hcIM49Sfx8JyMoz8mqEk1DeFuGWGQBi3KFR-OXrLEuo8hDEE6P9dRVKyvSFhqcd2T6g5vrveC7ZyGCuMr_QffG8eSEmhDn0my8Bi8EF2SsSp95kFD6LSwCOK3Lr5Gy354C7RLi25GY60ayOwMIAeTAxRPg',
          },
        },
      );
      const json = await a.json();
      setData(json);
    };
    getData();
  }, []);
  React.useEffect(() => {
    const getData = async () => {
      const a = await fetch(
        `http://localhost:7000/api/proxy/dfds-api/iam/AuthorizationServers`,
        {
          headers: {
            Authorization:
              'Bearer eyJraWQiOiJFRUdjdDNfVEJPeWYySEJXX3lhZldUNmI2TzFRYzM0UGx2b0FORkJCcXRJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnA0Rkx2dnJkQU1jZU83dzZERnQyTFA4M0xnQlZJMl9tWjVyTGI0dmlZNzgiLCJpc3MiOiJodHRwczovL2Rldi1hY2NvdW50cy5kZmRzLmNvbS9vYXV0aDIvYXVzZjJhdmRkbUVKTUd1cXEweDYiLCJhdWQiOiJhcGk6Ly9DdXN0b21lci1JQU0iLCJpYXQiOjE2MzE2OTkzNjEsImV4cCI6MTYzMTcwMjk2MSwiY2lkIjoiMG9hZjFxN2R0Y0JWTWRhdjMweDYiLCJ1aWQiOiIwMHUxZDAweHRuNGdaZWI4MzB4NyIsInNjcCI6WyJDdXN0b21lci1JQU0uU2VsZnNlcnZpY2UuR3JvdXAuQ3JlYXRlIiwiQ3VzdG9tZXItSUFNLlNlbGZzZXJ2aWNlLkFwcGxpY2F0aW9uLkNyZWF0ZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLk1hbmFnZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLlJlYWQiXSwic3ViIjoia29kaWNAZGZkcy5jb20iLCJkZmRzVXNlcklkIjoiZThjNmFmOTctM2M4NC00ODI3LTg3M2EtN2NjYTI0M2U0YTg0In0.vw9WYHUd-SQyJle47T4nAUudMQ_S1HpDDBLCJfB7umIaurZKda5Wzb0Kg0o3pD82o1uiOyX-WxcNNfdbuczcLHBJetTYNBuUw6Ij4bwujdIqWqDOvT94VwNG9s4mZwp-f17TCR5vo6Xc5oa6_I3VPbZb9anJHZoEbeJuUvw0qkr2bA1Wz8rnkjPxa269hcIM49Sfx8JyMoz8mqEk1DeFuGWGQBi3KFR-OXrLEuo8hDEE6P9dRVKyvSFhqcd2T6g5vrveC7ZyGCuMr_QffG8eSEmhDn0my8Bi8EF2SsSp95kFD6LSwCOK3Lr5Gy354C7RLi25GY60ayOwMIAeTAxRPg',
          },
        },
      );
      const json = await a.json();
      setAuthorizationServers(json);
    };
    getData();
  }, []);
  React.useEffect(() => {
    const getData = async () => {
      const a = await fetch(
        `http://localhost:7000/api/proxy/dfds-api/iam/Groups`,
        {
          headers: {
            Authorization:
              'Bearer eyJraWQiOiJFRUdjdDNfVEJPeWYySEJXX3lhZldUNmI2TzFRYzM0UGx2b0FORkJCcXRJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnA0Rkx2dnJkQU1jZU83dzZERnQyTFA4M0xnQlZJMl9tWjVyTGI0dmlZNzgiLCJpc3MiOiJodHRwczovL2Rldi1hY2NvdW50cy5kZmRzLmNvbS9vYXV0aDIvYXVzZjJhdmRkbUVKTUd1cXEweDYiLCJhdWQiOiJhcGk6Ly9DdXN0b21lci1JQU0iLCJpYXQiOjE2MzE2OTkzNjEsImV4cCI6MTYzMTcwMjk2MSwiY2lkIjoiMG9hZjFxN2R0Y0JWTWRhdjMweDYiLCJ1aWQiOiIwMHUxZDAweHRuNGdaZWI4MzB4NyIsInNjcCI6WyJDdXN0b21lci1JQU0uU2VsZnNlcnZpY2UuR3JvdXAuQ3JlYXRlIiwiQ3VzdG9tZXItSUFNLlNlbGZzZXJ2aWNlLkFwcGxpY2F0aW9uLkNyZWF0ZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLk1hbmFnZSIsIkN1c3RvbWVyLUlBTS5TZWxmc2VydmljZS5BdXRob3JpemF0aW9uU2VydmVyLlJlYWQiXSwic3ViIjoia29kaWNAZGZkcy5jb20iLCJkZmRzVXNlcklkIjoiZThjNmFmOTctM2M4NC00ODI3LTg3M2EtN2NjYTI0M2U0YTg0In0.vw9WYHUd-SQyJle47T4nAUudMQ_S1HpDDBLCJfB7umIaurZKda5Wzb0Kg0o3pD82o1uiOyX-WxcNNfdbuczcLHBJetTYNBuUw6Ij4bwujdIqWqDOvT94VwNG9s4mZwp-f17TCR5vo6Xc5oa6_I3VPbZb9anJHZoEbeJuUvw0qkr2bA1Wz8rnkjPxa269hcIM49Sfx8JyMoz8mqEk1DeFuGWGQBi3KFR-OXrLEuo8hDEE6P9dRVKyvSFhqcd2T6g5vrveC7ZyGCuMr_QffG8eSEmhDn0my8Bi8EF2SsSp95kFD6LSwCOK3Lr5Gy354C7RLi25GY60ayOwMIAeTAxRPg',
          },
        },
      );
      const json = await a.json();
      setGroups(json);
    };
    getData();
  }, []);
  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        Applications:
      </Typography>
      {data.map(app => (
        <Box mb={1}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div style={{ flex: 1 }}>
                  <Typography>{app.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {app.applicationType}
                  </Typography>
                </div>
                <Box display="flex" flex={1}>
                  <Typography>Client ID:</Typography>
                  <Chip label={app.clientId} size="small" />
                </Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        Authorization Servers:
      </Typography>
      {authorizationServers.map(app => (
        <Box mb={1}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div style={{ flex: 1 }}>
                  <Typography>{app.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {app.description}
                  </Typography>
                </div>
                <Box display="flex" flex={1}>
                  <Typography>Client ID:</Typography>
                  <Chip label="3QERO72JLzx3oY3q67awBIAg_5EjlYgE" size="small" />
                </Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        Groups:
      </Typography>
      {groups.map(app => (
        <Box mb={1}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div style={{ flex: 1 }}>
                  <Typography>{app.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {app.description}
                  </Typography>
                </div>
                <Box display="flex" flex={1}>
                  <Typography>Client ID:</Typography>
                  <Chip label={app.id} size="small" />
                </Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Container>
  );
};

export const UIAM = () => {
  const [tabs, setTabs] = React.useState([
    'Quick start',
    'Settings',
    'Addons',
    'Connections',
    'Organizations',
  ]);
  const [selectedTab, setSelectedTab] = React.useState(tabs.indexOf(tabs[0]));
  return (
    <>
      <ApplicationsList />
      {/* <Button size="small" startIcon={<KeyboardArrowLeft />}>
        Back to Applications
      </Button> */}
      <Box mt={2}>
        <Typography variant="h4">My App</Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Typography variant="caption">Single Page Application</Typography>
          </Box>
          <Typography variant="caption" style={{ marginRight: 5 }}>
            Client ID
          </Typography>
          <Chip
            size="small"
            label={
              <Typography variant="caption">
                14a5d207-5854-4ec8-ad42-1c31edd35ba4
              </Typography>
            }
          />
        </Box>
      </Box>

      <Box mt={2} mb={2}>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          textColor="primary"
          aria-label="disabled tabs example"
        >
          {tabs.map(tab => (
            <Tab
              label={tab}
              onClick={() => setSelectedTab(p => tabs.indexOf(tab))}
            />
          ))}
        </Tabs>
        <Divider />
      </Box>
      <Paper>
        <Box p={2} display="flex">
          <Box flex={1} mr={5}>
            <Typography variant="h6">Basic Information</Typography>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>
          <Box flex={1.4} ml={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Name"
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Domain"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Client ID"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Client Secret"
              helperText="The Client Secret is not base64 encoded."
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              multiline
              minRows={5}
              label="Description"
              helperText="A free text. description of the application. Max character count is 140."
            />
            <Button variant="contained" color="primary">
              save changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
