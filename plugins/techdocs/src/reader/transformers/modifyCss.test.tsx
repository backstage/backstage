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

import { createTestShadowDom } from '../../test-utils';
import { modifyCss } from '../transformers';

describe('modifyCss', () => {
  it('does not modify css', () => {
    const shadowDom = createTestShadowDom(
      `<div class="md-typeset" style="font-size: 0.8em"></div>`,
      {
        transformers: [],
      },
    );

    const { fontSize } = getComputedStyle(
      shadowDom.querySelector<HTMLElement>('.md-typeset')!,
    );

    expect(fontSize).toBe('0.8em');
  });

  it('does modify css', () => {
    const shadowDom = createTestShadowDom(
      `<div class="md-typeset" style="font-size: 1px"></div>`,
      {
        transformers: [
          modifyCss({
            cssTransforms: {
              '.md-typeset': [{ 'font-size': '1em' }],
            },
          }),
        ],
      },
    );

    const { fontSize } = getComputedStyle(
      shadowDom.querySelector<HTMLElement>('.md-typeset')!,
    );

    expect(fontSize).toBe('1em');
  });
});
