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

import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SonarQubeClient } from './index';
import { InstanceUrlWrapper, FindingsWrapper } from './types';
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { IdentityApi } from '@backstage/core-plugin-api';
import { FindingSummary } from '@backstage/plugin-sonarqube-react/alpha';

const server = setupServer();

const identityApiAuthenticated: IdentityApi = {
  signOut: jest.fn(),
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials: jest.fn().mockResolvedValue({ token: 'fake-id-token' }),
};
const identityApiGuest: IdentityApi = {
  signOut: jest.fn(),
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials: jest.fn().mockResolvedValue({ token: undefined }),
};

describe('SonarQubeClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/sonarqube';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/findings`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'componentKey=our%3Aservice&instanceKey=',
        );

        return res(
          ctx.json({
            analysisDate: '2020-01-01T00:00:00Z',
            measures: [
              {
                metric: 'alert_status',
                value: 'OK',
              },
              {
                metric: 'bugs',
                value: '2',
              },
              {
                metric: 'reliability_rating',
                value: '3.0',
              },
              {
                metric: 'vulnerabilities',
                value: '4',
              },
              {
                metric: 'security_rating',
                value: '1.0',
              },
              {
                metric: 'security_hotspots_reviewed',
                value: '100',
              },
              {
                metric: 'security_review_rating',
                value: '1.0',
              },
              {
                metric: 'code_smells',
                value: '100',
              },
              {
                metric: 'sqale_rating',
                value: '2.0',
              },
              {
                metric: 'coverage',
                value: '55.5',
              },
              {
                metric: 'duplicated_lines_density',
                value: '1.0',
              },
            ],
          } as FindingsWrapper),
        );
      }),
    );
    server.use(
      rest.get(`${mockBaseUrl}/instanceUrl`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe('instanceKey=');

        return res(
          ctx.json({
            instanceUrl: 'https://sonarcloud.io',
          } as InstanceUrlWrapper),
        );
      }),
    );
  };

  it('should report finding summary', async () => {
    setupHandlers();

    const client = new SonarQubeClient({
      discoveryApi,
      identityApi: identityApiAuthenticated,
    });

    const summary = await client.getFindingSummary({
      componentKey: 'our:service',
    });
    expect(summary).toEqual(
      expect.objectContaining({
        lastAnalysis: '2020-01-01T00:00:00Z',
        metrics: {
          alert_status: 'OK',
          bugs: '2',
          reliability_rating: '3.0',
          vulnerabilities: '4',
          security_rating: '1.0',
          security_hotspots_reviewed: '100',
          security_review_rating: '1.0',
          code_smells: '100',
          sqale_rating: '2.0',
          coverage: '55.5',
          duplicated_lines_density: '1.0',
        },
        projectUrl: 'https://sonarcloud.io/dashboard?id=our%3Aservice',
      }),
    );
    expect(summary?.getIssuesUrl('CODE_SMELL')).toEqual(
      'https://sonarcloud.io/project/issues?id=our%3Aservice&types=CODE_SMELL&resolved=false',
    );
    expect(summary?.getComponentMeasuresUrl('COVERAGE')).toEqual(
      'https://sonarcloud.io/component_measures?id=our%3Aservice&metric=coverage&resolved=false&view=list',
    );
  });

  it('should report finding summary (custom baseUrl)', async () => {
    setupHandlers();
    server.use(
      rest.get(`${mockBaseUrl}/instanceUrl`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe('instanceKey=custom');

        return res(
          ctx.json({
            instanceUrl: 'http://a.instance.local',
          } as InstanceUrlWrapper),
        );
      }),
    );

    server.use(
      rest.get(`${mockBaseUrl}/findings`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'componentKey=our%3Aservice&instanceKey=custom',
        );

        return res(
          ctx.json({
            analysisDate: '2020-01-03T00:00:00Z',
            measures: [
              {
                metric: 'alert_status',
                value: 'ERROR',
              },
              {
                metric: 'bugs',
                value: '45',
              },
              {
                metric: 'reliability_rating',
                value: '5.0',
              },
            ],
          } as FindingsWrapper),
        );
      }),
    );

    const client = new SonarQubeClient({
      discoveryApi,
      identityApi: identityApiAuthenticated,
    });

    const summary = await client.getFindingSummary({
      componentKey: 'our:service',
      projectInstance: 'custom',
    });

    expect(summary).toEqual(
      expect.objectContaining({
        lastAnalysis: '2020-01-03T00:00:00Z',
        metrics: {
          alert_status: 'ERROR',
          bugs: '45',
          reliability_rating: '5.0',
        },
        projectUrl: 'http://a.instance.local/dashboard?id=our%3Aservice',
      }) as FindingSummary,
    );
    expect(summary?.getIssuesUrl('CODE_SMELL')).toEqual(
      'http://a.instance.local/project/issues?id=our%3Aservice&types=CODE_SMELL&resolved=false',
    );
    expect(summary?.getComponentMeasuresUrl('COVERAGE')).toEqual(
      'http://a.instance.local/component_measures?id=our%3Aservice&metric=coverage&resolved=false&view=list',
    );
  });

  it('should add identity token for logged in users', async () => {
    setupHandlers();
    server.use(
      rest.get(`${mockBaseUrl}/findings`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'componentKey=our%3Aservice&instanceKey=',
        );
        expect(req.headers.get('Authorization')).toBe('Bearer fake-id-token');
        return res(
          ctx.json({
            analysisDate: '2020-01-01T00:00:00Z',
            measures: [],
          } as FindingsWrapper),
        );
      }),
    );

    const client = new SonarQubeClient({
      discoveryApi,
      identityApi: identityApiAuthenticated,
    });
    const summary = await client.getFindingSummary({
      componentKey: 'our:service',
    });

    expect(summary?.lastAnalysis).toBe('2020-01-01T00:00:00Z');
  });

  it('should omit identity token for guest users', async () => {
    setupHandlers();
    server.use(
      rest.get(`${mockBaseUrl}/findings`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'componentKey=our%3Aservice&instanceKey=',
        );
        expect(req.headers.has('Authorization')).toBeFalsy();
        return res(
          ctx.json({
            analysisDate: '2020-01-01T00:00:00Z',
            measures: [],
          } as FindingsWrapper),
        );
      }),
    );

    const client = new SonarQubeClient({
      discoveryApi,
      identityApi: identityApiGuest,
    });
    const summary = await client.getFindingSummary({
      componentKey: 'our:service',
    });

    expect(summary?.lastAnalysis).toBe('2020-01-01T00:00:00Z');
  });
});
