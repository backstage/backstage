/*
 * Copyright 2021 The Backstage Authors
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

import { Button, ButtonGroup } from '@material-ui/core';

import { PullRequestStatus } from '@backstage/plugin-azure-devops-common';
import React from 'react';

export const PullRequestStatusButtonGroup = ({
  pullRequestStatusState,
  setPullRequestsStatusState,
}: {
  pullRequestStatusState: PullRequestStatus;
  setPullRequestsStatusState: any;
}) => {
  return (
    <ButtonGroup aria-label="outlined button group">
      <Button
        color={
          pullRequestStatusState === PullRequestStatus.Active
            ? 'primary'
            : 'default'
        }
        onClick={() => {
          setPullRequestsStatusState(PullRequestStatus.Active);
        }}
      >
        Active
      </Button>
      <Button
        color={
          pullRequestStatusState === PullRequestStatus.Completed
            ? 'primary'
            : 'default'
        }
        onClick={() => {
          setPullRequestsStatusState(PullRequestStatus.Completed);
        }}
      >
        Completed
      </Button>
      <Button
        color={
          pullRequestStatusState === PullRequestStatus.Abandoned
            ? 'primary'
            : 'default'
        }
        onClick={() => {
          setPullRequestsStatusState(PullRequestStatus.Abandoned);
        }}
      >
        Abandoned
      </Button>
    </ButtonGroup>
  );
};
