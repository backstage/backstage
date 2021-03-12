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
import StatusFetchComponent from '../../components/StatusComponent';
import ButtonComponent from '../../components/shared/ButtonComponent';
import HeaderComponent from '../../components/shared/HeaderComponent';
import { Container } from '../../components/styles';
import { Progress } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';

const LeftContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const OverviewPage: React.FC<{}> = () => {
  const [joinLeaveButton, setJoinLeaveButton] = React.useState<string>('Join');

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://private-aa6799-zaradardfds.apiary-mock.com/overview/1234',
    );
    const data = await response.json();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const handleClick = () => {
    if (joinLeaveButton === 'Join') {
      setJoinLeaveButton('Leave');
    } else if (joinLeaveButton === 'Leave') {
      setJoinLeaveButton('Join');
    }
  };

  return (
    <React.Fragment>
      <HeaderComponent title={value.name} />
      <Container>
        <LeftContainer>
          <OverviewComponent
            capabilityId={value.id}
            description={value.description}
            createdAt={value.created}
          />
          <MembersFetchComponent data={value.members} />
          <ButtonComponent onClick={handleClick}>
            {joinLeaveButton}
          </ButtonComponent>
        </LeftContainer>
        <StatusFetchComponent
          statusColor={value.status.value}
          tooltip={value.status.reasonPhrase}
          comments={value.status.comments}
          reasonUri={value.status.reasonUri}
        />
      </Container>
    </React.Fragment>
  );
};

export default OverviewPage;
