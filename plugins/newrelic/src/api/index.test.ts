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

import { NewRelicClient } from '.';
import { FetchApi } from '@backstage/core-plugin-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('NewRelicClient', () => {
  test.each([
    ['https://test.test/BASEPATH/apm/api/applications.json', '/BASEPATH'],
    ['https://test.test/BASEPATH2/apm/api/applications.json', '/BASEPATH2'],
    ['https://test.testBASEPATH3/apm/api/applications.json', 'BASEPATH3'],
    ['https://test.test/newrelic/apm/api/applications.json', undefined],
  ])(
    'It correctly forms the request url (%p) when proxyPathBase is %p',
    async (expectedUrl, basePathOverride) => {
      const mockedDiscoveryApi: DiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
      };

      const mockedFetchApi: FetchApi = {
        fetch: jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => [],
          headers: new Map<string, string | null>(),
        }),
      };

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
        proxyPathBase: basePathOverride,
      });
      await client.getApplications();

      expect(mockedFetchApi.fetch).toHaveBeenCalledWith(expectedUrl);
    },
  );

  it('Correctly reads all pages of results and returns the expected results', async () => {
    const mockedDiscoveryApi: DiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
    };

    const mockedApplicationOne = {
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

    const mockedApplicationTwo = {
      id: 2,
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

    const mockedApplicationThree = {
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

    const mockedFetchApi: FetchApi = {
      fetch: jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ applications: [mockedApplicationOne] }),
          headers: new Map<string, string | null>([
            [
              'link',
              '<https://next.page/page2?page=2>; rel="next", <https://badsite.dontgohere>; rel="next"',
            ],
            ['otherheader', 'otherValue'],
          ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ applications: [] }),
          headers: new Map<string, string | null>([
            ['Link', '<https://next.page/page3?page=3>; rel="next",'],
          ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            applications: [mockedApplicationTwo, mockedApplicationThree],
          }),
          headers: new Map<string, string | null>([
            [
              'link',
              '<https://first.page/page1>; rel="first", <https://next.page/page2>; rel="next"',
            ],
          ]),
        }),
    };

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

    expect(mockedFetchApi.fetch).toHaveBeenCalledTimes(3);
    expect(mockedFetchApi.fetch).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json',
    );
    expect(mockedFetchApi.fetch).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json?page=2',
    );
    expect(mockedFetchApi.fetch).toHaveBeenCalledWith(
      'https://test.test/newrelic/apm/api/applications.json?page=3',
    );
    expect(actual).toStrictEqual(expected);
  });

  test.each([['LINK'], ['lINK']])(
    'It does not attempt pagination when the link header name is invalid (%p)',
    async linkHeaderName => {
      const mockedDiscoveryApi: DiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
      };

      const mockedFetchApi: FetchApi = {
        fetch: jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => ({ applications: [] }),
          headers: new Map<string, string | null>([
            [
              linkHeaderName,
              '<https://next.page/page2>; rel="next", <https://badsite.dontgohere>; rel="next"',
            ],
            ['otherheader', 'otherValue'],
          ]),
        }),
      };

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
      });
      await client.getApplications();

      expect(mockedFetchApi.fetch).toHaveBeenCalledTimes(1);
      expect(mockedFetchApi.fetch).toHaveBeenCalledWith(
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
      const mockedDiscoveryApi: DiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
      };

      const mockedFetchApi: FetchApi = {
        fetch: jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => ({ applications: [] }),
          headers: new Map<string, string | null>([
            ['Link', linkHeaderValue],
            ['otherheader', 'otherValue'],
          ]),
        }),
      };

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
      });
      await client.getApplications();

      expect(mockedFetchApi.fetch).toHaveBeenCalledTimes(1);
      expect(mockedFetchApi.fetch).toHaveBeenCalledWith(
        'https://test.test/newrelic/apm/api/applications.json',
      );
    },
  );

  test.each([
    [
      {
        ok: false,
        statusText: 'statusText',
        json: async () => ({ error: { title: 'TESTING' } }),
      },
    ],
    [
      {
        ok: false,
        statusText: 'statusText',
        json: async () => ({}),
      },
    ],
  ])(
    'It returns an empty array of applications when the fetch is not okay',
    async fetchResult => {
      const mockedDiscoveryApi: DiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
      };

      const mockedFetchApi: FetchApi = {
        fetch: jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => fetchResult,
        }),
      };

      const client = new NewRelicClient({
        discoveryApi: mockedDiscoveryApi,
        fetchApi: mockedFetchApi,
      });
      const actual = await client.getApplications();

      expect(actual).toStrictEqual({ applications: [] });
    },
  );

  it('Returns an empty array when the fetch itself throws an error', async () => {
    const mockedDiscoveryApi: DiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
    };

    const mockedFetchApi: FetchApi = {
      fetch: () => {
        throw new Error('TESTING');
      },
    };

    const client = new NewRelicClient({
      discoveryApi: mockedDiscoveryApi,
      fetchApi: mockedFetchApi,
    });
    const actual = await client.getApplications();

    expect(actual).toStrictEqual({ applications: [] });
  });

  it('Generates the base url only once', async () => {
    const mockedDiscoveryApi: DiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValueOnce('https://test.test'),
    };

    const mockedFetchApi: FetchApi = {
      fetch: jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ applications: [] }),
      }),
    };

    const client = new NewRelicClient({
      discoveryApi: mockedDiscoveryApi,
      fetchApi: mockedFetchApi,
    });

    await client.getApplications();
    await client.getApplications();
    await client.getApplications();
    await client.getApplications();

    expect(mockedDiscoveryApi.getBaseUrl).toHaveBeenCalledTimes(1);
  });
});
