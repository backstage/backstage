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
import { createComponentRef } from '../components';
import { makeComponentFromRef } from '../components/makeComponentFromRef';
import { ComponentImplementationBlueprint } from './ComponentImplementationBlueprint';
import { PageBlueprint } from './PageBlueprint';
import { waitFor, screen } from '@testing-library/react';

describe('ComponentImplementationBlueprint', () => {
  it('should allow defining a component override for a component ref', () => {
    const componentRef = createComponentRef({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    const extension = ComponentImplementationBlueprint.make({
      params: define =>
        define({
          ref: componentRef,
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
    const testComponentRef = createComponentRef({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    const TestComponent = makeComponentFromRef({ ref: testComponentRef });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              // todo(blam): there's a bug that this path cannot be `/`?
              defaultPath: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() => expect(screen.getByText('test!')).toBeInTheDocument());
  });

  it('should render a component ref without a default implementation', async () => {
    const testComponentRef = createComponentRef({
      id: 'test.component',
    });

    const TestComponent = makeComponentFromRef({ ref: testComponentRef });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              defaultPath: '/test',
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
    const testComponentRef = createComponentRef({
      id: 'test.component',
      loader: async () => (props: { hello: string }) =>
        <div>{props.hello}</div>,
    });

    const TestComponent = makeComponentFromRef({ ref: testComponentRef });

    renderInTestApp(<div />, {
      extensions: [
        PageBlueprint.make({
          params: define =>
            define({
              // todo(blam): there's a bug that this path cannot be `/`?
              defaultPath: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() => expect(screen.getByText('test!')).toBeInTheDocument());
  });

  it('should allow overriding a component ref with the blueprint', async () => {
    const testComponentRef = createComponentRef({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    const TestComponent = makeComponentFromRef({ ref: testComponentRef });

    const extension = ComponentImplementationBlueprint.make({
      params: define =>
        define({
          ref: testComponentRef,
          loader: () => props => <div>Override {props.hello}</div>,
        }),
    });

    renderInTestApp(<div />, {
      extensions: [
        extension,
        PageBlueprint.make({
          params: define =>
            define({
              defaultPath: '/test',
              loader: async () => <TestComponent hello="test!" />,
            }),
        }),
      ],
      initialRouteEntries: ['/test'],
    });

    await waitFor(() =>
      expect(screen.getByText('Override test!')).toBeInTheDocument(),
    );
  });
});
