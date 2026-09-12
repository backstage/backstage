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

import { renderHook } from '@testing-library/react';
import { useReaderLayoutEffects } from './useReaderLayoutEffects';

describe('useReaderLayoutEffects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not install scroll-driven positioning for the BUI layout', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener');

    renderHook(() =>
      useReaderLayoutEffects({
        dom: document.createElement('html'),
        isMobileMedia: false,
        isStyleLoading: false,
        layout: 'bui',
        state: 'cached',
      }),
    );

    expect(addEventListener).not.toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      true,
    );
  });
});
