/*
 * Copyright 2026 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import { EntityFilter } from '@backstage/plugin-catalog-react';
import { TechDocsPicker } from './TechDocsPicker';

describe('TechDocsPicker', () => {
  it('queries for entities with techdocs-ref or techdocs-entity annotations', async () => {
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider value={{ updateFilters }}>
        <TechDocsPicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenCalled();
    const { techdocs } = updateFilters.mock.calls[0][0] as {
      techdocs: EntityFilter;
    };
    expect(techdocs.getCatalogQuery?.()).toEqual({
      $any: [
        {
          [`metadata.annotations.${TECHDOCS_ANNOTATION}`]: { $exists: true },
        },
        {
          [`metadata.annotations.${TECHDOCS_EXTERNAL_ANNOTATION}`]: {
            $exists: true,
          },
        },
      ],
    });
  });
});
