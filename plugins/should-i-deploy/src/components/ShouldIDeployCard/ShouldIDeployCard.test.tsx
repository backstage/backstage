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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ShouldIDeployCard } from './ShouldIDeployCard';
import { ShouldIDeployCIApiRef } from '../../api';
import { ShouldIDeployCIApi } from '../../api/ShouldIDeployCIApi';
import { screen, fireEvent } from '@testing-library/react';

const mockSuccessApiRef = {
  get: jest.fn(() =>
    Promise.resolve({
      message: "It's a good day to deploy!",
      date: new Date().toISOString(),
    }),
  ),
};

describe('ShouldIDeployCard', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            ShouldIDeployCIApiRef,
            mockSuccessApiRef as unknown as ShouldIDeployCIApi,
          ],
        ]}
      >
        <ShouldIDeployCard />
      </TestApiProvider>,
    );
  });

  it('should render the card with data', async () => {
    await screen.findByText("It's a good day to deploy!");
    expect(screen.getByText('Should I Deploy Today?')).toBeInTheDocument();
    expect(screen.getByText("It's a good day to deploy!")).toBeInTheDocument();
    expect(screen.getByText('Click')).toBeInTheDocument();
  });

  it('should reload data on click', async () => {
    await screen.findByText("It's a good day to deploy!");
    fireEvent.click(screen.getByText('Click'));
    expect(
      await screen.findByText("It's a good day to deploy!"),
    ).toBeInTheDocument();
  });
});
