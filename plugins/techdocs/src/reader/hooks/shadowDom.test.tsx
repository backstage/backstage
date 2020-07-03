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

import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { useShadowDom } from './shadowDom';

const ComponentWithoutHook = () => {
  return <div data-testid="shadow-dom" />;
};

const ComponentWithHook = () => {
  const [ref] = useShadowDom();
  return <div data-testid="shadow-dom" ref={ref} />;
};

describe('useShadowDom', () => {
  it('does not create a Shadow DOM instance', async () => {
    const rendered = await renderWithEffects(<ComponentWithoutHook />);

    const divElement = rendered.getByTestId('shadow-dom');
    expect(divElement.shadowRoot).not.toBeInstanceOf(ShadowRoot);
  });

  it('create a Shadow DOM instance', async () => {
    const rendered = await renderWithEffects(<ComponentWithHook />);

    const divElement = rendered.getByTestId('shadow-dom');
    expect(divElement.shadowRoot).toBeInstanceOf(ShadowRoot);
  });
});
