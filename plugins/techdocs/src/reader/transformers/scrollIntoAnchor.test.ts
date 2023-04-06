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

import { scrollIntoAnchor } from '../transformers';
import { createTestShadowDom } from '../../test-utils';
import { Transformer } from './transformer';
import mkdocsIndex from '../../test-utils/fixtures/mkdocs-index';
import { SHADOW_DOM_STYLE_LOAD_EVENT } from '@backstage/plugin-techdocs-react';

describe('scrollIntoAnchor', () => {
  const scrollIntoView = jest.fn();
  let querySelectorSpy: jest.SpyInstance;
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;
  const applySpies: Transformer = dom => {
    querySelectorSpy = jest.spyOn(dom, 'querySelector');
    querySelectorSpy.mockReturnValue({ scrollIntoView });
    addEventListenerSpy = jest.spyOn(dom, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(dom, 'removeEventListener');
    return dom;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if there is no anchor element', async () => {
    await createTestShadowDom(mkdocsIndex, {
      preTransformers: [],
      postTransformers: [applySpies, scrollIntoAnchor()],
    });
    expect(querySelectorSpy).not.toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    // check that the same function is passed to both addEventListener and removeEventListener
    expect(addEventListenerSpy.mock.calls[0][1]).toBe(
      removeEventListenerSpy.mock.calls[0][1],
    );
  });

  it('scroll to the hash anchor element', async () => {
    window.location.hash = '#hash';
    await createTestShadowDom(mkdocsIndex, {
      preTransformers: [],
      postTransformers: [applySpies, scrollIntoAnchor()],
    });
    expect(querySelectorSpy).toHaveBeenCalledWith(
      expect.stringMatching('[id="hash"]'),
    );
    expect(scrollIntoView).toHaveBeenCalledWith();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    // check that the same function is passed to both addEventListener and removeEventListener
    expect(addEventListenerSpy.mock.calls[0][1]).toBe(
      removeEventListenerSpy.mock.calls[0][1],
    );
    window.location.hash = '';
  });

  it('works for anchor starting with number', async () => {
    querySelectorSpy.mockReturnValue({ scrollIntoView });
    window.location.hash = '#1-hash';
    await createTestShadowDom(mkdocsIndex, {
      preTransformers: [],
      postTransformers: [applySpies, scrollIntoAnchor()],
    });
    expect(querySelectorSpy).toHaveBeenCalledWith(
      expect.stringMatching('[id="1-hash"]'),
    );
    expect(scrollIntoView).toHaveBeenCalledWith();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      SHADOW_DOM_STYLE_LOAD_EVENT,
      expect.any(Function),
    );
    // check that the same function is passed to both addEventListener and removeEventListener
    expect(addEventListenerSpy.mock.calls[0][1]).toBe(
      removeEventListenerSpy.mock.calls[0][1],
    );
    window.location.hash = '';
  });
});
