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
import { DefaultPluginHeaderActionsApi } from './DefaultPluginHeaderActionsApi';

describe('DefaultPluginHeaderActionsApi', () => {
  it('should return actions for a specific plugin', () => {
    const api = DefaultPluginHeaderActionsApi.fromActions([
      {
        element: <button>Action A</button>,
        pluginId: 'plugin-a',
      },
      {
        element: <button>Action B</button>,
        pluginId: 'plugin-b',
      },
    ]);

    expect(api.getPluginHeaderActions('plugin-a')).toHaveLength(1);
    expect(api.getPluginHeaderActions('plugin-b')).toHaveLength(1);

    render(<>{api.getPluginHeaderActions('plugin-a')}</>);
    expect(
      screen.getByRole('button', { name: 'Action A' }),
    ).toBeInTheDocument();
  });

  it('should return an empty array for unknown plugins', () => {
    const api = DefaultPluginHeaderActionsApi.fromActions([
      {
        element: <span>Action</span>,
        pluginId: 'plugin-a',
      },
    ]);

    expect(api.getPluginHeaderActions('unknown-plugin')).toEqual([]);
  });

  it('should group multiple actions by plugin', () => {
    const api = DefaultPluginHeaderActionsApi.fromActions([
      {
        element: <button>First</button>,
        pluginId: 'plugin-a',
      },
      {
        element: <button>Second</button>,
        pluginId: 'plugin-a',
      },
    ]);

    const actions = api.getPluginHeaderActions('plugin-a');
    expect(actions).toHaveLength(2);

    render(<>{actions}</>);
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
  });
});
