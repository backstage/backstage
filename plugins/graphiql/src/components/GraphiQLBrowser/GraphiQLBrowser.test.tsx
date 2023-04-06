/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { GraphiQLBrowser } from './GraphiQLBrowser';

jest.mock('graphiql', () => ({ GraphiQL: () => '<GraphiQL />' }));

describe('GraphiQLBrowser', () => {
  it('should render error text if there are no endpoints', async () => {
    const rendered = await renderInTestApp(<GraphiQLBrowser endpoints={[]} />);
    rendered.getByText('No endpoints available');
  });

  it('should render endpoint tabs', async () => {
    const rendered = await renderInTestApp(
      <GraphiQLBrowser
        endpoints={[
          {
            id: 'a',
            title: 'Endpoint A',
            async fetcher() {},
          },
          {
            id: 'b',
            title: 'Endpoint B',
            async fetcher() {},
          },
        ]}
      />,
    );
    rendered.getByText('Endpoint A');
    rendered.getByText('Endpoint B');
  });
});
