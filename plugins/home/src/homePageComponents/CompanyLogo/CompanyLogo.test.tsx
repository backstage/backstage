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
import { CompanyLogo } from './CompanyLogo';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { Typography } from '@material-ui/core';
import React from 'react';

describe('<CompanyLogo>', () => {
  it('should have a fall back if logo is not provided', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[[configApiRef, new ConfigReader({ app: { title: 'My App' } })]]}
      >
        <CompanyLogo />
      </TestApiProvider>,
    );

    expect(getByRole('heading', { name: 'My App' })).toBeInTheDocument();
  });

  it('should show provided company logo', async () => {
    const { getByRole } = await renderInTestApp(
      <CompanyLogo logo={<Typography variant="h1">Backstage</Typography>} />,
    );

    expect(getByRole('heading', { name: 'Backstage' })).toBeInTheDocument();
  });
});
