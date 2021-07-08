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

import { classNames } from './';

describe('utils', () => {
  describe('classNames', () => {
    it('should concatinate strings', () => {
      expect(classNames('class1', 'class2', 'class3')).toEqual(
        'class1 class2 class3',
      );
    });

    it('should not include values null, undefined or empty strings', () => {
      expect(classNames('class1', undefined, null, '')).toEqual('class1');
    });

    it('should handle strings with boolean expressions', () => {
      expect(classNames(true && 'class1', false && 'class2', false)).toEqual(
        'class1',
      );
    });
  });
});
