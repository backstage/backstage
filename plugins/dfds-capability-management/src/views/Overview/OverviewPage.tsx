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
import React from 'react';
import styled from '@emotion/styled';
import { useAsync } from 'react-use';

import OverviewComponent from '../../components/OverviewComponent';
import MembersFetchComponent from '../../components/MembersComponent';
// import StatusFetchComponent from '../../components/StatusComponent';
import ButtonComponent from '../../components/shared/ButtonComponent';
import HeaderComponent from '../../components/shared/HeaderComponent';
import { Container } from '../../components/styles';
import {
  configApiRef,
  microsoftAuthApiRef,
  Progress,
  useApi,
} from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import queryString from 'query-string';

import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

const LeftContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const OverviewPage: React.FC<{}> = props => {
  const [joinLeaveButton, setJoinLeaveButton] = React.useState<string>('Join');

  const authApi = useApi(microsoftAuthApiRef);
  const location = useLocation();

  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getOptionalString('backend.baseUrl');
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    // eslint-disable-next-line new-cap
    const token = await authApi.GetAccessTokenClientSide([
      'api://24420be9-46e5-4584-acd7-64850d2f2a03/access_as_user',
    ]);
    const authProfile = await authApi.getProfile();
    const response = await fetch(
      `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${
        queryString.parse(location.search).id
      }`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    return { ...data, profile: authProfile, token };
  }, []);

  const navigate = useNavigate();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  const isMember = value.members.some(
    (member: { email: string }) => member.email === value.profile.email,
  );

  return (
    <React.Fragment>
      <Button
        onClick={() => navigate(-1)}
        startIcon={<NavigateBefore />}
        style={{ marginBottom: 16 }}
      >
        back
      </Button>
      <HeaderComponent title={`${value.name}`} />

      <Container>
        <LeftContainer>
          <OverviewComponent
            // title={value.name}
            capabilityId={value.rootId}
            description={value.description}
            createdAt={value.created}
          />
          <MembersFetchComponent data={value.members} />
          {isMember ? (
            <ButtonComponent
              color="secondary"
              onClick={async id => {
                await fetch(
                  `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${id}/members/${value.authProfile?.email}`,
                  {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${value.token}`,
                      'Content-Type': 'application/json',
                    },
                  },
                );
              }}
            >
              leave
            </ButtonComponent>
          ) : (
            <ButtonComponent
              onClick={async id => {
                await fetch(
                  `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${id}/members`,
                  {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${value.token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: value.authProfile.email }),
                  },
                );
              }}
            >
              join
            </ButtonComponent>
          )}
        </LeftContainer>
        {/* <StatusFetchComponent
          statusColor={value.status.value}
          tooltip={value.status.reasonPhrase}
          comments={value.status.comments}
          reasonUri={value.status.reasonUri}
        /> */}
      </Container>
    </React.Fragment>
  );
};

export default OverviewPage;
