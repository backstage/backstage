/*
 * Copyright 2020 Spotify AB
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
import CatalogPage from './CatalogPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { ComponentFactory } from '../../data/component';

const testComponentFactory: ComponentFactory = {
  getAllComponents: jest.fn(() => Promise.resolve([{ name: 'test' }])),
  getComponentByName: jest.fn(() => Promise.resolve({ name: 'test' })),
  removeComponentByName: jest.fn(() => Promise.resolve(true)),
};

describe('CatalogPage', () => {
  it('should render', async () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <CatalogPage componentFactory={testComponentFactory} />
      </ThemeProvider>,
    );
    expect(
      await rendered.findByText('Keep track of your software'),
    ).toBeInTheDocument();
  });
});
