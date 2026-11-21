/*
 * Copyright 2026 The Backstage Authors
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

import {
  LoggerService,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { LdapClient } from '../ldap';
import { readLdapOrg } from '../ldap/read';
import { LdapOrgEntityProvider } from './LdapOrgEntityProvider';

jest.mock('../ldap/read', () => ({
  ...jest.requireActual('../ldap/read'),
  readLdapOrg: jest.fn(),
}));

describe('LdapOrgEntityProvider', () => {
  const config = new ConfigReader({
    ldap: {
      providers: [
        {
          target: 'ldaps://ldap.example.com',
          users: { dn: 'ou=people,dc=example,dc=com' },
          groups: { dn: 'ou=groups,dc=example,dc=com' },
        },
      ],
    },
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not apply a mutation when the task is aborted', async () => {
    const unbind = jest.fn();
    jest
      .spyOn(LdapClient, 'create')
      .mockResolvedValue({ unbind } as unknown as LdapClient);
    (readLdapOrg as jest.Mock).mockResolvedValue({ users: [], groups: [] });
    const connection = { applyMutation: jest.fn(), refresh: jest.fn() };
    const logger = {
      info: jest.fn(),
      error: jest.fn(),
      child: jest.fn().mockReturnThis(),
    } as unknown as LoggerService;
    const tasks = new Array<SchedulerServiceTaskInvocationDefinition>();

    const provider = LdapOrgEntityProvider.fromLegacyConfig(config, {
      id: 'test',
      target: 'ldaps://ldap.example.com',
      logger,
      schedule: {
        run: async task => {
          tasks.push(task);
        },
      },
    });
    await provider.connect(connection);
    const fn = tasks[0].fn as (signal: AbortSignal) => Promise<void>;

    await expect(
      provider.read({ signal: AbortSignal.abort() }),
    ).rejects.toThrow();
    await fn(AbortSignal.abort());
    expect(LdapClient.create).not.toHaveBeenCalled();
    expect(connection.applyMutation).not.toHaveBeenCalled();

    const controller = new AbortController();
    (readLdapOrg as jest.Mock).mockImplementation(async () => {
      controller.abort();
      return { users: [], groups: [] };
    });
    await fn(controller.signal);
    expect(unbind).toHaveBeenCalled();
    expect(connection.applyMutation).not.toHaveBeenCalled();

    (readLdapOrg as jest.Mock).mockResolvedValue({ users: [], groups: [] });
    await fn(new AbortController().signal);
    expect(connection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });
});
