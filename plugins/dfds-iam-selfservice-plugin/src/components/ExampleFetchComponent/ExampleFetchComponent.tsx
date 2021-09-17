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
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  Page,
  Content,
  Header,
  HeaderLabel,
} from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  TextField,
  Tab,
  Tabs,
  Button,
} from '@material-ui/core';
import { useIamFetch } from '../ExampleComponent/ExampleComponent';
import queryString from 'query-string';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type User = {
  gender: string; // "male"
  name: {
    title: string; // "Mr",
    first: string; // "Duane",
    last: string; // "Reed"
  };
  location: object; // {street: {number: 5060, name: "Hickory Creek Dr"}, city: "Albany", state: "New South Wales",…}
  email: string; // "duane.reed@example.com"
  login: object; // {uuid: "4b785022-9a23-4ab9-8a23-cb3fb43969a9", username: "blackdog796", password: "patch",…}
  dob: object; // {date: "1983-06-22T12:30:23.016Z", age: 37}
  registered: object; // {date: "2006-06-13T18:48:28.037Z", age: 14}
  phone: string; // "07-2154-5651"
  cell: string; // "0405-592-879"
  id: {
    name: string; // "TFN",
    value: string; // "796260432"
  };
  picture: { medium: string }; // {medium: "https://randomuser.me/api/portraits/men/95.jpg",…}
  nat: string; // "AU"
};

type DenseTableProps = {
  users: User[];
};

export const DenseTable = ({ users }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Avatar', field: 'avatar' },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Nationality', field: 'nationality' },
  ];

  const data = users.map(user => {
    return {
      avatar: (
        <img
          src={user.picture.medium}
          className={classes.avatar}
          alt={user.name.first}
        />
      ),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      nationality: user.nat,
    };
  });

  return (
    <Table
      title="Example User List (fetching data from randomuser.me)"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

const OverviewHeader = ({ title, type, id }) => (
  <div>
    <Box mt={2}>
      <Typography variant="h4">{title}</Typography>
      <Box display="flex" alignItems="center">
        <Box mr={2}>
          <Typography variant="caption">{type}</Typography>
        </Box>
        <Typography variant="caption" style={{ marginRight: 5 }}>
          Client ID
        </Typography>
        <Chip
          size="small"
          label={<Typography variant="caption">{id}</Typography>}
        />
      </Box>
    </Box>
  </div>
);

export const UIAM = ({ data }) => {
  const [tabs, setTabs] = React.useState([
    'Quick start',
    'Settings',
    'Addons',
    'Connections',
    'Organizations',
  ]);
  const [selectedTab, setSelectedTab] = React.useState(tabs.indexOf(tabs[0]));
  if (!data) return null;
  return (
    <>
      <OverviewHeader
        title={data.name}
        type={data.applicationType}
        id={data.id}
      />
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
              value={data.name}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Domain"
              value={data.name}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Client ID"
              value={data.id}
              disabled
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
              value={data.description}
              helperText="A free text. description of the application. Max character count is 140."
            />
          </Box>
        </Box>
        <Divider />
        <Box p={2} display="flex">
          <Box flex={1} mr={5}>
            <Typography variant="h6">Application Properties</Typography>
          </Box>
          <Box flex={1.4} ml={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Allowed Callback URLs"
              required
              multiline
              // helperText="In some scenarios we will need to redirect to your application's login page. This URI needs to point to a route in your application that should redirect to your tenant's /authorize endpoint"
              value={data.redirectUri.reduce((acc, curr) => {
                if (!acc) {
                  return curr;
                }
                return `${acc},\n${curr}`;
              }, '')}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Allowed Logout URLs"
              required
              multiline
              value={data.postLogoutRedirectUri.reduce((acc, curr) => {
                if (!acc) {
                  return curr;
                }
                return `${acc},\n${curr}`;
              }, '')}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Grant types"
              required
              multiline
              value={data.grantTypes.reduce((acc, curr) => {
                if (!acc) {
                  return `${curr}, `;
                }
                return `${acc},\n${curr}`;
              }, '')}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              label="Application admins"
              required
              multiline
              value={data.applicationAdmins.reduce((acc, curr) => {
                if (!acc) {
                  return `${curr}, `;
                }
                return `${acc},\n${curr}`;
              }, '')}
            />
          </Box>
        </Box>
        <Button variant="contained" color="primary">
          save changes
        </Button>
      </Paper>
    </>
  );
};

export const ExampleFetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    const response = await fetch('https://randomuser.me/api/?results=20');
    const data = await response.json();
    return data.results;
  }, []);
  const entity = queryString.parse(window.location.search).entity;
  const a = useIamFetch({
    route: `Applications/${queryString.parse(window.location.search).id}`,
  });

  const b = useIamFetch({
    route: `AuthorizationServers/${
      queryString.parse(window.location.search).id
    }`,
  });

  if (a.loading || b.loading) {
    return <Progress />;
  } else if (a.error || b.error) {
    return <Alert severity="error">{a?.error?.message}</Alert>;
  }

  return (
    <Page themeId="">
      <Header title="Welcome to dfds-iam-selfservice-plugin!">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        {entity === 'Applications' && <UIAM data={a.data} />}
        {entity === 'AuthorizationServers' && b.data && (
          <div>
            <OverviewHeader
              title={b.data.name}
              type={b.data.description}
              id={b.data.id}
            />
          </div>
        )}
        {entity === 'Groups' && <div>test</div>}
      </Content>
    </Page>
  );
};
