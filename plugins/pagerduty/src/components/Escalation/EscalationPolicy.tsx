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
import { List, ListSubheader } from '@material-ui/core';
import { User } from '../types';
import { EscalationUsersEmptyState } from './EscalationUsersEmptyState';
import { EscalationUser } from './EscalationUser';

type EscalationPolicyProps = {
  users: User[];
};

export const EscalationPolicy = ({ users }: EscalationPolicyProps) => (
  <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
    {users.length ? (
      users.map((user, index) => <EscalationUser key={index} user={user} />)
    ) : (
      <EscalationUsersEmptyState />
    )}
  </List>
);
