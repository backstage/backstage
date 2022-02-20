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

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechDocsShadowDom, TechDocsShadowDomHooks } from './TechDocsShadowDom';
import { useTechDocsShadowDom } from './context';

describe('TechDocsShadowDom', () => {
  it("Should attach source as host's shadowRoot", () => {
    const source = '<html><head></head><body></body></html>';
    render(<TechDocsShadowDom source={source} />);
    const element = screen.getByTestId('techdocs-content-shadowroot');
    expect(element).toBeInTheDocument();
    expect(element!.shadowRoot!.innerHTML).toBe(source);
  });

  it('Should sanitize source content', () => {
    const source = '<img src=x onerror=alert(1)//>';
    render(<TechDocsShadowDom source={source} />);
    const element = screen.getByTestId('techdocs-content-shadowroot');
    expect(element!.shadowRoot!.innerHTML).toBe(
      '<html><head></head><body><img src="x"></body></html>',
    );
  });

  it('Should accept sanitize hooks as props', () => {
    const afterSanitizeAttributes = (node: Element) => {
      if (node.nodeName === 'IMG') {
        const src = node.getAttribute('src');
        node.setAttribute('src', `https://backstage.io/images/${src}`);
      }
      return node;
    };
    const hooks: TechDocsShadowDomHooks = { afterSanitizeAttributes };
    const source = '<img src="image.png"/>';
    render(<TechDocsShadowDom source={source} hooks={hooks} />);
    const element = screen.getByTestId('techdocs-content-shadowroot');
    expect(element!.shadowRoot!.innerHTML).toBe(
      '<html><head></head><body><img src="https://backstage.io/images/image.png"></body></html>',
    );
  });

  it('Should call onAttach when shadowRoot is attached to host', () => {
    const handleAttached = jest.fn();
    const source = '<img src="image.png"/>';
    render(<TechDocsShadowDom source={source} onAttached={handleAttached} />);
    const element = screen.getByTestId('techdocs-content-shadowroot');
    expect(handleAttached).toBeCalledWith(element.shadowRoot);
  });

  it('Should give access to the dom to transformers', () => {
    const Transformer = () => {
      const dom = useTechDocsShadowDom();
      const body = dom.querySelector('body');
      const title = document.createElement('h1');
      title.textContent = 'Backstage';
      body!.appendChild(title);
      return null;
    };
    const source = '<html><head></head><body></body></html>';
    render(
      <TechDocsShadowDom source={source}>
        <Transformer />
      </TechDocsShadowDom>,
    );
    const element = screen.getByTestId('techdocs-content-shadowroot');
    expect(element!.shadowRoot!.innerHTML).toBe(
      '<html><head></head><body><h1>Backstage</h1></body></html>',
    );
  });
});
