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

import { useShadowRoot, useShadowRootElements } from './hooks';
import { renderHook } from '@testing-library/react-hooks';

const mockShadowRoot = () => {
  const div = document.createElement('div');
  const shadowRoot = div.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = '<h1>Shadow DOM Mock</h1>';
  return shadowRoot;
};

const shadowRoot = mockShadowRoot();

jest.mock('./context', () => {
  return {
    useTechDocsReaderPage: () => ({ shadowRoot }),
  };
});

describe('hooks', () => {
  describe('useShadowRoot', () => {
    it('should return shadow root', async () => {
      const { result } = renderHook(() => useShadowRoot());

      expect(result.current?.innerHTML).toBe(shadowRoot.innerHTML);
    });
  });

  describe('useShadowRootElements', () => {
    it('should return shadow root elements based on selector', () => {
      const { result } = renderHook(() => useShadowRootElements(['h1']));

      expect(result.current).toHaveLength(1);
    });
  });
});
