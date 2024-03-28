/*
 * Copyright 2023 The Backstage Authors
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

import { readFilterConfig, createFilterByQueryParamFromConfig } from './config';
import { MockConfigApi } from '@backstage/test-utils';

describe('config', () => {
  describe('readFilterConfig', () => {
    it('returns filter data', async () => {
      const mockConfig = new MockConfigApi({
        field: 'pathname',
        operator: '==',
        value: '/home',
      });
      const res = readFilterConfig(mockConfig);
      expect(res).toEqual({
        field: 'pathname',
        operator: '==',
        value: '/home',
      });
    });

    it('returns undefined for invalid filter', async () => {
      const mockInvalidConfig = new MockConfigApi({
        myField: 'pathname',
        operator: '==',
        value: '3',
      });
      const res = readFilterConfig(mockInvalidConfig);
      expect(res).toEqual(undefined);
    });
  });

  describe('createFilterByQueryParamFromConfig', () => {
    it('returns filter data', async () => {
      const mockConfig1 = new MockConfigApi({
        field: 'id',
        operator: '==',
        value: '3',
      });
      const mockConfig2 = new MockConfigApi({
        field: 'pathname',
        operator: '==',
        value: 'path',
      });
      const res = createFilterByQueryParamFromConfig([
        mockConfig1,
        mockConfig2,
      ]);
      expect(res).toEqual([
        { field: 'id', operator: '==', value: '3' },
        { field: 'pathname', operator: '==', value: 'path' },
      ]);
    });

    it('returns only valid filters', async () => {
      const mockValidConfig = new MockConfigApi({
        field: 'id',
        operator: '==',
        value: 3,
      });
      const mockInvalidConfig = new MockConfigApi({
        myField: 'pathname',
        operator: '==',
        value: 'path',
      });
      const res = createFilterByQueryParamFromConfig([
        mockValidConfig,
        mockInvalidConfig,
      ]);
      expect(res).toEqual([{ field: 'id', operator: '==', value: 3 }]);
    });
  });
});
