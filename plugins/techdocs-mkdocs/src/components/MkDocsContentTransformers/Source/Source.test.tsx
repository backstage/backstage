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

import { SourceTransformer } from './Source';

const navigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const baseUrl = 'https://backstage.io/demo.mp4';
const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);
const techdocsStorageApiMock = { getBaseUrl };

describe('Source', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should replace relative path with the base URL', async () => {
    const dom = createDom(
      <body>
        <source type="video/mp4" src="demo.mp4" />
      </body>,
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[techdocsStorageApiRef, techdocsStorageApiMock]]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <SourceTransformer />
          </TechDocsShadowDomProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(dom.querySelector('[type="video/mp4"')?.getAttribute('src')).toBe(
        baseUrl,
      );
    });
  });
});
