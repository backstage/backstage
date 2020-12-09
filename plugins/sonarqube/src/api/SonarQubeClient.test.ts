/*
 * Copyright 2020 Spotify AB
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

import { UrlPatternDiscovery } from '@backstage/core';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FindingSummary, SonarQubeClient } from './index';
import { ComponentWrapper, MeasuresWrapper } from './types';

const server = setupServer();

describe('SonarQubeClient', () => {
  msw.setupDefaultHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/sonarqube/components/show`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe('component=our-service');
        return res(
          ctx.json({
            component: {
              analysisDate: '2020-01-01T00:00:00Z',
            },
          } as ComponentWrapper),
        );
      }),
    );

    server.use(
      rest.get(`${mockBaseUrl}/sonarqube/measures/search`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'projectKeys=our-service&metricKeys=alert_status%2Cbugs%2Creliability_rating%2Cvulnerabilities%2Csecurity_rating%2Ccode_smells%2Csqale_rating%2Ccoverage%2Cduplicated_lines_density',
        );
        return res(
          ctx.json({
            measures: [
              {
                metric: 'alert_status',
                value: 'OK',
                component: 'our-service',
              },
              {
                metric: 'alert_status',
                value: 'ERROR',
                component: 'other-service',
              },
              {
                metric: 'bugs',
                value: '2',
                component: 'our-service',
              },
              {
                metric: 'reliability_rating',
                value: '3.0',
                component: 'our-service',
              },
              {
                metric: 'vulnerabilities',
                value: '4',
                component: 'our-service',
              },
              {
                metric: 'security_rating',
                value: '1.0',
                component: 'our-service',
              },
              {
                metric: 'code_smells',
                value: '100',
                component: 'our-service',
              },
              {
                metric: 'sqale_rating',
                value: '2.0',
                component: 'our-service',
              },
              {
                metric: 'coverage',
                value: '55.5',
                component: 'our-service',
              },
              {
                metric: 'duplicated_lines_density',
                value: '1.0',
                component: 'our-service',
              },
            ],
          } as MeasuresWrapper),
        );
      }),
    );
  };

  it('should report finding summary', async () => {
    setupHandlers();

    const client = new SonarQubeClient({ discoveryApi });

    const summary = await client.getFindingSummary('our-service');
    expect(summary).toEqual(
      expect.objectContaining({
        lastAnalysis: '2020-01-01T00:00:00Z',
        metrics: {
          alert_status: 'OK',
          bugs: '2',
          reliability_rating: '3.0',
          vulnerabilities: '4',
          security_rating: '1.0',
          code_smells: '100',
          sqale_rating: '2.0',
          coverage: '55.5',
          duplicated_lines_density: '1.0',
        },
        projectUrl: 'https://sonarcloud.io/dashboard?id=our-service',
      }),
    );
    expect(summary?.getIssuesUrl('CODE_SMELL')).toEqual(
      'https://sonarcloud.io/project/issues?id=our-service&types=CODE_SMELL&resolved=false',
    );
    expect(summary?.getComponentMeasuresUrl('COVERAGE')).toEqual(
      'https://sonarcloud.io/component_measures?id=our-service&metric=coverage&resolved=false&view=list',
    );
  });

  it('should report finding summary (custom baseUrl)', async () => {
    setupHandlers();

    const client = new SonarQubeClient({
      discoveryApi,
      baseUrl: 'http://a.instance.local',
    });

    const summary = await client.getFindingSummary('our-service');

    expect(summary).toEqual(
      expect.objectContaining({
        lastAnalysis: '2020-01-01T00:00:00Z',
        metrics: {
          alert_status: 'OK',
          bugs: '2',
          reliability_rating: '3.0',
          vulnerabilities: '4',
          security_rating: '1.0',
          code_smells: '100',
          sqale_rating: '2.0',
          coverage: '55.5',
          duplicated_lines_density: '1.0',
        },
        projectUrl: 'http://a.instance.local/dashboard?id=our-service',
      }) as FindingSummary,
    );
    expect(summary?.getIssuesUrl('CODE_SMELL')).toEqual(
      'http://a.instance.local/project/issues?id=our-service&types=CODE_SMELL&resolved=false',
    );
    expect(summary?.getComponentMeasuresUrl('COVERAGE')).toEqual(
      'http://a.instance.local/component_measures?id=our-service&metric=coverage&resolved=false&view=list',
    );
  });
});
