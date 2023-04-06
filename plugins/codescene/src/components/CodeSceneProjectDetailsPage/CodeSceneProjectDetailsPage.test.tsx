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
import React from 'react';
import { CodeSceneProjectDetailsPage } from './CodeSceneProjectDetailsPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  setupRequestMockHandlers,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { CodeSceneApi, codesceneApiRef } from '../../api/api';
import { ApiProvider } from '@backstage/core-app-api';
import { Analysis } from '../../api/types';
import { ConfigReader } from '@backstage/config';
import { configApiRef } from '@backstage/core-plugin-api';

describe('CodeSceneProjectDetailsPage', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);
  let apis: TestApiRegistry;

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );

    const config = new ConfigReader({
      codescene: {
        baseUrl: 'www.fake-url.com',
      },
    });

    const analysis: Analysis = {
      id: 1,
      name: 'test-project',
      project_id: 123,
      readable_analysis_time: '2022-03-22',
      summary: {
        unique_issue_ids: 0,
        issues_filtered_as_outliers: 0,
        entities: 0,
        commits_with_issue_ids: 0,
        authors_count: 0,
        active_authors_count: 0,
        issues_with_cycle_time: 0,
        commits: 0,
        issue_ids_matched_to_issues: 0,
        issues_classed_as_defects: 0,
        issues_with_cost: 0,
      },
      file_summary: [],
      high_level_metrics: {
        current_score: 0,
        month_score: 0,
        year_score: 0,
        active_developers: 0,
        lines_of_code: 0,
        system_mastery: 0,
      },
    };
    apis = TestApiRegistry.from(
      [
        codesceneApiRef,
        {
          fetchLatestAnalysis: jest.fn(() => analysis),
        } as unknown as CodeSceneApi,
      ],
      [configApiRef, config],
    );
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CodeSceneProjectDetailsPage />
      </ApiProvider>,
    );
    expect(rendered.getByText('CodeScene: test-project')).toBeInTheDocument();
  });
});
