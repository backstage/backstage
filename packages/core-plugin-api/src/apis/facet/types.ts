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

import { PluginContext } from '../../plugin-context';
import { ApiRef } from '../system';

/**
 * Context for a (possibly) unique facet of an API
 */
export interface ApiFacetContext {
  /**
   * The API that depends on this API
   */
  dependent?: ApiRef<unknown>;

  /**
   * The plugin that is using the API
   */
  pluginStack?: PluginContext[];
}

/**
 * An API that is facetted, meaning it can provide unique clones/facets of
 * itself to dependent APIs.
 */
export type FacettedApi<Api> = Api & {
  getApiFacet?: (context: ApiFacetContext) => FacettedApi<Api>;
};
