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

import React, { PropsWithChildren } from 'react';
import { CatalogApi } from '@backstage/catalog-client';
import { catalogApiRef } from '../api';
import { renderHook } from '@testing-library/react-hooks';
import { useEntityKinds } from './useEntityKinds';
import { TestApiProvider } from '@backstage/test-utils';

const mockCatalogApi: Partial<CatalogApi> = {
  getEntityFacets: jest.fn().mockResolvedValue({
    facets: {
      kind: [
        { value: 'Template', count: 2 },
        { value: 'System', count: 1 },
        { value: 'Component', count: 3 },
      ],
    },
  }),
};

const wrapper = ({ children }: PropsWithChildren<{}>) => {
  return (
    <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
      {children}
    </TestApiProvider>
  );
};

describe('useEntityKinds', () => {
  it('gets entity kinds', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useEntityKinds(),
      { wrapper },
    );
    await waitForValueToChange(() => result.current);
    expect(result.current.kinds).toEqual(['Component', 'System', 'Template']);
  });
});
