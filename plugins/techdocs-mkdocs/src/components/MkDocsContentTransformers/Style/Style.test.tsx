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

// the import order matters, should be the first
import { createDom } from '../../../test-utils';

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import {
  techdocsStorageApiRef,
  TechDocsShadowDomProvider,
} from '@backstage/plugin-techdocs';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';

import { StylesTransformer } from './Style';

const apiOrigin = 'https://backstage.io/api/techdocs';
const getApiOrigin = jest.fn().mockResolvedValue(apiOrigin);
const baseUrl = 'https://backstage.io/docs/backstage';
const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);
const techdocsStorageApiMock = { getApiOrigin, getBaseUrl };

describe('Style', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should inject style overrides', async () => {
    const dom = createDom(<head />);

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[techdocsStorageApiRef, techdocsStorageApiMock]]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <StylesTransformer />
          </TechDocsShadowDomProvider>
          ,
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(dom.querySelector('style')).not.toBeNull();
    });
  });

  it('Should contains all css rules', async () => {
    const dom = createDom(<head />);

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[techdocsStorageApiRef, techdocsStorageApiMock]]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <StylesTransformer />
          </TechDocsShadowDomProvider>
          ,
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      const style = dom.querySelector('style');
      // variables
      expect(style?.textContent).toMatch(/:host/);
      // reset
      expect(style?.textContent).toMatch(/body/);
      // layout
      expect(style?.textContent).toMatch(/.md-grid/);
      // typeset
      expect(style?.textContent).toMatch(/.md-typeset/);
      // animations
      expect(style?.textContent).toMatch(/transition: none/);
      // extensions
      expect(style?.textContent).toMatch(/.highlight/);
    });
  });
});
