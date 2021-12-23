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
import React from 'react';
import { render } from '@testing-library/react';
import { ExampleFetchComponent } from './ExampleFetchComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';

describe('ExampleFetchComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  it('renders progress bar when loading', async () => {
    server.use(
      rest.get('https://randomuser.me/*', (_, res, ctx) => {
        return res(ctx.delay(2000));
      }),
    );

    const rendered = render(<ExampleFetchComponent />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });

  it('renders data when fetch was successful', async () => {
    server.use(
      rest.get('https://randomuser.me/*', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            results: [
              {
                gender: 'male',
                name: {
                  title: 'Mr',
                  first: 'Vedat',
                  last: 'Özbey',
                },
                location: {
                  street: {
                    number: 7542,
                    name: 'Filistin Cd',
                  },
                  city: 'Elazığ',
                  state: 'Karaman',
                  country: 'Turkey',
                  postcode: 29773,
                  coordinates: {
                    latitude: '73.4994',
                    longitude: '-44.5254',
                  },
                  timezone: {
                    offset: '-8:00',
                    description: 'Pacific Time (US & Canada)',
                  },
                },
                email: 'vedat.ozbey@example.com',
                login: {
                  uuid: 'ff2c94d3-65c9-43f2-97ae-afc39a5d4c1b',
                  username: 'redtiger713',
                  password: 'iforget',
                  salt: 'xuYMm0j2',
                  md5: '080fefd48bae64a2d3b952898ac3eca6',
                  sha1: '196b73795ba4529f85fdba815b20ce39cb96a7cc',
                  sha256:
                    '870a2ab050f8ce74dc44c4654c91ae94bd9921c4b4b5c4dd308529545f875adf',
                },
                dob: {
                  date: '1996-12-31T19:07:00.102Z',
                  age: 25,
                },
                registered: {
                  date: '2016-05-21T03:36:41.149Z',
                  age: 5,
                },
                phone: '(563)-838-1728',
                cell: '(443)-962-7009',
                id: {
                  name: '',
                  value: null,
                },
                picture: {
                  large: 'https://randomuser.me/api/portraits/men/21.jpg',
                  medium: 'https://randomuser.me/api/portraits/med/men/21.jpg',
                  thumbnail:
                    'https://randomuser.me/api/portraits/thumb/men/21.jpg',
                },
                nat: 'TR',
              },
            ],
          }),
        ),
      ),
    );

    const rendered = render(<ExampleFetchComponent />);
    expect(
      await rendered.findByRole('cell', { name: /Vedat Özbey/i }),
    ).toBeInTheDocument();
    expect(await rendered.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders an alert if fetch failed', async () => {
    server.use(
      rest.get('https://randomuser.me/*', (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    const rendered = render(<ExampleFetchComponent />);
    expect(await rendered.findByRole('alert')).toBeInTheDocument();
  });
});
