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
import { PluginWrapperDefinition } from '@backstage/frontend-plugin-api';
import { ReactNode, useState } from 'react';
import userEvent from '@testing-library/user-event';

type TestInc = { count: number; increment: () => void };

function useTestInc(): TestInc {
  const [value, setValue] = useState(0);
  return {
    count: value,
    increment: () => setValue(val => val + 1),
  };
}

function makeTestIncWrapper(
  label: string = '',
  renderSpy?: () => void,
): (props: { children: ReactNode; value: TestInc }) => JSX.Element {
  return ({ children, value }: { children: ReactNode; value: TestInc }) => {
    renderSpy?.();
    return (
      <div>
        Wrapper{label}#{value.count} {children}
        <button onClick={value.increment}>Increment{label}</button>
      </div>
    );
  };
}

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

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <div>
          <Wrapper1>1</Wrapper1>
        </div>
        <div>
          <Wrapper2>2</Wrapper2>
        </div>
        <div>
          <Wrapper3>3</Wrapper3>
        </div>
      </RootWrapper>,
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

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <div>
          <Wrapper1>1</Wrapper1>
        </div>
        <div>
          <Wrapper2>2</Wrapper2>
        </div>
      </RootWrapper>,
    );

    await expect(
      screen.findByText('WrapperB(WrapperA(1))'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('WrapperB(WrapperA(2))'),
    ).resolves.toBeInTheDocument();
  });

  it('should share a single value across multiple wrappers', async () => {
    const api = DefaultPluginWrapperApi.fromWrappers([
      {
        loader: async () =>
          ({
            component: ({ children, value }) => (
              <>
                Wrapper({children}:{value})
              </>
            ),
            useWrapperValue: () => 'foo',
          } as PluginWrapperDefinition<string>),
        pluginId: 'plugin-1',
      },
    ]);

    const Wrapper1 = api.getPluginWrapper('plugin-1')!;
    const Wrapper2 = api.getPluginWrapper('plugin-1')!;

    expect(Wrapper1).toBeDefined();
    expect(Wrapper2).toBeDefined();

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <div>
          <Wrapper1>1</Wrapper1>
        </div>
        <div>
          <Wrapper2>2</Wrapper2>
        </div>
      </RootWrapper>,
    );

    await expect(
      screen.findByText('Wrapper(1:foo)'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Wrapper(2:foo)'),
    ).resolves.toBeInTheDocument();
  });

  it('should share a single stateful value across multiple wrappers', async () => {
    const api = DefaultPluginWrapperApi.fromWrappers([
      {
        loader: async () => ({
          component: makeTestIncWrapper(),
          useWrapperValue: useTestInc,
        }),
        pluginId: 'plugin-1',
      },
    ]);

    const Wrapper1 = api.getPluginWrapper('plugin-1')!;
    const Wrapper2 = api.getPluginWrapper('plugin-1')!;

    expect(Wrapper1).toBeDefined();
    expect(Wrapper2).toBeDefined();

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <Wrapper1>X</Wrapper1>
        <Wrapper2>Y</Wrapper2>
      </RootWrapper>,
    );

    await expect(screen.findByText('Wrapper#0 X')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Wrapper#0 Y')).resolves.toBeInTheDocument();

    await userEvent.click(screen.getAllByText('Increment')[0]);

    await expect(screen.findByText('Wrapper#1 X')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Wrapper#1 Y')).resolves.toBeInTheDocument();

    await userEvent.click(screen.getAllByText('Increment')[1]);

    await expect(screen.findByText('Wrapper#2 X')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Wrapper#2 Y')).resolves.toBeInTheDocument();
  });

  it('should not rerender adjacent hooks on update', async () => {
    let renderCountA = 0;
    let renderCountB = 0;

    const api = DefaultPluginWrapperApi.fromWrappers([
      {
        loader: async () => ({
          component: makeTestIncWrapper('A', () => {
            renderCountA += 1;
          }),
          useWrapperValue: useTestInc,
        }),
        pluginId: 'plugin-a',
      },
      {
        loader: async () => ({
          component: makeTestIncWrapper('B', () => {
            renderCountB += 1;
          }),
          useWrapperValue: useTestInc,
        }),
        pluginId: 'plugin-b',
      },
    ]);

    const WrapperA = api.getPluginWrapper('plugin-a')!;
    const WrapperB = api.getPluginWrapper('plugin-b')!;

    expect(WrapperA).toBeDefined();
    expect(WrapperB).toBeDefined();

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <WrapperA>X</WrapperA>
        <WrapperB>Y</WrapperB>
      </RootWrapper>,
    );

    await expect(
      screen.findByText('WrapperA#0 X'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('WrapperB#0 Y'),
    ).resolves.toBeInTheDocument();

    expect(renderCountA).toBe(1);
    expect(renderCountB).toBe(1);

    await userEvent.click(screen.getByText('IncrementA'));

    expect(screen.getByText('WrapperA#1 X')).toBeInTheDocument();
    expect(screen.getByText('WrapperB#0 Y')).toBeInTheDocument();

    expect(renderCountA).toBe(2);
    expect(renderCountB).toBe(1);

    await userEvent.click(screen.getByText('IncrementB'));

    expect(screen.getByText('WrapperA#1 X')).toBeInTheDocument();
    expect(screen.getByText('WrapperB#1 Y')).toBeInTheDocument();

    expect(renderCountA).toBe(2);
    expect(renderCountB).toBe(2);
  });

  it('should not rerender parent or child hooks on update', async () => {
    let renderCountA = 0;
    let renderCountB = 0;

    const api = DefaultPluginWrapperApi.fromWrappers([
      // Inner
      {
        loader: async () => ({
          component: makeTestIncWrapper('B', () => {
            renderCountB += 1;
          }),
          useWrapperValue: useTestInc,
        }),
        pluginId: 'test',
      },
      // Outer
      {
        loader: async () => ({
          component: makeTestIncWrapper('A', () => {
            renderCountA += 1;
          }),
          useWrapperValue: useTestInc,
        }),
        pluginId: 'test',
      },
    ]);

    const Wrapper = api.getPluginWrapper('test')!;

    expect(Wrapper).toBeDefined();

    const RootWrapper = api.getRootWrapper();

    render(
      <RootWrapper>
        <Wrapper>X</Wrapper>
      </RootWrapper>,
    );

    await expect(screen.findByText('WrapperA#0')).resolves.toBeInTheDocument();
    expect(screen.getByText('WrapperB#0 X')).toBeInTheDocument();

    expect(renderCountA).toBe(2);
    expect(renderCountB).toBe(1);

    await userEvent.click(screen.getByText('IncrementA'));

    expect(screen.getByText('WrapperA#1')).toBeInTheDocument();
    expect(screen.getByText('WrapperB#0 X')).toBeInTheDocument();

    expect(renderCountA).toBe(3);
    expect(renderCountB).toBe(1);

    await userEvent.click(screen.getByText('IncrementB'));

    expect(screen.getByText('WrapperA#1')).toBeInTheDocument();
    expect(screen.getByText('WrapperB#1 X')).toBeInTheDocument();

    expect(renderCountA).toBe(3);
    expect(renderCountB).toBe(2);
  });
});
