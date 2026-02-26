/*
 * Copyright 2024 The Backstage Authors
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
import { DefaultPluginWrapperApi } from './DefaultPluginWrapperApi';

describe('DefaultPluginWrapperApi', () => {
  it('should wrap multiple components with a single wrapper', async () => {
    const api = DefaultPluginWrapperApi.fromWrappers([
      {
        loader: async () => ({
          component: ({ children }) => <>Wrapper({children})</>,
        }),
        pluginId: 'plugin-1',
      },
    ]);

    const Wrapper1 = api.getPluginWrapper('plugin-1')!;
    const Wrapper2 = api.getPluginWrapper('plugin-1')!;
    const Wrapper3 = api.getPluginWrapper('plugin-1')!;

    expect(Wrapper1).toBeDefined();
    expect(Wrapper2).toBeDefined();
    expect(Wrapper3).toBeDefined();

    render(
      <>
        <div>
          <Wrapper1>1</Wrapper1>
        </div>
        <div>
          <Wrapper2>2</Wrapper2>
        </div>
        <div>
          <Wrapper3>3</Wrapper3>
        </div>
      </>,
    );

    await expect(screen.findByText('Wrapper(1)')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Wrapper(2)')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Wrapper(3)')).resolves.toBeInTheDocument();
  });

  it('should wrap multiple components with multiple wrappers', async () => {
    const api = DefaultPluginWrapperApi.fromWrappers([
      {
        loader: async () => ({
          component: ({ children }) => <>WrapperA({children})</>,
        }),
        pluginId: 'plugin-1',
      },
      {
        loader: async () => ({
          component: ({ children }) => <>WrapperB({children})</>,
        }),
        pluginId: 'plugin-1',
      },
    ]);

    const Wrapper1 = api.getPluginWrapper('plugin-1')!;
    const Wrapper2 = api.getPluginWrapper('plugin-1')!;

    expect(Wrapper1).toBeDefined();
    expect(Wrapper2).toBeDefined();

    render(
      <>
        <div>
          <Wrapper1>1</Wrapper1>
        </div>
        <div>
          <Wrapper2>2</Wrapper2>
        </div>
      </>,
    );

    await expect(
      screen.findByText('WrapperB(WrapperA(1))'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('WrapperB(WrapperA(2))'),
    ).resolves.toBeInTheDocument();
  });
});
