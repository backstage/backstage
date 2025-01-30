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
import {
  currentToDeclaredResourceToPerc,
  podStatusToCpuUtil,
  podStatusToMemoryUtil,
} from './pod';
import { SubvalueCell } from '@backstage/core-components';

describe('pod', () => {
  describe('currentToDeclaredResourceToPerc', () => {
    it.each([
      [10, 100],
      [10, '100'],
      ['10', 100],
      ['10', '100'],
      ['10', 100.0],
      [10.0, '100'],
      [10.1, '100'],
      ['10', 100.1],
      ['10.0', 100.1],
    ])('%p out of %p gives 10%%', (current, resource) =>
      expect(currentToDeclaredResourceToPerc(current, resource)).toBe('10%'),
    );
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
        <SubvalueCell
          subvalue="limits: 50% of 100m"
          value="requests: 99% of 50m"
        />,
      );
    });
  });
  describe('podStatusToMemoryUtil', () => {
    it('does use correct units', () => {
      const result = podStatusToMemoryUtil({
        memory: {
          // ~91.5 MiB
          currentUsage: '95948800',
          // 320 MiB
          limitTotal: '335544320',
          // 192 MiB
          requestTotal: '201326592',
        },
      } as any);
      expect(result).toStrictEqual(
        <SubvalueCell
          subvalue="limits: 28% of 320MiB"
          value="requests: 47% of 192MiB"
        />,
      );
    });
  });
});
