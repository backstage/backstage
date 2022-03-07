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
import { Location, Path } from 'history';
import { isLocationMatch } from './utils';

describe('isLocationMatching', () => {
  let currentLocation: Location;
  let toLocation: Path;

  it('return false when pathname in target and current location differ', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?kind=component',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = {
      pathname: '/catalog-a',
      search: '?kind=component',
      hash: '',
    };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(false);
  });

  it('return true when exact match between current and target location parameters', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?kind=component',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = { pathname: '/catalog', search: '?kind=component', hash: '' };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(true);
  });

  it('return true when target query parameters are subset of current location query parameters', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?x=foo&y=bar',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = { pathname: '/catalog', search: '?x=foo', hash: '' };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(true);
  });

  it('return false when no matching query parameters between target and current location', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?y=bar',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = { pathname: '/catalog', search: '?x=foo', hash: '' };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(false);
  });

  it('return true when query parameters match in different order', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?y=bar&x=foo',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = { pathname: '/catalog', search: '?x=foo&y=bar', hash: '' };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(true);
  });

  it('return true when there is a matching query parameter alongside extra parameters', async () => {
    currentLocation = {
      pathname: '/catalog',
      search: '?y=bar&x=foo',
      state: null,
      hash: '',
      key: '',
    };
    toLocation = { pathname: '/catalog', search: '', hash: '' };
    expect(isLocationMatch(currentLocation, toLocation)).toBe(true);
  });
});
