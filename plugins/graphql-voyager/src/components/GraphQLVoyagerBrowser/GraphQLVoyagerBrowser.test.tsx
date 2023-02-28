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
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { GraphQLVoyagerBrowser } from './GraphQLVoyagerBrowser';

jest.mock('graphql-voyager', () => ({ Voyager: () => '<Voyager />' }));

describe('GraphQLVoyagerBrowser', () => {
  it('should render error text if there are no endpoints', async () => {
    const rendered = await renderInTestApp(
      <GraphQLVoyagerBrowser endpoints={[]} />,
    );

    expect(rendered.getByText('No endpoints available')).toBeInTheDocument();
  });

  it('should render endpoint tabs', async () => {
    const rendered = await renderInTestApp(
      <GraphQLVoyagerBrowser
        endpoints={[
          {
            id: 'a',
            title: 'Endpoint A',
            introspectionErrorMessage: 'Failed to introspect A',
            async introspection() {
              return {
                data: {
                  _schema: {},
                },
              };
            },
            voyagerProps: {
              hideDocs: true,
            },
          },
          {
            id: 'b',
            title: 'Endpoint B',
            introspectionErrorMessage: 'Failed to introspect B',
            async introspection() {
              return {
                data: {
                  _schema: {},
                },
              };
            },
            voyagerProps: {
              hideDocs: true,
            },
          },
        ]}
      />,
    );

    expect(rendered.getByText('Endpoint A')).toBeInTheDocument();
    expect(rendered.getByText('Endpoint B')).toBeInTheDocument();
  });

  it('Should render the introspection error message when introspection fails', async () => {
    const rendered = await renderInTestApp(
      <GraphQLVoyagerBrowser
        endpoints={[
          {
            id: 'a',
            title: 'Endpoint A',
            introspectionErrorMessage: 'Failed to introspect A',
            async introspection() {
              return {};
            },
            voyagerProps: {
              hideDocs: true,
            },
          },
        ]}
      />,
    );

    expect(rendered.getByText('Failed to introspect A')).toBeInTheDocument();
  });
});
