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

import { HeaderTransformer } from './Header';

describe('Header', () => {
  it('Should remove the mkdocs header', () => {
    const dom = createDom(
      <body>
        <header className="md-header" />
      </body>,
    );

    expect(dom.querySelector('.md-header')).not.toBeNull();

    render(
      <TechDocsShadowDomProvider dom={dom}>
        <HeaderTransformer />
      </TechDocsShadowDomProvider>,
    );

    expect(dom.querySelector('.md-header')).toBeNull();
  });
});
