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
import { InfoIcon } from './InfoIcon';
import { RmExpansionPanel } from './RmExpansionPanel';
import { StatusContainer } from './StatusContainer';
import { StatusItem } from './StatusItem';
import { getAndroidReleaseStatus } from '../utils/status';
import { AndroidReleaseStatus } from '../types';

const statusMap = {
  inProgress: 'In Progress',
  halted: 'Halted',
  completed: 'Completed',
  draft: 'Draft',
};

export const AndroidReleaseStatusPane = ({
  releaseStatus,
}: {
  releaseStatus: AndroidReleaseStatus;
}) => {
  const status = getAndroidReleaseStatus(releaseStatus) || 'loading';

  const Title = () => {
    return (
      <StatusContainer>
        <StatusItem>Status</StatusItem>
        <StatusItem key="track" chip>
          {statusMap[releaseStatus]}
        </StatusItem>
        <InfoIcon title={<span>Shows the release status.</span>} />
      </StatusContainer>
    );
  };

  return (
    <RmExpansionPanel expandable={false} status={status} title={<Title />} />
  );
};
