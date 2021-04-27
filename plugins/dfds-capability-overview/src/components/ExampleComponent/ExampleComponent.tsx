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
import {
  Typography,
  Grid,
  Box,
  Container,
  TextField,
  InputAdornment,
  Checkbox,
  FormLabel,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
} from '@backstage/core';

import DoneIcon from '@material-ui/icons/Done';

import { orange, green } from '@material-ui/core/colors';

import SearchIcon from '@material-ui/icons/Search';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import { MoreActions, PopOverProvider } from './MoreActions';
import { CreateCapability } from './CreateCapability';
import { CapabilityCard } from './CapabilityCard';

const capabilities = [
  {
    name: 'dfdsdotcom',
    description: 'DFDS.com based on GatsbyJS',
    isMember: true,
    status: (
      <>
        <DoneIcon
          fontSize="small"
          style={{ color: green[600], marginRight: 5 }}
        />
        <Typography variant="subtitle2" style={{ color: green[600] }}>
          Available
        </Typography>
      </>
    ),
    services: [1, 2, 3],
  },
  {
    name: 'dfdsdotcom-legacy',
    description: 'DFDS.com based on legacy app',
    isMember: true,
    status: (
      <>
        <ReportProblemOutlinedIcon
          fontSize="small"
          style={{ color: orange[600], marginRight: 5 }}
        />
        <Typography variant="subtitle2" style={{ color: orange[600] }}>
          Warning: deprecated
        </Typography>
      </>
    ),
    services: [1, 2],
    updated: 'updated 638 days ago',
  },
  {
    name: 'dynamic-forms-dxp',
    description: 'Dynamic forms enabled experience',
    isMember: false,
    status: (
      <>
        <DoneIcon
          fontSize="small"
          style={{ color: green[600], marginRight: 5 }}
        />
        <Typography variant="subtitle2" style={{ color: green[600] }}>
          Available
        </Typography>
      </>
    ),
    services: [1, 2, 3, 4],
  },
  {
    name: 'cloud-engineering',
    description: 'Zaradars lair',
    isMember: false,
    status: (
      <>
        <DoneIcon
          fontSize="small"
          style={{ color: green[600], marginRight: 5 }}
        />
        <Typography variant="subtitle2" style={{ color: green[600] }}>
          Available
        </Typography>
      </>
    ),
    services: [1, 2, 3, 4, 5, 6],
  },
];

const test = {
  name: 'dfds-backstage',
  description: 'Backstage capability',
  isMember: false,
  status: (
    <Box display="flex" alignItems="center">
      <CircularProgress size={12} style={{ marginRight: 5 }} color="inherit" />
      <Typography variant="subtitle2" color="inherit">
        Initializing...
      </Typography>
    </Box>
  ),
  services: [],
  loading: true,
  updated: 'started less than a minute ago',
};

export const ExampleComponent = () => {
  const [search, setSearch] = React.useState('');
  const [isCondensed, setIsCondensed] = React.useState(false);
  const [showOwned, setShowOwned] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [capabilitiesItems, setCapabilitiesItems] = React.useState([
    test,
    ...capabilities,
  ]);
  React.useEffect(() => {
    setTimeout(() => {
      setCapabilitiesItems(prevCapabilities => {
        const [first, ...rest] = prevCapabilities;
        return [
          {
            ...first,
            services: [1, 2, 3, 4, 5],
            updated: 'updated 1 minute ago',
            loading: false,
            status: (
              <>
                <DoneIcon
                  fontSize="small"
                  style={{ color: green[600], marginRight: 5 }}
                />
                <Typography variant="subtitle2" style={{ color: green[600] }}>
                  Available
                </Typography>
              </>
            ),
          },
          ...rest,
        ];
      });
    }, 10000);
  }, []);
  return (
    <Page themeId="tool">
      <Header title="Welcome to Capability Discoverability!">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <Grid container spacing={3} direction="column">
          <Container maxWidth="md" style={{ padding: 0 }}>
            <ContentHeader title="Capabilities">
              <CreateCapability />
              <TextField
                value={search}
                onChange={e => setSearch(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Search"
                style={!matches ? { marginLeft: 10 } : {}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <PopOverProvider>
                <MoreActions size="medium">
                  <Checkbox
                    color="primary"
                    value={!isCondensed}
                    onChange={() => setIsCondensed(prev => !prev)}
                  />
                  <FormLabel>condensed</FormLabel>
                  <Checkbox
                    color="primary"
                    value={!showOwned}
                    onChange={() => setShowOwned(prev => !prev)}
                  />
                  <FormLabel>show only owned</FormLabel>
                </MoreActions>
              </PopOverProvider>
            </ContentHeader>
            {capabilitiesItems
              .filter(capability => capability.name.includes(search))
              .filter(capability => {
                if (showOwned && !capability.isMember) {
                  return false;
                }
                return true;
              })
              .map(capability => (
                <CapabilityCard {...capability} condensed={!isCondensed} />
              ))}
          </Container>
        </Grid>
      </Content>
    </Page>
  );
};
