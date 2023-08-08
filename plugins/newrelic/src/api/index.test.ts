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

import { NewRelicApplication, NewRelicClient } from '.';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';

const mockedDiscoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'https://test.test',
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('NewRelicClient', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    server.resetHandlers();
  });

  test.each([
    ['https://test.test/BASEPATH/apm/api/applications.json', '/BASEPATH'],
    ['https://test.test/BASEPATH2/apm/api/applications.json', '/BASEPATH2'],
    ['https://test.testBASEPATH3/apm/api/applications.json', 'BASEPATH3'],
    ['https://test.test/newrelic/apm/api/applications.json', undefined],
  ])(
    'It correctly forms the request url (%p) when proxyPathBase is %p',
    async (expectedUrl, basePathOverride) => {
      server.use(
        rest.get(expectedUrl, (_, res, ctx) =>
          res(ctx.status(200), ctx.json({ applications: [] })),
        ),
      );

      const mockedFetchApi = new MockFetchApi();
      const fetchSpy = jest.spyOn(mockedFetchApi, 'fetch');

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
        proxyPathBase: basePathOverride,
      });
      await client.getApplications();

      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl);
    },
  );

  it('Correctly reads all pages of results and returns the expected results', async () => {
    const mockedApplicationOne: NewRelicApplication = {
      id: 1,
      application_summary: {
        apdex_score: 0,
        error_rate: 100,
        host_count: 500,
        instance_count: 5000,
        response_time: 20,
        throughput: 500000,
      },
      name: 'Testing Application #1',
      language: 'en-us',
      health_status: 'Failing',
      reporting: true,
      settings: {
        app_apdex_threshold: 0,
        end_user_apdex_threshold: 0,
        enable_real_user_monitoring: true,
        use_server_side_config: true,
      },
    };

    const mockedApplicationTwo: NewRelicApplication = {
      id: 2,
      application_summary: {
        apdex_score: -900,
        error_rate: 0,
        host_count: 0,
        instance_count: 0,
        response_time: 0,
        throughput: 0,
      },
      name: 'Testing Application #2',
      language: 'en-us',
      health_status: 'Working',
      reporting: true,
      settings: {
        app_apdex_threshold: 0,
        end_user_apdex_threshold: 0,
        enable_real_user_monitoring: true,
        use_server_side_config: true,
      },
    };

    const mockedApplicationThree: NewRelicApplication = {
      id: 3,
      application_summary: {
        apdex_score: -900,
        error_rate: 0,
        host_count: 0,
        instance_count: 0,
        response_time: 0,
        throughput: 0,
      },
      name: 'Testing Application #3',
      language: 'en-us',
      health_status: 'Waiting',
      reporting: false,
      settings: {
        app_apdex_threshold: 1000,
        end_user_apdex_threshold: 500,
        enable_real_user_monitoring: false,
        use_server_side_config: false,
      },
    };

    const queryToRequestData = new Map<
      string | null,
      { link?: string | string[]; apps: NewRelicApplication[] }
    >([
      [
        null,
        {
          link: [
            '<https://next.page/page2?page=2>; rel="next"',
            '<https://badsite.dontgohere>; rel="bad"',
          ],
          apps: [mockedApplicationOne],
        },
      ],
      [
        '2',
        {
          link: '<https://next.page/page3?page=3>; rel="next",',
          apps: [],
        },
      ],
      [
        '3',
        {
          apps: [mockedApplicationTwo, mockedApplicationThree],
        },
      ],
    ]);

    const mockedFetchApi = new MockFetchApi();
    const fetchSpy = jest.spyOn(mockedFetchApi, 'fetch');

    server.use(
      rest.get(
        'https://test.test/newrelic/apm/api/applications.json',
        (req, res, ctx) => {
          const nextPageNumber = req.url.searchParams.get('page');
          const requestData = queryToRequestData.get(nextPageNumber) ?? {
            apps: [],
          };

          const { link, apps: applications } = requestData;
          const statusTransform = ctx.status(200);
          const responseBody = ctx.json({ applications });

          if (!!link) {
            return res(statusTransform, ctx.set({ link }), responseBody);
          }

          return res(statusTransform, responseBody);
        },
      ),
    );

    const client = new NewRelicClient({
      discoveryApi: mockedDiscoveryApi,
      fetchApi: mockedFetchApi,
    });

    const actual = await client.getApplications();
    const expected = {
      applications: [
        mockedApplicationOne,
        mockedApplicationTwo,
        mockedApplicationThree,
      ],
    };

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json',
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json?page=2',
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json?page=3',
    );
    expect(actual).toStrictEqual(expected);
  });

  test.each([['Link'], ['LINK'], ['lINK']])(
    'It does not attempt pagination when the link header name is invalid (%p)',
    async linkHeaderName => {
      const mockedFetchApi = new MockFetchApi();
      const fetchSpy = jest.spyOn(mockedFetchApi, 'fetch');

      server.use(
        rest.get(
          'https://test.test/newrelic/apm/api/applications.json',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set(
                linkHeaderName,
                '<https://test.test/badroute>; rel="next"',
              ),
              ctx.json({ applications: [] }),
            ),
        ),
        rest.get('https://test.test/badroute', () => {
          throw new Error(
            'NewRelicClient attempted to paginate when it should not have',
          );
        }),
      );

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
      });
      await client.getApplications();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test.test/newrelic/apm/api/applications.json',
      );
    },
  );

  test.each([
    [''],
    ['<> rel=""'],
    ['<>; rel=""'],
    ['<https://next.page>; rel=""'],
    ['<>; rel:"value"'],
    ['<https://next.page>; rel: "next"'],
    ['ABCDE'],
    ['<https://next.page/page3?page=>; rel="next",'],
  ])(
    'It does not attempt pagination when the link header value is invalid (%p)',
    async linkHeaderValue => {
      const mockedFetchApi = new MockFetchApi();
      const fetchSpy = jest.spyOn(mockedFetchApi, 'fetch');

      server.use(
        rest.get(
          'https://test.test/newrelic/apm/api/applications.json',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('link', linkHeaderValue),
              ctx.json({ applications: [] }),
            ),
        ),
        rest.get('https://test.test/badroute', () => {
          throw new Error(
            'NewRelicClient attempted to paginate when it should not have',
          );
        }),
      );

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
      });
      await client.getApplications();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test.test/newrelic/apm/api/applications.json',
      );
    },
  );

  test.each([
    ['Error communicating with New Relic: Not Found', 404, JSON.stringify({})],
    [
      'Error communicating with New Relic: ERROR TITLE',
      404,
      JSON.stringify({
        error: {
          title: 'ERROR TITLE',
        },
      }),
    ],
    [
      'Error communicating with New Relic: Internal Server Error',
      500,
      JSON.stringify(undefined),
    ],
    [
      'Error communicating with New Relic: Internal Server Error',
      500,
      JSON.stringify(null),
    ],
    [
      'Error communicating with New Relic: Internal Server Error',
      500,
      '<invalid></invalid',
    ],
  ])(
    'It throws this error: %p when the status code is %p and the body is %j',
    async (expectedErrorMessage, statusCode, body) => {
      server.use(
        rest.get(
          'https://test.test/newrelic/apm/api/applications.json',
          (_, res, ctx) => res(ctx.status(statusCode), ctx.body(body)),
        ),
      );

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: new MockFetchApi(),
      });

      await expect(client.getApplications()).rejects.toThrow(
        expectedErrorMessage,
      );
    },
  );

  it('Throws an error when the body is invalid json but the status code is 200', async () => {
    server.use(
      rest.get(
        'https://test.test/newrelic/apm/api/applications.json',
        (_, res, ctx) => res(ctx.status(200), ctx.body('<Invalid></Invalid')),
      ),
    );

    const client = new NewRelicClient({
      discoveryApi: mockedDiscoveryApi,
      fetchApi: new MockFetchApi(),
    });

    await expect(client.getApplications()).rejects.toThrow();
  });

  it('Generates the base url only once', async () => {
    const getBaseUrlSpy = jest.spyOn(mockedDiscoveryApi, 'getBaseUrl');

    server.use(
      rest.get(
        'https://test.test/newrelic/apm/api/applications.json',
        (_, res, ctx) => res(ctx.status(200), ctx.json({ applications: [] })),
      ),
    );

    const client = new NewRelicClient({
      discoveryApi: mockedDiscoveryApi,
      fetchApi: new MockFetchApi(),
    });

    await client.getApplications();
    await client.getApplications();
    await client.getApplications();
    await client.getApplications();

    expect(getBaseUrlSpy).toHaveBeenCalledTimes(1);
  });
});
