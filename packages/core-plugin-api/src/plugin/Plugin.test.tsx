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

import { createPlugin } from './Plugin';

describe('Plugin Feature Flag', () => {
  it('should be able to register and receive feature flags', () => {
    expect(
      createPlugin({
        id: 'test',
        featureFlags: [{ name: 'test' }],
      }).getFeatureFlags(),
    ).toEqual([{ name: 'test' }]);

    expect(
      createPlugin({
        id: 'test',
      }).getFeatureFlags(),
    ).toEqual([]);
  });
});
