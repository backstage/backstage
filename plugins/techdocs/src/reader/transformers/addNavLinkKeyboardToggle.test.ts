/*
 * Copyright 2020 The Backstage Authors
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

import { addNavLinkKeyboardToggle } from './addNavLinkKeyboardToggle';
import { createTestShadowDom } from '../../test-utils';
import { act } from '@testing-library/react';

describe('addNavLinkKeyboardToggle', () => {
  it('adds tabindex and toggles checkbox on Enter/Space', async () => {
    let shadowDom: ShadowRoot;
    await act(async () => {
      shadowDom = await createTestShadowDom(
        `
				<input type="checkbox" id="cb1" />
				<label class="md-nav__link" for="cb1">Section</label>
				`,
        {
          preTransformers: [],
          postTransformers: [addNavLinkKeyboardToggle()],
        },
      );
    });
    const label = shadowDom!.querySelector('label.md-nav__link')!;
    const checkbox = shadowDom!.querySelector('#cb1') as HTMLInputElement;
    expect(label.getAttribute('tabIndex')).toBe('0');

    // Simulate keydown: Enter
    await act(async () => {
      label.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
    });
    expect(checkbox.checked).toBe(true);

    // Simulate keydown: space
    await act(async () => {
      label.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
    });
    expect(checkbox.checked).toBe(false);
  });

  it('does nothing if no for attribute or checkbox', async () => {
    let shadowDom: ShadowRoot;
    await act(async () => {
      shadowDom = await createTestShadowDom(
        `<label class ="md-nav__link">No for</label>`,
        {
          preTransformers: [],
          postTransformers: [addNavLinkKeyboardToggle()],
        },
      );
    });
    const label = shadowDom!.querySelector('label.md-nav__link')!;
    await act(async () => {
      expect(() =>
        label.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        ),
      ).not.toThrow();
    });
  });
});
