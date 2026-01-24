/*
 * Copyright 2021 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { DefaultRenderNode } from './DefaultRenderNode';
import userEvent from '@testing-library/user-event';

describe('<CustomNode />', () => {
  test('renders node', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <DefaultRenderNode
          node={{
            id: 'kind:namespace/name',
            entity: {
              kind: 'kind',
              apiVersion: 'v1',
              metadata: {
                name: 'name',
                namespace: 'namespace',
              },
            },
            focused: false,
            color: 'primary',
            // @deprecated
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('kind:namespace/name')).toBeInTheDocument();
    expect(screen.getByText('namespace/name')).toBeInTheDocument();
  });

  test('renders node, skips default namespace', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <DefaultRenderNode
          node={{
            id: 'kind:default/name',
            entity: {
              kind: 'kind',
              apiVersion: 'v1',
              metadata: {
                name: 'name',
                namespace: 'default',
              },
            },
            focused: false,
            // @deprecated
            kind: 'kind',
            name: 'name',
            namespace: 'default',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
  });

  test('renders node with onClick', async () => {
    const onClick = jest.fn();
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <DefaultRenderNode
          node={{
            id: 'kind:namespace/name',
            entity: {
              kind: 'kind',
              apiVersion: 'v1',
              metadata: {
                name: 'name',
                namespace: 'namespace',
              },
            },
            focused: false,
            onClick,
            // @deprecated
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('namespace/name')).toBeInTheDocument();
    await userEvent.click(screen.getByText('namespace/name'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('renders title if entity has one', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <DefaultRenderNode
          node={{
            id: 'kind:namespace/name',
            entity: {
              kind: 'kind',
              apiVersion: 'v1',
              metadata: {
                name: 'name',
                namespace: 'namespace',
                title: 'Custom Title',
              },
            },
            focused: false,
            // @deprecated
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            title: 'Custom Title',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('kind:namespace/name')).toBeInTheDocument();
  });
});
