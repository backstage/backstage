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

export const ApplicationsList = () => (
  <Container>
    <Typography
      variant="h4"
      gutterBottom
      style={{ marginBottom: 20, marginTop: 20 }}
    >
      Applications:
    </Typography>
    {apps.map(app => (
      <Box mb={1}>
        <Card>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Typography>{app.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {app.description}
                </Typography>
              </div>
              <Box display="flex">
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
      Authorization Servers:
    </Typography>
    {apps.map(app => (
      <Box mb={1}>
        <Card>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Typography>{app.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {app.description}
                </Typography>
              </div>
              <Box display="flex">
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
    {apps.map(app => (
      <Box mb={1}>
        <Card>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Typography>{app.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {app.description}
                </Typography>
              </div>
              <Box display="flex">
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
    <App />
  </Container>
);

function App() {
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
}
