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
import * as React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '@backstage/test-utils';
import CatalogTable from './CatalogTable';
import { Component } from '../../data/component';

const components: Component[] = [
  { name: 'component1' },
  { name: 'component2' },
  { name: 'component3' },
];

describe('CatalogTable component', () => {
  it('should render loading when loading prop it set to true', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <CatalogTable titlePreamble="Owned" components={[]} loading />,
      ),
    );
    const progress = await rendered.findByTestId('progress');
    expect(progress).toBeInTheDocument();
  });

  it('should render error message when error is passed in props', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <CatalogTable
          titlePreamble="Owned"
          components={[]}
          loading={false}
          error={{ code: 'error' }}
        />,
      ),
    );
    const errorMessage = await rendered.findByText(
      'Error encountered while fetching components.',
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display component names when loading has finished and no error occurred', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <CatalogTable
          titlePreamble="Owned"
          components={components}
          loading={false}
        />,
      ),
    );
    expect(
      await rendered.findByText(`Owned (${components.length})`),
    ).toBeInTheDocument();
    expect(await rendered.findByText('component1')).toBeInTheDocument();
    expect(await rendered.findByText('component2')).toBeInTheDocument();
    expect(await rendered.findByText('component3')).toBeInTheDocument();
  });
});
