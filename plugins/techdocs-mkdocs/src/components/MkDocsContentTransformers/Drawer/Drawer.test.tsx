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

import { DrawerTransformer } from '.';

describe('Drawer', () => {
  it('Should not have an for attribute', () => {
    const dom = createDom(
      <body>
        <nav className="md-nav">
          <label className="md-nav__title" htmlFor="__drawer">
            <input
              className="md-toggle"
              data-md-toggle="drawer"
              type="checkbox"
              id="__drawer"
              autoComplete="off"
            />
          </label>
        </nav>
      </body>,
    );

    expect(dom.querySelector('.md-nav__title')?.getAttribute('for')).toBe(
      '__drawer',
    );

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <DrawerTransformer />
      </TechDocsShadowDomProvider>,
    );

    expect(dom.querySelector('.md-nav__title')?.getAttribute('for')).toBeNull();
  });
});
