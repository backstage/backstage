/*
 * Copyright 2025 The Backstage Authors
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

import { createExtensionBlueprint } from '@backstage/frontend-plugin-api';
import { searchResultTypeDataRef } from './types';

/** @alpha */
export interface SearchFilterResultTypeBlueprintParams {
  /**
   * The value of the result type.
   */
  value: string;
  /**
   * The name of the result type.
   */
  name: string;
  /**
   * The icon of the result type.
   */
  icon: JSX.Element;
}

/**
 * @alpha
 */
export const SearchFilterResultTypeBlueprint = createExtensionBlueprint({
  kind: 'search-filter-result-type',
  attachTo: {
    id: 'page:search',
    input: 'resultTypes',
  },
  output: [searchResultTypeDataRef],
  dataRefs: {
    resultType: searchResultTypeDataRef,
  },
  *factory(params: SearchFilterResultTypeBlueprintParams) {
    yield searchResultTypeDataRef({
      value: params.value,
      name: params.name,
      icon: params.icon,
    });
  },
});
