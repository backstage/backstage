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

import { isOfKind } from './isOfKind';

describe('isOfKind', () => {
  describe('toQuery', () => {
    it('infers apigroup and version given pods', () => {
      expect(
        isOfKind.toQuery({
          kind: 'pods',
        }),
      ).toEqual({
        objectType: 'pods',
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      });
    });
    it('infers apigroup and version given deployments', () => {
      expect(
        isOfKind.toQuery({
          kind: 'deployments',
        }),
      ).toEqual({
        objectType: 'deployments',
        group: 'apps',
        apiVersion: 'v1',
        plural: 'deployments',
      });
    });
    it('throws error when provided an invalid kind', () => {
      expect(() => {
        isOfKind.toQuery({ kind: 'lobsters' });
      }).toThrow("Invalid Kind 'lobsters'");
    });
  });
});
