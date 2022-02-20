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

import { ScrollTransformer } from './Scroll';

jest.useFakeTimers();

describe('Scroll', () => {
  const { location } = window;

  beforeAll(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { hash: '' };
  });

  afterAll(() => {
    window.location = location;
  });

  it('Should scroll to top if location does not have hash', () => {
    const dom = createDom(
      <body>
        <h2 id="id" style={{ marginTop: 100 }}>
          Subtitle
        </h2>
      </body>,
    );
    render(
      <TechDocsShadowDomProvider dom={dom}>
        <ScrollTransformer />
      </TechDocsShadowDomProvider>,
    );
    const subtitle = dom.querySelector<HTMLElement>('#id');
    subtitle!.scrollIntoView = jest.fn();
    jest.advanceTimersByTime(200);
    expect(subtitle!.scrollIntoView).not.toHaveBeenCalled();
  });

  it('Should scroll into view if location have hash', () => {
    window.location.hash = '#id';
    const dom = createDom(
      <body>
        <h2 id="id" style={{ marginTop: 100 }}>
          Subtitle
        </h2>
      </body>,
    );
    render(
      <TechDocsShadowDomProvider dom={dom}>
        <ScrollTransformer />
      </TechDocsShadowDomProvider>,
    );
    const subtitle = dom.querySelector<HTMLElement>('#id');
    subtitle!.scrollIntoView = jest.fn();
    jest.advanceTimersByTime(200);
    expect(subtitle!.scrollIntoView).toHaveBeenCalled();
  });
});
