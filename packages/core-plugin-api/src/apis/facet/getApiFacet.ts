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

import { FacettedApi, ApiFacetContext } from './types';

/**
 * Returns a facet of an api, if the api is facetted, otherwise returns the api
 * as is.
 */
export function getApiFacet<Api>(api: Api, context: ApiFacetContext): Api {
  if (typeof (api as FacettedApi<typeof api>).getApiFacet === 'function') {
    return (api as FacettedApi<typeof api>).getApiFacet!(context);
  }
  return api;
}
