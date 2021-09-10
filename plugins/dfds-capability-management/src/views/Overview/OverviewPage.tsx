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

import OverviewComponent from '../../components/OverviewComponent';
import MembersFetchComponent from '../../components/MembersComponent';
import ButtonComponent from '../../components/shared/ButtonComponent';
import HeaderComponent from '../../components/shared/HeaderComponent';
import { Container } from '../../components/styles';
import { Progress } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';

import { useNavigate } from 'react-router';
import { Button } from '@material-ui/core';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import { useUserContext } from '../../components/App/App';

const LeftContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const OverviewPage: React.FC<{}> = () => {
  const { value, loading, error } = useUserContext();
  const navigate = useNavigate();
  if (!value) return null;
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  const isMember = value.selectedCapability.members.some(
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
      <HeaderComponent title={`${value.selectedCapability.name}`} />

      <Container>
        <LeftContainer>
          <OverviewComponent
            // title={value.selectedCapability.name}
            capabilityId={value.selectedCapability.rootId}
            description={value.selectedCapability.description}
            createdAt={value.selectedCapability.created}
          />
          <MembersFetchComponent data={value.selectedCapability.members} />
          {isMember ? (
            <ButtonComponent
              color="secondary"
              onClick={async () => {
                await fetch(
                  `${value.baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${value.selectedCapability.id}/members/${value.profile?.email}`,
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
              onClick={async () => {
                await fetch(
                  `${value.baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${value.selectedCapability.id}/members`,
                  {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${value.token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: value.profile.email }),
                  },
                );
              }}
            >
              join
            </ButtonComponent>
          )}
        </LeftContainer>
        {/* <
          StatusFetchComponent
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
