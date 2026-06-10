/*
 * Copyright 2026 The Backstage Authors
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
import { GithubConnectionType } from '../schema/github';
import { getConnectionType, isConnectionTypeKey } from './lookup';

describe('definitions/lookup', () => {
  describe('getConnectionType', () => {
    it('returns the github connection type for "github"', () => {
      expect(getConnectionType('github')).toBe(GithubConnectionType);
    });
  });

  describe('isConnectionTypeKey', () => {
    it('returns true for a registered connection type', () => {
      expect(isConnectionTypeKey('github')).toBe(true);
    });

    it('returns false for an unregistered connection type', () => {
      expect(isConnectionTypeKey('bitbucket')).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isConnectionTypeKey('')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isConnectionTypeKey(undefined)).toBe(false);
    });
  });
});
