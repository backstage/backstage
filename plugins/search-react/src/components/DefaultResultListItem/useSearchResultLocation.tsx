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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { SearchDocument } from '@backstage/plugin-search-common';

/**
 * Builds a search result url.
 * @param document - A search result item.
 * @returns Add app base url as location prefix when location is relative.
 */
export const useSearchResultLocation = (document: SearchDocument) => {
  const configApi = useApi(configApiRef);

  let location = document.location;

  const isRelative = !location.match(/^([a-z]*:)?\/\//i);
  if (isRelative) {
    location = configApi.getString('app.baseUrl').concat(location);
  }

  return location;
};
