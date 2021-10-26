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

jest.useFakeTimers();

describe('scrollIntoAnchor', () => {
  const transformer = scrollIntoAnchor();
  const dom = { querySelector: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if there is no anchor element', async () => {
    transformer(dom as unknown as Element);
    jest.advanceTimersByTime(200);
    expect(dom.querySelector).not.toHaveBeenCalled();
  });

  it('scroll to the hash anchor element', async () => {
    const scrollIntoView = jest.fn();
    dom.querySelector.mockReturnValue({ scrollIntoView });
    const hash = '#hash';
    window.location.hash = hash;
    transformer(dom as unknown as Element);
    jest.advanceTimersByTime(200);
    expect(dom.querySelector).toHaveBeenCalledWith(`#${hash.slice(1)}`);
    expect(scrollIntoView).toHaveBeenCalledWith();
    window.location.hash = '';
  });
});
