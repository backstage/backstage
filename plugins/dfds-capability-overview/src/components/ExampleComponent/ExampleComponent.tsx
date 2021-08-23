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
  // Typography,
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
  IconButton,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  // HeaderLabel,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/core';

// import DoneIcon from '@material-ui/icons/Done';

// import { orange, green } from '@material-ui/core/colors';

import SearchIcon from '@material-ui/icons/Search';
// import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import CloseIcon from '@material-ui/icons/Close';

import { MoreActions, PopOverProvider } from './MoreActions';
// import { CreateCapability } from './CreateCapability';
import { CapabilityCard } from './CapabilityCard';
// import splitEvery from 'ramda/src/splitEvery';

import {
  EntityKindPicker,
  EntityListProvider,
  // EntityTagPicker,
  // EntityTypePicker,
  useEntityListProvider,
  // UserListFilterKind,
  // UserListPicker,
} from '@backstage/plugin-catalog-react';

// const capabilities = [
//   {
//     name: 'dfdsdotcom',
//     description: 'DFDS.com based on GatsbyJS',
//     isMember: true,
//     repos: ['https://github.com/dfds-frontend/dotcom'],
//     status: (
//       <>
//         <DoneIcon
//           fontSize="small"
//           style={{ color: green[600], marginRight: 5 }}
//         />
//         <Typography variant="subtitle2" style={{ color: green[600] }}>
//           Available
//         </Typography>
//       </>
//     ),
//     services: [1, 2, 3],
//   },
//   {
//     name: 'dfdsdotcom-legacy',
//     description: 'DFDS.com based on legacy app',
//     isMember: true,
//     repos: [
//       'https://dfds.visualstudio.com/Unified%20DFDS/_git/dfdsdotcom',
//       'https://dfds.visualstudio.com/Unified%20DFDS/_git/dfdsdotcom_old',
//       'https://dfds.visualstudio.com/Unified%20DFDS/_git/dfdsdotcom_wiki',
//       'https://dfds.visualstudio.com/Unified%20DFDS/_git/dfdsunified-infrastructure-as-code',
//     ],
//     status: (
//       <>
//         <ReportProblemOutlinedIcon
//           fontSize="small"
//           style={{ color: orange[600], marginRight: 5 }}
//         />
//         <Typography variant="subtitle2" style={{ color: orange[600] }}>
//           Warning: deprecated
//         </Typography>
//       </>
//     ),
//     services: [1, 2],
//     updated: 'updated 638 days ago',
//   },
//   {
//     name: 'dynamic-forms-dxp',
//     description: 'Dynamic forms enabled experience',
//     isMember: false,
//     repos: ['https://github.com/dfds-frontend/dynamic-forms'],
//     status: (
//       <>
//         <DoneIcon
//           fontSize="small"
//           style={{ color: green[600], marginRight: 5 }}
//         />
//         <Typography variant="subtitle2" style={{ color: green[600] }}>
//           Available
//         </Typography>
//       </>
//     ),
//     services: [1, 2, 3, 4],
//   },
//   {
//     name: 'cloud-engineering',
//     description: 'Zaradars lair',
//     isMember: false,
//     repos: ['https://github.com/dfds'],
//     status: (
//       <>
//         <DoneIcon
//           fontSize="small"
//           style={{ color: green[600], marginRight: 5 }}
//         />
//         <Typography variant="subtitle2" style={{ color: green[600] }}>
//           Available
//         </Typography>
//       </>
//     ),
//     services: [1, 2, 3, 4, 5, 6],
//   },
// ];

// const test = {
//   name: 'dfds-backstage',
//   description: 'Backstage capability',
//   isMember: false,
//   repos: ['https://github.com/dfds/backstage'],
//   status: (
//     <Box display="flex" alignItems="center">
//       <CircularProgress size={12} style={{ marginRight: 5 }} color="inherit" />
//       <Typography variant="subtitle2" color="inherit">
//         Initializing...
//       </Typography>
//     </Box>
//   ),
//   services: [],
//   loading: true,
//   updated: 'started less than a minute ago',
// };

const CapabilitiesListBase = () => {
  const [search, setSearch] = React.useState('');
  const [isCondensed, setIsCondensed] = React.useState(false);
  const [showOwned, setShowOwned] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const { backendEntities } = useEntityListProvider();
  const entities = React.useMemo(
    () =>
      backendEntities.filter(
        capability =>
          capability?.spec?.name ||
          capability?.spec?.rootId ||
          capability?.spec?.id,
      ),
    [backendEntities],
  );

  const [capData, setCapData] = React.useState<{ items: [] }>({
    items: [],
  });
  /* tslint:disable:no-unused-variable */
  const authApi = useApi(microsoftAuthApiRef);

  React.useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line new-cap
      const token = await authApi.GetAccessTokenClientSide([
        'api://24420be9-46e5-4584-acd7-64850d2f2a03/access_as_user',
      ]);
      const resp = await fetch(
        '/backend/api/proxy/dfds-api/capsvc/capabilities',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const deserialised = await resp.json();

      setCapData(deserialised);
    };
    fetchData();
  }, [authApi]);
  return (
    <Page themeId="tool">
      <Header title="Welcome to Capability Discoverability!">
        {/* <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" /> */}
      </Header>
      {entities.length}
      {capData.items.length}
      <Content>
        <Grid container spacing={3} direction="column">
          <Container maxWidth="lg" style={{ padding: 0 }}>
            <ContentHeader title="Capabilities">
              {/* <CreateCapability /> */}
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
                  endAdornment: search.length > 0 && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PopOverProvider>
                <MoreActions size="medium">
                  <Box m={1} ml={2}>
                    <Box>
                      <Checkbox
                        color="primary"
                        value={!isCondensed}
                        onChange={() => setIsCondensed(prev => !prev)}
                      />
                      <FormLabel>condensed</FormLabel>
                    </Box>
                    <Box>
                      <Checkbox
                        color="primary"
                        value={!showOwned}
                        onChange={() => setShowOwned(prev => !prev)}
                      />
                      <FormLabel>show only owned</FormLabel>
                    </Box>
                  </Box>
                </MoreActions>
              </PopOverProvider>
            </ContentHeader>
            {entities.length === 0 && <CircularProgress />}
            {entities.map((capability, index) => {
              return (
                capability && (
                  <CapabilityCard
                    key={index}
                    name={
                      capability?.spec?.name ||
                      capability?.spec?.rootId ||
                      capability?.spec?.id
                    }
                    id={capability?.spec?.id}
                    description={capability?.spec?.description}
                  />
                )
              );
            })}
            {/* {backendEntities.filter(capability =>
              capability.name.includes(search),
            ).length === 0 && (
              <Box m={5}>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  No capabilities found :(
                </Typography>
              </Box>
            )}
            {backendEntities
              .filter(capability => capability.name.includes(search))
              .filter(capability => {
                if (showOwned && !capability.isMember) {
                  return false;
                }
                return true;
              })
              .map(capability => (
                <CapabilityCard {...capability} condensed={!isCondensed} />
              ))} */}
          </Container>
        </Grid>
      </Content>
    </Page>
  );
};

export const ExampleComponent = () => {
  return (
    <EntityListProvider>
      <EntityKindPicker initialFilter="capability" hidden />
      <CapabilitiesListBase />
    </EntityListProvider>
  );
};
