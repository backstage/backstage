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
import { renderInTestApp } from '@backstage/test-utils';
import { BuildTimelineComponent } from './BuildTimelineComponent';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

describe('BuildTimelineComponent', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <BuildTimelineComponent
        targets={[client.mockTarget]}
        height={100}
        width={100}
      />,
    );
    expect(
      await rendered.findByText(client.mockTarget.name),
    ).toBeInTheDocument();
  });

  it('should render a message if no targets are provided', async () => {
    const rendered = await renderInTestApp(
      <BuildTimelineComponent targets={[]} />,
    );
    expect(rendered.getByText('No Targets')).toBeInTheDocument();
  });
});
