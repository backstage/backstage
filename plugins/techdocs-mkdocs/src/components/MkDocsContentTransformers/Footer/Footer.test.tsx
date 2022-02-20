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

// the import order matters, should be the first
import { createDom } from '../../../test-utils';

import React from 'react';
import { render } from '@testing-library/react';

import { TechDocsShadowDomProvider } from '@backstage/plugin-techdocs';

import { FooterTransformer } from './Footer';

describe('Footer', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Should remove the new mkdocs footer copyright', () => {
    const dom = createDom(
      <body>
        <footer className="md-footer">
          <div className="md-copyright" />
        </footer>
      </body>,
    );

    expect(dom.querySelector('.md-copyright')).not.toBeNull();

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <FooterTransformer />
      </TechDocsShadowDomProvider>,
    );

    expect(dom.querySelector('.md-copyright')).toBeNull();
  });

  it('Should remove the old mkdocs footer copyright', () => {
    const dom = createDom(
      <body>
        <footer className="md-footer">
          <div className="md-footer-copyright" />
        </footer>
      </body>,
    );

    expect(dom.querySelector('.md-footer-copyright')).not.toBeNull();

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <FooterTransformer />
      </TechDocsShadowDomProvider>,
    );

    expect(dom.querySelector('.md-footer-copyright')).toBeNull();
  });

  it('Should have same width of the dom', () => {
    const dom = createDom(
      <body>
        <footer className="md-footer">
          <div className="md-copyright" />
        </footer>
      </body>,
    );

    const getBoundingClientRect = jest.spyOn(dom, 'getBoundingClientRect');
    getBoundingClientRect.mockReturnValue({ width: 100 } as DOMRect);

    expect(dom.querySelector('.md-footer')?.getAttribute('style')).toBeNull();

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <FooterTransformer />
      </TechDocsShadowDomProvider>,
    );

    expect(dom.querySelector('.md-footer')?.getAttribute('style')).toBe(
      'width: 100px;',
    );
  });
});
