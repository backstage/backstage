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

import React from 'react';
import { currentToDeclaredResourceToPerc, podStatusToCpuUtil } from './pod';
import { SubvalueCell } from '@backstage/core-components';

describe('pod', () => {
  describe('currentToDeclaredResourceToPerc', () => {
    it('10%', () => {
      const tests: (number | string)[][] = [
        [10, 100],
        [10, '100'],
        ['10', 100],
        ['10', '100'],
      ];
      tests.forEach(([a, b]) => {
        const result = currentToDeclaredResourceToPerc(a, b);
        expect(result).toBe('10%');
      });
    });
  });
  describe('podStatusToCpuUtil', () => {
    it('does use correct units', () => {
      const result = podStatusToCpuUtil({
        cpu: {
          // ~50m
          currentUsage: 0.4966115,
          // 50m
          requestTotal: 0.05,
          // 100m
          limitTotal: 0.1,
        },
      } as any);
      expect(result).toStrictEqual(
        <SubvalueCell subvalue="limits: 50%" value="requests: 99%" />,
      );
    });
  });
});
