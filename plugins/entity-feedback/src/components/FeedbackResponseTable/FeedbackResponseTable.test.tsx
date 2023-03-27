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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { EntityFeedbackApi, entityFeedbackApiRef } from '../../api';
import { FeedbackResponseTable } from './FeedbackResponseTable';

describe('FeedbackResponseTable', () => {
  const sampleResponses = [
    {
      userRef: 'user:default/foo',
      consent: true,
      response: 'resp1,resp2',
      comments: 'test comment 1',
    },
    {
      userRef: 'user:default/bar',
      consent: false,
      response: 'resp3,resp4',
      comments: 'test comment 2',
    },
  ];

  const feedbackApi: Partial<EntityFeedbackApi> = {
    getResponses: jest.fn().mockImplementation(async () => sampleResponses),
  };

  const render = async (props: any = {}) =>
    renderInTestApp(
      <TestApiProvider apis={[[entityFeedbackApiRef, feedbackApi]]}>
        <FeedbackResponseTable {...props} entityRef="component:default/test" />
      </TestApiProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all responses correctly', async () => {
    const rendered = await render();

    expect(feedbackApi.getResponses).toHaveBeenCalledWith(
      'component:default/test',
    );

    expect(rendered.getByText('Entity Responses')).toBeInTheDocument();

    expect(rendered.getByText('foo')).toBeInTheDocument();
    expect(rendered.getByText('resp1')).toBeInTheDocument();
    expect(rendered.getByText('resp2')).toBeInTheDocument();
    expect(rendered.getByText('test comment 1')).toBeInTheDocument();
    expect(rendered.getByText('bar')).toBeInTheDocument();
    expect(rendered.getByText('resp3')).toBeInTheDocument();
    expect(rendered.getByText('resp4')).toBeInTheDocument();
    expect(rendered.getByText('test comment 2')).toBeInTheDocument();
  });

  it('renders a custom title correctly', async () => {
    const rendered = await render({ title: 'Custom Title' });
    expect(rendered.getByText('Custom Title')).toBeInTheDocument();
  });
});
