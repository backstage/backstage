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
import React from 'react';
import { StackstormHome } from './StackstormHome';
import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { StackstormApi, stackstormApiRef } from '../../api';

describe('StackstormHome', () => {
  const mockApi: jest.Mocked<StackstormApi> = {
    getExecutions: jest.fn().mockResolvedValue([]),
    getExecution: jest.fn().mockResolvedValue({}),
    getPacks: jest.fn().mockResolvedValue([]),
    getActions: jest.fn().mockResolvedValue([]),
  } as any;

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <StackstormHome />
      </TestApiProvider>,
    );
    expect(screen.getByText('Welcome to StackStorm!')).toBeInTheDocument();
  });

  it('should render props', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <StackstormHome
          title="Test Title"
          subtitle="Test Subtitle"
          headerButtons={[<h1>Test Header Button</h1>]}
        />
      </TestApiProvider>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Header Button')).toBeInTheDocument();
  });
});
