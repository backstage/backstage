/*
 * Copyright 2020 The Backstage Authors
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

import { Location, Path } from 'history';
import { isEqual, isMatch } from 'lodash';
import qs from 'qs';

export function isLocationMatch(currentLocation: Location, toLocation: Path) {
  const toDecodedSearch = new URLSearchParams(toLocation.search).toString();
  const toQueryParameters = qs.parse(toDecodedSearch);

  const currentDecodedSearch = new URLSearchParams(
    currentLocation.search,
  ).toString();
  const currentQueryParameters = qs.parse(currentDecodedSearch);

  const matching =
    isEqual(toLocation.pathname, currentLocation.pathname) &&
    isMatch(currentQueryParameters, toQueryParameters);

  return matching;
}
