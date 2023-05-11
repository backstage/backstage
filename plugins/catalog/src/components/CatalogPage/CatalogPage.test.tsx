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
import { screen } from '@testing-library/react';
import { useOutlet } from 'react-router-dom';
import { CatalogPage } from './CatalogPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutlet: jest.fn().mockReturnValue('Route Children'),
}));

jest.mock('./DefaultCatalogPage', () => ({
  DefaultCatalogPage: jest.fn().mockReturnValue('DefaultCatalogPage'),
}));

describe('CatalogPage', () => {
  it('renders provided router element', async () => {
    await renderInTestApp(<CatalogPage />);

    expect(screen.getByText('Route Children')).toBeInTheDocument();
  });

  it('renders DefaultCatalogPage home when no router children are provided', async () => {
    (useOutlet as jest.Mock).mockReturnValueOnce(null);
    await renderInTestApp(<CatalogPage />);

    expect(screen.getByText('DefaultCatalogPage')).toBeInTheDocument();
  });
});
