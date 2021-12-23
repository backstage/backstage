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
import { GoCdBuildsComponent } from './GoCdBuildsComponent';
import { GoCdApi } from '../../api/gocdApi';

let entityValue: {
  entity: { metadata: { annotations?: { [key: string]: string } } };
};

const mockApiClient: GoCdApi = {
  getPipelineHistory: jest.fn(async () => ({
    _links: { next: { href: 'some-href' } },
    pipelines: [],
  })),
};

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entityValue;
  },
}));

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockApiClient,
}));

describe('GoCdArtifactsComponent', () => {
  entityValue = { entity: { metadata: {} } };

  const renderComponent = () => render(<GoCdBuildsComponent />);

  it('should display an empty state if an app annotation is missing', async () => {
    const rendered = renderComponent();

    expect(await rendered.findByText('Missing Annotation')).toBeInTheDocument();
  });
});
