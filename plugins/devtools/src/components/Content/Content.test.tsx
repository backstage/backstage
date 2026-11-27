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

import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { devToolsApiRef } from '../../api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { InfoContent } from './InfoContent';
import { InfoDependenciesTable } from './InfoContent/InfoDependenciesTable';
import { ExternalDependenciesContent } from './ExternalDependenciesContent';

it('shows empty dependency tables and searches with no results', async () => {
  const { rerender } = await renderInTestApp(
    <InfoDependenciesTable infoDependencies={[]} />,
  );
  expect(await screen.findByText('No records to display')).toBeVisible();
  rerender(
    <InfoDependenciesTable
      infoDependencies={[{ name: 'example', versions: '1.0.0' }]}
    />,
  );
  expect(await screen.findByText('example')).toBeVisible();
  fireEvent.change(screen.getByRole('searchbox'), {
    target: { value: 'missing' },
  });
  expect(await screen.findByText('No results found')).toBeVisible();
  expect(screen.queryByText('example')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reset search' }));
  expect(await screen.findByText('example')).toBeVisible();
  expect(screen.getByRole('searchbox')).toHaveValue('');
});

it('announces an external dependency error after loading', async () => {
  const getExternalDependencies = jest
    .fn()
    .mockRejectedValue(new Error('Dependency lookup failed'));
  await renderInTestApp(
    <TestApiProvider apis={[[devToolsApiRef, { getExternalDependencies }]]}>
      <ExternalDependenciesContent />
    </TestApiProvider>,
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Dependency lookup failed',
  );
});

it('shows native copy progress and reports clipboard success and failure', async () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(
    window.navigator,
    'clipboard',
  );
  let finishCopy: () => void = () => {};
  const writeText = jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finishCopy = resolve;
        }),
    )
    .mockRejectedValueOnce(new Error('Clipboard unavailable'));
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  const post = jest.fn();
  try {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            devToolsApiRef,
            {
              getInfo: async () => ({
                operatingSystem: 'Linux',
                resourceUtilization: '4 CPUs',
                nodeJsVersion: 'v24',
                backstageVersion: '1.45.0',
                dependencies: [{ name: 'example', versions: '1.0.0' }],
              }),
            },
          ],
          [toastApiRef, { post }],
        ]}
      >
        <InfoContent />
      </TestApiProvider>,
    );
    const copy = await screen.findByRole('button', { name: 'Copy info' });
    fireEvent.click(copy);
    expect(
      await within(copy).findByRole('progressbar', { name: 'Loading' }),
    ).toBeVisible();
    expect(writeText).toHaveBeenCalledWith(
      'OS: Linux\nResources: 4 CPUs\nnode: v24\nbackstage: 1.45.0\nDependencies:\n    example: 1.0.0\n',
    );
    await act(async () => finishCopy());
    expect(post).toHaveBeenCalledWith({
      title: 'System information copied',
      status: 'success',
    });
    fireEvent.click(copy);
    await waitFor(() =>
      expect(post).toHaveBeenCalledWith({
        title: 'Could not copy system information',
        status: 'danger',
      }),
    );
    expect(within(copy).queryByRole('progressbar')).not.toBeInTheDocument();
  } finally {
    if (originalClipboard)
      Object.defineProperty(window.navigator, 'clipboard', originalClipboard);
    else Reflect.deleteProperty(window.navigator, 'clipboard');
  }
});
