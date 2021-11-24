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

import { classNames, getValues, sumField } from './';
import { getAverageDuration, getErrorRatios } from './buildData';

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

  describe('sumFields', () => {
    it('should sum the given field', () => {
      expect(sumField(e => e.a, [{ a: 1 }, { a: 1 }, { a: 1, b: 10 }])).toEqual(
        3,
      );
      expect(sumField(e => (e as any).field)).toBeUndefined();
    });
  });

  describe('getValues', () => {
    it('should return the values of the specified field', () => {
      expect(getValues(e => e.a, [{ a: 1 }, { a: 2, b: 10 }])).toEqual([1, 2]);
      expect(getValues(e => (e as any).field)).toBeUndefined();
      expect(getValues(e => e.field, [] as { field: any }[])).toBeUndefined();
    });
  });

  describe('getErrorRatios', () => {
    it('should return the ratio between errors and builds', () => {
      expect(
        getErrorRatios([{ day: '2021-01-01', errors: 10, builds: 1 }]),
      ).toEqual([10]);
      expect(
        getErrorRatios([{ day: '2021-01-01', errors: 0, builds: 0 }]),
      ).toEqual([0]);
      expect(getErrorRatios()).toBeUndefined();
    });
  });

  describe('getAverageDuration', () => {
    it('should return the average duration', () => {
      const data = [
        {
          day: '2021-01-01',
          durationP50: 3.0,
          durationP95: 0,
          totalDuration: 0,
        },
        {
          day: '2021-01-01',
          durationP50: 1.0,
          durationP95: 0,
          totalDuration: 0,
        },
      ];
      expect(getAverageDuration(data, e => e.durationP50)).toMatch('2 s');
      expect(getAverageDuration([], e => e.durationP50)).toBeUndefined();
    });
  });
});
