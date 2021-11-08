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

import { isValidUrl } from './urls';

describe('isValidUrl', () => {
  it('should return true for url', () => {
    const validUrl = isValidUrl('http://some.valid.url');
    expect(validUrl).toBe(true);
  });

  it('should return false for absolute path', () => {
    const validUrl = isValidUrl('/some/absolute/path');
    expect(validUrl).toBe(false);
  });

  it('should return false for relative path', () => {
    const validUrl = isValidUrl('../some/relative/path');
    expect(validUrl).toBe(false);
  });
});
