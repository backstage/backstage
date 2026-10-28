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

import { render, screen } from '@testing-library/react';
import {
  renderInTestApp,
  mockApis,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { withLogCollector } from '@backstage/test-utils';
import { extensionFragmentsApiRef } from '../apis/definitions/ExtensionFragmentsApi';
import { ExtensionFragment } from './ExtensionFragment';

it('looks up named and unnamed fragments and renders fallback or nothing for missing content', async () => {
  const getFragment = jest.fn((id: string) => {
    if (id === 'fragment:deployments/summary') {
      return <div>Deployment summary</div>;
    }
    if (id === 'fragment:ownership') {
      return <div>Owner</div>;
    }
    return undefined;
  });
  renderInTestApp(
    <>
      <ExtensionFragment
        extensionId="deployments/summary"
        fallback="Unused fallback"
      />
      <ExtensionFragment extensionId="ownership" />
      <ExtensionFragment
        extensionId="missing"
        fallback={<div>No summary</div>}
      />
      <ExtensionFragment extensionId="absent" />
    </>,
    { apis: [mockApis.extensionFragments.mock({ getFragment })] },
  );
  expect(await screen.findByText('Deployment summary')).toBeVisible();
  expect(screen.getByText('Owner')).toBeVisible();
  expect(screen.getByText('No summary')).toBeVisible();
  expect(screen.queryByText('Unused fallback')).not.toBeInTheDocument();
  expect(getFragment.mock.calls.map(([id]) => id)).toEqual(
    expect.arrayContaining([
      'fragment:deployments/summary',
      'fragment:ownership',
      'fragment:missing',
      'fragment:absent',
    ]),
  );
});

it.each([
  'fragment:deployments/summary',
  '',
  '/summary',
  'deployments/',
  'a/b/c',
])('rejects invalid fragment ID %j', extensionId => {
  const getFragment = jest.fn();
  withLogCollector(['error'], () => {
    expect(() =>
      render(
        <TestApiProvider apis={[[extensionFragmentsApiRef, { getFragment }]]}>
          <ExtensionFragment extensionId={extensionId} />
        </TestApiProvider>,
      ),
    ).toThrow('expected a namespace and optional name');
  });
  expect(getFragment).not.toHaveBeenCalled();
});
