/*
 * Copyright 2020 Spotify AB
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

import * as index from '.';

describe('test-utils', () => {
  it('exports test utils', () => {
    expect(index).toEqual({
      Keyboard: expect.any(Function),
      MockErrorApi: expect.any(Function),
      MockStorageApi: expect.any(Function),
      mockBreakpoint: expect.any(Function),
      msw: {
        setupDefaultHandlers: expect.any(Function),
      },
      renderInTestApp: expect.any(Function),
      renderWithEffects: expect.any(Function),
      withLogCollector: expect.any(Function),
      wrapInTestApp: expect.any(Function),
      TestApiProvider: expect.any(Function),
    });
  });
});
