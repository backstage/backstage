/*
 * Copyright 2020 Spotify AB
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

import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { QueryParams } from '../filter/types';
import { parse } from '../utils/history';

export type PageFilters = {
  pageFilters?: Partial<QueryParams>;
};

export function useQueryParams(): PageFilters {
  const location: Location = useLocation();
  const pageFilters = parse(location.search);

  return {
    pageFilters: pageFilters,
  };
}
