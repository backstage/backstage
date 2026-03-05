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

import { DefaultDocsBuildStrategy } from './DefaultDocsBuildStrategy';
import { ConfigReader } from '@backstage/config';

describe('DefaultDocsBuildStrategy', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: '0',
      name: 'test',
    },
  };

  describe('shouldBuild', () => {
    it('should return true when techdocs.builder is set to local', async () => {
      const defaultDocsBuildStrategy = DefaultDocsBuildStrategy.fromConfig(
        new ConfigReader({
          techdocs: {
            builder: 'local',
          },
        }),
      );

      const result = await defaultDocsBuildStrategy.shouldBuild({ entity });

      expect(result).toBe(true);
    });

    it('should return true when techdocs.builder is not set', async () => {
      const defaultDocsBuildStrategy = DefaultDocsBuildStrategy.fromConfig(
        new ConfigReader({ techdocs: {} }),
      );

      const result = await defaultDocsBuildStrategy.shouldBuild({ entity });
      expect(result).toBe(true);
    });

    it('should return false when techdocs.builder is set to external', async () => {
      const defaultDocsBuildStrategy = DefaultDocsBuildStrategy.fromConfig(
        new ConfigReader({
          techdocs: {
            builder: 'external',
          },
        }),
      );

      const result = await defaultDocsBuildStrategy.shouldBuild({ entity });
      expect(result).toBe(false);
    });
  });
});
