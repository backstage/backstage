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

import {
  useShadowRoot,
  useShadowRootElements,
  useShadowRootSelection,
  useTechDocsShadowRootElements,
  useTechDocsShadowRootSelection,
} from './hooks';
import { renderHook } from '@testing-library/react-hooks';
import { fireEvent, waitFor } from '@testing-library/react';

const fireSelectionChangeEvent = (window: Window) => {
  const selectionChangeEvent = window.document.createEvent('Event');
  selectionChangeEvent.initEvent('selectionchange', true, true);
  window.document.addEventListener('selectionchange', () => {}, false);
  fireEvent(window.document, selectionChangeEvent);
};

const getSelection = jest.fn();

const selection = {
  type: 'Range',
  rangeCount: 1,
  isCollapsed: true,
  getRangeAt: () => ({
    startContainer: 'this is a sentence',
    endContainer: 'this is a sentence',
    startOffset: 1,
    endOffset: 3,
    getBoundingClientRect: () => ({
      right: 100,
      top: 100,
      width: 100,
      height: 100,
    }),
  }),
  toString: () => 'his ',
  containsNode: () => true,
} as unknown as Selection;

getSelection.mockReturnValue(selection);

const mockShadowRoot = () => {
  const div = document.createElement('div');
  const shadowRoot = div.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = '<h1>Shadow DOM Mock</h1>';
  (shadowRoot as ShadowRoot & Pick<Document, 'getSelection'>).getSelection =
    getSelection;
  return shadowRoot;
};

const shadowRoot = mockShadowRoot();

jest.mock('@backstage/plugin-techdocs-mkdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-mkdocs-react'),
  useMkDocsReaderPage: () => ({ shadowRoot }),
}));

describe('hooks', () => {
  describe('useShadowRoot', () => {
    it('should return shadow root', async () => {
      const { result } = renderHook(() => useShadowRoot());

      expect(result.current?.innerHTML).toBe(shadowRoot.innerHTML);
    });
  });

  describe('useShadowRootElements', () => {
    it('should return shadow root elements based on selector', async () => {
      const { result } = renderHook(() => useShadowRootElements(['h1']));

      expect(result.current).toHaveLength(1);
    });
  });

  describe('useTechDocsShadowRootElements', () => {
    it('should return shadow root elements based on selector', () => {
      const { result } = renderHook(() =>
        useTechDocsShadowRootElements(['h1'], shadowRoot),
      );

      expect(result.current).toHaveLength(1);
    });
  });

  describe('useShadowRootSelection', () => {
    it('should return shadow root selection', async () => {
      const { result } = renderHook(() => useShadowRootSelection(0));

      expect(result.current).toBeNull();

      fireSelectionChangeEvent(window);

      await waitFor(() => {
        expect(result.current?.toString()).toEqual('his ');
      });
    });
  });

  describe('useTechDocsShadowRootSelection', () => {
    it('should return shadow root selection', async () => {
      const { result } = renderHook(() =>
        useTechDocsShadowRootSelection(0, shadowRoot),
      );

      expect(result.current).toBeNull();

      fireSelectionChangeEvent(window);

      await waitFor(() => {
        expect(result.current?.toString()).toEqual('his ');
      });
    });
  });
});
