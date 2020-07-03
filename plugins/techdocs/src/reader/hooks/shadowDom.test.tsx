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
  return <div data-testid="root" />;
};

const ComponentWithHook = () => {
  const [ref] = useShadowDom('mkdocs', 'about/license/');
  return <div data-testid="root" ref={ref} />;
};

describe('useShadowDom', () => {
  it('does not create a Shadow DOM instance', async () => {
    const rendered = await renderWithEffects(<ComponentWithoutHook />);

    const outerDivElement = rendered.getByTestId('root');
    expect(outerDivElement.shadowRoot).not.toBeInstanceOf(ShadowRoot);
    expect(outerDivElement.children.length).toBe(0);
  });

  it('create a Shadow DOM instance', async () => {
    const rendered = await renderWithEffects(<ComponentWithHook />);

    const outerDivElement = rendered.getByTestId('root');
    expect(outerDivElement.shadowRoot).not.toBeInstanceOf(ShadowRoot);
    expect(outerDivElement.children.length).toBe(1);

    const innerDivElement = outerDivElement.children[0];
    expect(innerDivElement.shadowRoot).toBeInstanceOf(ShadowRoot);
  });
});
