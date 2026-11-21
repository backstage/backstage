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

import { fireEvent, screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { devToolsApiRef } from '../../api';
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
  expect(await screen.findByText('No records to display')).toBeVisible();
  expect(screen.queryByText('example')).not.toBeInTheDocument();
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
