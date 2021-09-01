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
  Container,
  CircularProgress,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  microsoftAuthApiRef,
  useApi,
  ProfileInfo,
  configApiRef,
} from '@backstage/core';
import {
  EntityKindPicker,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { PerfCapabilityCard } from './PerfCabapilityCard';

import { splitEvery, isEmpty } from 'ramda';
import FilterList from '@material-ui/icons/FilterList';
import useSWR from 'swr';

const CapabilityEntities = React.memo(
  ({
    entities,
    onLeaveButtonClick,
    onJoinButtonClick,
    profile,
  }: {
    entities: any[];
    onLeaveButtonClick: any;
    onJoinButtonClick: any;
    profile: any;
  }) => {
    return (
      <>
        {entities.map((capability, index) => {
          return (
            <PerfCapabilityCard
              key={index}
              name={capability?.name || capability?.rootId || capability?.id}
              id={capability?.id}
              description={capability?.description}
              isMember={capability?.members.some(
                (member: { email: string }) => member.email === profile.email,
              )}
              members={capability?.members}
              onLeaveButtonClick={onLeaveButtonClick}
              onJoinButtonClick={onJoinButtonClick}
            />
          );
        })}
      </>
    );
  },
);

export const useAccessToken = () => {
  const authApi = useApi(microsoftAuthApiRef);
  const [{ token, profile }, setToken] = React.useState<{
    token: string | null;
    profile: ProfileInfo | undefined | null;
  }>({
    token: null,
    profile: null,
  });
  React.useEffect(() => {
    const getToken = async () => {
      // eslint-disable-next-line new-cap
      const authToken = await authApi.GetAccessTokenClientSide([
        'api://24420be9-46e5-4584-acd7-64850d2f2a03/access_as_user',
      ]);
      const authProfile = await authApi.getProfile();
      setToken({ token: authToken, profile: authProfile });
    };
    getToken();
  }, [authApi]);
  return { token, profile };
};

const fetcher = (url: string, token: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

const useCapabilitiesQuery = () => {
  const { token, profile } = useAccessToken();
  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getOptionalString('backend.baseUrl');
  const { data, error, mutate } = useSWR(
    token && [`${baseUrl}/api/proxy/dfds-api/capsvc/capabilities`, token],
    fetcher,
  );
  return {
    items: data?.items || [],
    loading: !error && !data,
    error,
    profile,
    token,
    mutate,
    baseUrl,
  };
};

const CapabilitiesListBase = React.memo(() => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const onChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number,
  ) => void = (_, newPage) => {
    setPage(newPage);
  };
  const onChangeRowsPerPage: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    items,
    loading,
    profile,
    token,
    mutate,
    baseUrl,
  } = useCapabilitiesQuery();

  const [shouldFilterByMember, setShouldFilterByMember] = React.useState(false);

  const filteredEntities = shouldFilterByMember
    ? items.filter((entity: { members: Array<{ email: string }> }) =>
        entity.members.some(member => member.email === profile?.email),
      )
    : items;

  const entities =
    (!isEmpty(filteredEntities) &&
      splitEvery(rowsPerPage, filteredEntities)[page]) ||
    [];
  const [open, setOpen] = React.useState(false);
  return (
    <Page themeId="tool">
      <Header title="Welcome to Capability Discoverability!" />
      <Content>
        <Container maxWidth="lg" style={{ padding: 0 }}>
          {loading && <CircularProgress />}
          {!isEmpty(entities) && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Dialog
                  open={open}
                  onClose={() => {
                    setOpen(false);
                  }}
                >
                  <DialogTitle>Create capability</DialogTitle>
                  <DialogContent dividers>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        label="Name"
                        helperText="Only alphanumeric ASCII characters, minimum length of 3 and a maximum of 255. Must start with a capital letter, may contain hyphens."
                      />
                      <TextField
                        type="text"
                        variant="outlined"
                        margin="dense"
                        label="Description"
                        multiline
                        rows={4}
                      />
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        // await fetch(
                        //   `http://localhost:7000/api/proxy/dfds-api/capsvc/capabilities`,
                        //   {
                        //     method: 'GET',
                        //     headers: {
                        //       Authorization: `Bearer ${token}`,
                        //       'Content-Type': 'application/json',
                        //     },
                        //     body:JSON.stringify({name: "",description:""})
                        //   },
                        // );
                        setOpen(false);
                      }}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Create capability
                </Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <TablePagination
                  count={filteredEntities.length}
                  page={page}
                  onChangePage={onChangePage}
                  rowsPerPage={rowsPerPage}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                  component="div"
                />
                <IconButton onClick={() => setShouldFilterByMember(p => !p)}>
                  <FilterList />
                </IconButton>
              </div>
              <CapabilityEntities
                entities={entities}
                profile={profile}
                onLeaveButtonClick={async (id: string) => {
                  await fetch(
                    `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${id}/members/${profile?.email}`,
                    {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    },
                  );
                  await mutate(
                    `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities`,
                  );
                }}
                onJoinButtonClick={async (id: string) => {
                  await fetch(
                    `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${id}/members`,
                    {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: profile?.email }),
                    },
                  );
                  await mutate(
                    `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities`,
                  );
                }}
              />
            </>
          )}
        </Container>
      </Content>
    </Page>
  );
});

export const ExampleComponent = React.memo(() => {
  return (
    <EntityListProvider>
      <EntityKindPicker initialFilter="capability" hidden />
      <CapabilitiesListBase />
    </EntityListProvider>
  );
});
