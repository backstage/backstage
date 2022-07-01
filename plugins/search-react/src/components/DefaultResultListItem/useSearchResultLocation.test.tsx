/*
 * Copyright 2022 The Backstage Authors
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
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, WrapperComponent } from '@testing-library/react-hooks';
import { useSearchResultLocation } from './useSearchResultLocation';

describe('useSearchResultLocation', () => {
  const baseUrl = 'http://localhost:3000/example';
  const configApiMock = new ConfigReader({ app: { baseUrl } });
  const wrapper: WrapperComponent<{}> = ({ children }) => (
    <TestApiProvider apis={[[configApiRef, configApiMock]]}>
      {children}
    </TestApiProvider>
  );

  it('should concatenate base url into relative urls', () => {
    const document = {
      title: 'artist-lookup',
      text: 'Artist Lookup',
      location: '/catalog/default/component/artist-lookup',
    };

    const { result } = renderHook(() => useSearchResultLocation(document), {
      wrapper,
    });

    expect(result.current).toBe(baseUrl.concat(document.location));
  });

  it('should not concatenate base url into absolute urls', () => {
    const document = {
      title: 'What is Backstage?',
      text: 'An open platform for building developer portals ',
      location: 'https://stackoverflow.com/questions/1/what-is-backstage',
    };

    const { result } = renderHook(() => useSearchResultLocation(document), {
      wrapper,
    });

    expect(result.current).toBe(document.location);
  });
});
