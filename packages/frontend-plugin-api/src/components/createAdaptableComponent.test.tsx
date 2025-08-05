/*
 * Copyright 2023 The Backstage Authors
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
import { createAdaptableComponent } from './createAdaptableComponent';

describe('createAdaptableComponent', () => {
  it('can be created and read', () => {
    const { ref } = createAdaptableComponent({ id: 'foo' });
    expect(ref.id).toBe('foo');
    expect(String(ref)).toBe('ComponentRef{id=foo}');
  });

  it('should allow defining a default component implementation', () => {
    const Test = () => <div>test</div>;

    createAdaptableComponent<{ foo: string }, { bar: string }>({
      id: 'foo',
      loader:
        () =>
        ({ foo }) =>
          <Test key={foo} />,
    });

    createAdaptableComponent<{ foo: string }, { bar: string }>({
      id: 'foo',
      loader:
        async () =>
        ({ foo }) =>
          <Test key={foo} />,
    });

    createAdaptableComponent<{ foo: string }, { bar: string }>({
      id: 'foo',
    });

    expect(Test).toBeDefined();
  });

  it('should allow transformings props', () => {
    createAdaptableComponent<{ foo: string }, { bar: string }>({
      id: 'foo',
      transformProps: props => ({ foo: props.bar }),
    });

    createAdaptableComponent<{ foo: string }, { bar: string }>({
      id: 'foo',
      // @ts-expect-error - this should be an error as foo is not a string
      transformProps: props => ({ foo: 1 }),
    });

    expect(true).toBe(true);
  });

  describe('sync', () => {
    it('should create a component from a ref for sync component', () => {
      const Component = createAdaptableComponent({
        id: 'random',
        loader: () => (props: { name: string }) => {
          return <div data-testid="test">{props.name}</div>;
        },
        transformProps: (props: { id: string }) => ({
          name: props.id,
        }),
      });

      render(<Component id="test" />);

      expect(screen.getByTestId('test')).toHaveTextContent('test');
    });

    it('should render a fallback when theres no default implementation provided', () => {
      const Component = createAdaptableComponent({
        id: 'random',
      });

      render(<Component />);

      expect(screen.getByTestId('random')).toBeInTheDocument();
    });

    it('should map props from external to internal', () => {
      const Component = createAdaptableComponent({
        id: 'random',
        transformProps: (props: { name: string }) => ({
          uppercase: props.name.toUpperCase(),
        }),
        loader: () => props => {
          // @ts-expect-error as uppercase is types as a string
          const test: number = props.uppercase;

          return <div data-testid="test">{props.uppercase}</div>;
        },
      });

      render(<Component name="test" />);

      expect(screen.getByTestId('test')).toHaveTextContent('TEST');
    });
  });

  describe('async', () => {
    it('should create a component from a ref for async component', async () => {
      const Component = createAdaptableComponent({
        id: 'random',
        loader: async () => (props: { name: string }) => {
          return <div data-testid="test">{props.name}</div>;
        },
      });

      render(<Component name="test" />);

      await expect(screen.findByTestId('test')).resolves.toBeInTheDocument();
    });

    it('should render a fallback when theres no default implementation provided', async () => {
      const Component = createAdaptableComponent({
        id: 'random',
      });

      render(<Component />);

      await expect(screen.findByTestId('random')).resolves.toBeInTheDocument();
    });

    it('should map props from external to internal', async () => {
      const Component = createAdaptableComponent({
        id: 'random',
        transformProps: (props: { name: string }) => ({
          uppercase: props.name.toUpperCase(),
        }),
        loader: async () => props => {
          // @ts-expect-error as uppercase is types as a string
          const test: number = props.uppercase;

          return <div data-testid="test">{props.uppercase}</div>;
        },
      });

      render(<Component name="test" />);

      await expect(screen.findByTestId('test')).resolves.toHaveTextContent(
        'TEST',
      );
    });
  });
});
