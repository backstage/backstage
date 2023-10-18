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

import { renderHook } from '@testing-library/react-hooks';
import { useStylesTransformer } from './transformer';

describe('Transformers > Styles', () => {
  it('should return a function that injects all styles into a given dom element', () => {
    const { result } = renderHook(() => useStylesTransformer());

    const dom = document.createElement('html');
    dom.innerHTML = '<head></head>';
    result.current(dom); // calling styles transformer

    const style = dom.querySelector('head > style');
    expect(style).toHaveTextContent(
      '/*================== Variables ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Reset ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Layout ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Typeset ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Animations ==================*/',
    );
    expect(style).toHaveTextContent(
      '/*================== Extensions ==================*/',
    );
  });
});
