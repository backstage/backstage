/*
 * Copyright 2026 The Backstage Authors
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

import { useState } from 'react';
import { act, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  coreExtensionData,
  createExtension,
  createRouteRef,
  useRouteRefParams,
} from '@backstage/frontend-plugin-api';

const entityRef = createRouteRef({ params: ['name'] });

function EntityPage() {
  const { name } = useRouteRefParams(entityRef);
  const [count, setCount] = useState(0);
  if (name === 'broken') {
    throw new Error('Entity page crashed');
  }
  return (
    <>
      <p>Entity {name}</p>
      <button onClick={() => setCount(value => value + 1)}>
        Count {count}
      </button>
    </>
  );
}

const entityPage = createExtension({
  name: 'entity',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.routeRef,
    coreExtensionData.reactElement,
  ],
  factory() {
    return [
      coreExtensionData.routePath('/catalog/:name'),
      coreExtensionData.routeRef(entityRef),
      coreExtensionData.reactElement(<EntityPage />),
    ];
  },
});

const otherPage = createExtension({
  name: 'other',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [coreExtensionData.routePath, coreExtensionData.reactElement],
  factory() {
    return [
      coreExtensionData.routePath('/other'),
      coreExtensionData.reactElement(<p>Other page</p>),
    ];
  },
});

describe('AppRouteSwitch', () => {
  it('preserves page state while route parameters and plugin paths change', async () => {
    const { appHistory } = renderTestApp({
      extensions: [entityPage],
      initialRouteEntries: ['/catalog/first'],
    });
    expect(await screen.findByText('Entity first')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: 'Count 0' }).click());
    await act(async () => appHistory.navigate('/catalog/first/details'));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    await act(async () => appHistory.navigate('/catalog/second/details'));
    expect(await screen.findByText('Entity second')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });

  it('recovers from a page crash at another mount or another page', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { appHistory } = renderTestApp({
        extensions: [entityPage, otherPage],
        initialRouteEntries: ['/catalog/broken'],
      });
      expect(
        await screen.findByText('ERROR 404: PAGE NOT FOUND'),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/broken'));
      expect(
        await screen.findByText('ERROR 404: PAGE NOT FOUND'),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate('/other'));
      expect(await screen.findByText('Other page')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
    } finally {
      error.mockRestore();
    }
  });
});
