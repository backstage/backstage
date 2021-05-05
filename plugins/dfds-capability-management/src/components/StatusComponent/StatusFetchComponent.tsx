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
import { Tooltip } from '@material-ui/core';
import { InfoCard } from '@backstage/core';
import styled from '@emotion/styled';
import { StatusColor } from '../styles';

type StatusFetchComponentProps = {
  statusColor?: string;
  tooltip?: string;
  comments?: string;
  reasonUri?: string;
};

const StatusColorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  margin-bottom: 2rem;
`;

const MessageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  padding: 0.5rem;
`;

const StatusFetchComponent: React.FC<StatusFetchComponentProps> = ({
  statusColor,
  // tooltip,
  comments,
  reasonUri,
}) => {
  return (
    <InfoCard title="Status">
      <Wrapper>
        <StatusColorContainer>
          <a href={reasonUri} target="_blank">
            <Tooltip title>
              <StatusColor
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: `${
                    statusColor === 'Red'
                      ? 'rgb(232, 80, 91)'
                      : 'rgba(232, 80, 91, 0.2)'
                  }`,
                }}
              />
            </Tooltip>
          </a>
          <a href={reasonUri} target="_blank">
            <Tooltip title>
              <StatusColor
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: `${
                    statusColor === 'Yellow'
                      ? 'rgb(249, 213, 110)'
                      : 'rgba(249, 213, 110, 0.2)'
                  }`,
                }}
              />
            </Tooltip>
          </a>
          <a href={reasonUri} target="_blank">
            <Tooltip title>
              <StatusColor
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: `${
                    statusColor === 'Green'
                      ? 'rgb(20, 177, 171)'
                      : 'rgba(20, 177, 171, 0.2)'
                  }`,
                }}
              />
            </Tooltip>
          </a>
        </StatusColorContainer>
        <MessageContainer>{comments}</MessageContainer>
      </Wrapper>
    </InfoCard>
  );
};

export default StatusFetchComponent;
