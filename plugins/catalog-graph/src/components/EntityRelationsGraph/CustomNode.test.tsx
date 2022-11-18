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
import React from 'react';
import { CustomNode } from './CustomNode';
import userEvent from '@testing-library/user-event';

describe('<CustomNode />', () => {
  test('renders node', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            id: 'kind:namespace/name',
            color: 'primary',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('kind:namespace/name')).toBeInTheDocument();
  });

  test('renders node, skips default namespace', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'default',
            id: 'kind:default/name',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('kind:name')).toBeInTheDocument();
  });

  test('renders node with onClick', async () => {
    const onClick = jest.fn();
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            onClick,
            id: 'kind:namespace/name',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('kind:namespace/name')).toBeInTheDocument();
    await userEvent.click(screen.getByText('kind:namespace/name'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('renders title if entity has one', async () => {
    await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            title: 'Custom Title',
            id: 'kind:namespace/name',
          }}
        />
      </svg>,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
