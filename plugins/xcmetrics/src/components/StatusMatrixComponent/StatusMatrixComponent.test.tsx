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
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import userEvent from '@testing-library/user-event';
import { StatusMatrixComponent } from './StatusMatrixComponent';
import { XcmetricsApi, xcmetricsApiRef } from '../../api';
import { formatStatus } from '../../utils';

describe('StatusMatrixComponent', () => {
  it('should render', async () => {
    const mockId = 'mockId';
    const mockStatus = 'succeeded';
    const mockApi: jest.Mocked<XcmetricsApi> = {
      getBuildStatuses: jest
        .fn()
        .mockResolvedValue([{ id: mockId, buildStatus: mockStatus }]),
      getBuild: jest.fn().mockResolvedValue({
        id: mockId,
        buildStatus: mockStatus,
        duration: 10.0,
        startTimestamp: new Date().getTime().toString(),
      }),
      getBuilds: jest.fn().mockResolvedValue([]),
    };

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(xcmetricsApiRef, mockApi)}>
        <StatusMatrixComponent />
      </ApiProvider>,
    );

    const cell = rendered.getByTestId(mockId);
    expect(cell).toBeInTheDocument();

    userEvent.hover(cell);
    expect(
      await rendered.findByText(formatStatus(mockStatus)),
    ).toBeInTheDocument();
  });
});
