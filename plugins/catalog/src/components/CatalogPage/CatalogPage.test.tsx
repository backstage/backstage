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
import { ApiRegistry, ApiProvider, errorApiRef } from '@backstage/core';
import { wrapInTestApp } from '@backstage/test-utils';
import { catalogApiRef } from '../..';

const errorApi = { post: () => {} };
const catalogApi = { getEntities: () => Promise.resolve([{ kind: '' }]) };

describe('CatalogPage', () => {
  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [catalogApiRef, catalogApi],
          ])}
        >
          <CatalogPage />
        </ApiProvider>,
      ),
    );
    expect(
      await rendered.findByText('Keep track of your software'),
    ).toBeInTheDocument();
  });
});
