/*
 * Copyright 2022 The Backstage Authors
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

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactNode, useEffect } from 'react';
import { scaffolderApiRef } from '../../../api';
import { DryRunProvider, useDryRun } from '../DryRunContext';
import { DryRunResultsView } from './DryRunResultsView';

// The <AutoSizer> inside <LogViewer> needs mocking to render in jsdom
jest.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: (props: {
    children: (size: { width: number; height: number }) => ReactNode;
  }) => <>{props.children({ width: 400, height: 200 })}</>,
}));

function DryRunRemote() {
  const dryRun = useDryRun();

  useEffect(() => {
    dryRun.execute({
      templateContent: '',
      values: {},
      files: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

describe('DryRunResultsView', () => {
  it('renders a result', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scaffolderApiRef,
            {
              dryRun: async () => ({
                directoryContents: [
                  {
                    path: 'foo.txt',
                    base64Content: btoa('Foo Content'),
                    executable: false,
                  },
                ],
                log: [{ body: { message: 'Foo Message', stepId: 'foo' } }],
                output: {
                  links: [{ title: 'Foo Link', url: 'http://example.com' }],
                },
                steps: [{ id: 'foo', action: 'foo', name: 'Foo' }],
              }),
            },
          ],
        ]}
      >
        <DryRunProvider>
          <DryRunResultsView />
          <DryRunRemote />
        </DryRunProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('foo.txt')).toBeInTheDocument();
    expect(screen.getByText('Foo Content')).toBeInTheDocument();

    expect(screen.queryByText('Foo Message')).not.toBeInTheDocument();
    expect(screen.queryByText('Foo Link')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Log'));
    expect(screen.getByText('Foo Message')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Output'));
    expect(screen.getByText('Foo Link')).toBeInTheDocument();
  });
});
