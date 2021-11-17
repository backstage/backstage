/*
 * Copyright 2020 The Backstage Authors
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
import { List, ListSubheader } from '@material-ui/core';
import { EscalationUsersEmptyState } from './EscalationUsersEmptyState';
import { EscalationUser } from './EscalationUser';
import { pagerDutyApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

import { useApi } from '@backstage/core-plugin-api';
import { useAsyncDefaults } from '@backstage/core-components';

type Props = {
  policyId: string;
};

export const EscalationPolicy = ({ policyId }: Props) => {
  const api = useApi(pagerDutyApiRef);

  const asyncState = useAsyncDefaults(
    async () => {
      const oncalls = await api.getOnCallByPolicyId(policyId);
      const usersItem = oncalls
        .sort((a, b) => a.escalation_level - b.escalation_level)
        .map(oncall => oncall.user);

      return usersItem;
    },
    [],
    {
      error: ({ error }) => (
        <Alert severity="error">
          Error encountered while fetching information. {error.message}
        </Alert>
      ),
    },
  );

  if (asyncState.fallback) {
    return asyncState.fallback;
  }
  const users = asyncState.value;

  if (!users.length) {
    return <EscalationUsersEmptyState />;
  }

  return (
    <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
      {users.map((user, index) => (
        <EscalationUser key={index} user={user} />
      ))}
    </List>
  );
};
