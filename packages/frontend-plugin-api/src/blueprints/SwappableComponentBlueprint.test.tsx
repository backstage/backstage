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
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { createSwappableComponent } from '../components';
import { SwappableComponentBlueprint } from './SwappableComponentBlueprint';
import { PageBlueprint } from './PageBlueprint';
import { waitFor, screen } from '@testing-library/react';

describe('SwappableComponentBlueprint', () => {
  it('should allow defining a component override for a component ref', () => {
    const Component = createSwappableComponent({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    const extension = SwappableComponentBlueprint.make({
      params: define =>
        define({
          component: Component,
          loader: () => props => {
            // @ts-expect-error
            const t: number = props.hello;

            return <div>Override {props.hello}</div>;
          },
        }),
    });

    expect(extension).toBeDefined();
  });

  it('should render default component refs in the app', async () => {
    const TestComponent = createSwappableComponent({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              // todo(blam): there's a bug that this path cannot be `/`?
              path: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() => expect(screen.getByText('test!')).toBeInTheDocument());
  });

  it('should render a component ref without a default implementation', async () => {
    const TestComponent = createSwappableComponent({
      id: 'test.component',
    });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              path: '/test',
              loader: async () => <TestComponent />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() =>
      expect(screen.getByTestId('test.component')).toBeInTheDocument(),
    );
  });

  it('should render a component ref with an async loader implementation', async () => {
    const TestComponent = createSwappableComponent({
      id: 'test.component',
      loader: async () => (props: { hello: string }) =>
        <div>{props.hello}</div>,
    });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              // todo(blam): there's a bug that this path cannot be `/`?
              path: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() => expect(screen.getByText('test!')).toBeInTheDocument());
  });

  it('should render a component ref with an async loader implementation and prop transform', async () => {
    const TestComponent = createSwappableComponent({
      id: 'test.component',
      loader: async () => (props: { hello: string }) =>
        <div>{props.hello}</div>,
      transformProps: ({ hello }) => ({ hello: `tr ${hello}` }),
    });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              // todo(blam): there's a bug that this path cannot be `/`?
              path: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() =>
      expect(screen.getByText('tr test!')).toBeInTheDocument(),
    );
  });
});
