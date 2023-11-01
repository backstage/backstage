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
import { CITable } from './CITable';

import pipelines from './__fixtures__/pipelines.json';
import { circleCIRouteRef } from '../../../../route-refs';

describe('CITable', () => {
  const rerunWorkflow = jest.fn();
  const onFetchMore = jest.fn();

  const renderComponent = (props = {}) =>
    renderInTestApp(
      <CITable
        pipelines={[]}
        projectName="circleci-table"
        loading={false}
        rerunWorkflow={rerunWorkflow}
        onFetchMore={onFetchMore}
        hasMore
        {...props}
      />,
      {
        mountedRoutes: {
          '/circle-ci': circleCIRouteRef,
        },
      },
    );

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display pipelines table', async () => {
    const rendered = await renderComponent();

    expect(rendered.getByText('Pipeline')).toBeInTheDocument();
    expect(rendered.getByText('Status')).toBeInTheDocument();
    expect(rendered.getByText('Workflow')).toBeInTheDocument();
    expect(rendered.getByText('Branch / Commit')).toBeInTheDocument();
    expect(rendered.getByText('Start')).toBeInTheDocument();
    expect(rendered.getByText('Actions')).toBeInTheDocument();
  });

  it('should display progress when in loading state', async () => {
    const rendered = await renderComponent({ loading: true });

    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });

  it('should display fetch more button', async () => {
    const rendered = await renderComponent();

    expect(
      await rendered.findByText('More', { selector: 'button > *' }),
    ).toBeInTheDocument();
  });

  it('should not display fetch more button when has no more pages', async () => {
    const rendered = await renderComponent({ hasMore: false });

    expect(rendered.queryByText('More', { selector: 'button > *' })).toBeNull();
  });

  it('should display workflow', async () => {
    jest.useFakeTimers({ now: new Date('2023-10-23T14:00:00Z') });
    const rendered = await renderComponent({
      pipelines: [pipelines.singleWorkflow],
    });

    expect(rendered.getByText('4177')).toBeInTheDocument();
    expect(rendered.getByText('success')).toBeInTheDocument();
    expect(rendered.getByText('pipeline-trigger')).toBeInTheDocument();
    expect(
      rendered.getByText('test: Fix test for new API client'),
    ).toBeInTheDocument();
    expect(rendered.getByText('run 6 days ago')).toBeInTheDocument();
    expect(rendered.getByText('took 9 minutes')).toBeInTheDocument();
    expect(rendered.getByTitle('Rerun workflow')).toBeInTheDocument();
    expect(
      rendered.getByText('ci', { selector: 'a' }).getAttribute('href'),
    ).toBe('/circle-ci/workflows/4d97ce7e-5f0b-4b09-bc6f-732ec3d079d0');
  });

  it('should display multiple workflows in a pipeline', async () => {
    const rendered = await renderComponent({
      pipelines: [pipelines.twoWorkflows],
    });

    expect(rendered.getByText('4170')).toBeInTheDocument();
    expect(rendered.getByText('success')).toBeInTheDocument();
    expect(rendered.getByText('unauthorized')).toBeInTheDocument();
    expect(
      rendered.getAllByText('dependabot/go_modules/golang.org/x/net-0.17.0')
        .length,
    ).toBe(2);
  });

  it('should display pipeline with no workflows', async () => {
    const rendered = await renderComponent({
      pipelines: [pipelines.noWorkflows],
    });

    expect(rendered.getByText('4158')).toBeInTheDocument();
    expect(rendered.getByText('No Workflow')).toBeInTheDocument();
  });
});
