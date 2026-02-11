/*
 * Copyright 2025 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import { DefaultHeaderActionsApi } from './DefaultHeaderActionsApi';

describe('DefaultHeaderActionsApi', () => {
  it('should return actions for a specific plugin', async () => {
    const api = DefaultHeaderActionsApi.fromActions([
      {
        loader: async () => <button>Action A</button>,
        pluginId: 'plugin-a',
        nodeId: 'plugin-header-action:plugin-a/action-a',
      },
      {
        loader: async () => <button>Action B</button>,
        pluginId: 'plugin-b',
        nodeId: 'plugin-header-action:plugin-b/action-b',
      },
    ]);

    expect(api.getHeaderActions('plugin-a')).toHaveLength(1);
    expect(api.getHeaderActions('plugin-b')).toHaveLength(1);

    render(<>{api.getHeaderActions('plugin-a')}</>);
    await expect(
      screen.findByRole('button', { name: 'Action A' }),
    ).resolves.toBeInTheDocument();
  });

  it('should return an empty array for unknown plugins', () => {
    const api = DefaultHeaderActionsApi.fromActions([
      {
        loader: async () => <span>Action</span>,
        pluginId: 'plugin-a',
        nodeId: 'plugin-header-action:plugin-a/action',
      },
    ]);

    expect(api.getHeaderActions('unknown-plugin')).toEqual([]);
  });

  it('should group multiple actions by plugin', async () => {
    const api = DefaultHeaderActionsApi.fromActions([
      {
        loader: async () => <button>First</button>,
        pluginId: 'plugin-a',
        nodeId: 'plugin-header-action:plugin-a/first',
      },
      {
        loader: async () => <button>Second</button>,
        pluginId: 'plugin-a',
        nodeId: 'plugin-header-action:plugin-a/second',
      },
    ]);

    const actions = api.getHeaderActions('plugin-a');
    expect(actions).toHaveLength(2);

    render(<>{actions}</>);
    await expect(
      screen.findByRole('button', { name: 'First' }),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByRole('button', { name: 'Second' }),
    ).resolves.toBeInTheDocument();
  });
});
