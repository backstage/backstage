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
import React from 'react';
import { CustomNode } from './CustomNode';
import userEvent from '@testing-library/user-event';

describe('<CustomNode />', () => {
  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  test('renders node', async () => {
    const { getByText } = await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            id: 'kind:namespace/name',
            x: 111,
            y: 222,
            width: 100,
            height: 25,
            color: 'primary',
          }}
        />
      </svg>,
    );

    expect(getByText('kind:namespace/name')).toBeInTheDocument();
  });

  test('renders node, skips default namespace', async () => {
    const { getByText } = await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'default',
            id: 'kind:default/name',
            x: 111,
            y: 222,
            width: 100,
            height: 25,
          }}
        />
      </svg>,
    );

    expect(getByText('kind:name')).toBeInTheDocument();
  });

  test('renders node with onClick', async () => {
    const onClick = jest.fn();
    const { getByText } = await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            onClick,
            id: 'kind:namespace/name',
            x: 111,
            y: 222,
            width: 100,
            height: 25,
          }}
        />
      </svg>,
    );

    expect(getByText('kind:namespace/name')).toBeInTheDocument();
    userEvent.click(getByText('kind:namespace/name'));
    expect(onClick).toBeCalledTimes(1);
  });

  test('renders title if entity has one', async () => {
    const { getByText } = await renderInTestApp(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomNode
          node={{
            focused: false,
            kind: 'kind',
            name: 'name',
            namespace: 'namespace',
            title: 'Custom Title',
            id: 'kind:namespace/name',
            x: 111,
            y: 222,
            width: 100,
            height: 25,
          }}
        />
      </svg>,
    );

    expect(getByText('Custom Title')).toBeInTheDocument();
  });
});
