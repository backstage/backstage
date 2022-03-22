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
import fetchMock from 'jest-fetch-mock';

import {
  techdocsStorageApiRef,
  TechDocsShadowDomProvider,
} from '@backstage/plugin-techdocs';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';

import { ImageTransformer } from './Image';

const baseUrl = 'https://backstage.io/logo.png';
const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);
const techdocsStorageApiMock = {
  getBaseUrl,
};

describe('Image', () => {
  const { location } = window;

  beforeAll(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { hash: '' };
  });

  afterAll(() => {
    window.location = location;
  });
  it('Should replace relative path with the base URL', async () => {
    const dom = createDom(
      <body>
        <img src="logo.png" alt="logo" />
      </body>,
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[techdocsStorageApiRef, techdocsStorageApiMock]]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <ImageTransformer />
          </TechDocsShadowDomProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(dom.querySelector('[alt="logo"]')?.getAttribute('src')).toBe(
        baseUrl,
      );
    });
  });

  it('Should render svg as inline data url', async () => {
    const response = 'text';
    fetchMock.mockResponse(response);

    const dom = createDom(
      <body>
        <img src="logo.svg" alt="logo" />
      </body>,
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[techdocsStorageApiRef, techdocsStorageApiMock]]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <ImageTransformer />
          </TechDocsShadowDomProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(dom.querySelector('[alt="logo"]')?.getAttribute('src')).toBe(
        `data:image/svg+xml;base64,${btoa(response)}`,
      );
    });
  });
});
