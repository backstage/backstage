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

describe('catalog-unprocessed-entities alpha entry point', () => {
  it('does not load page layout UI until the DevTools content loader runs', () => {
    jest.doMock('@backstage/ui', () => {
      throw new Error('Backstage UI was loaded eagerly');
    });

    expect(() => require('./plugin')).not.toThrow();
  });
});
