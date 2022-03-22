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
import { render, waitFor, fireEvent } from '@testing-library/react';

import { TechDocsShadowDomProvider } from '@backstage/plugin-techdocs';
import { wrapInTestApp } from '@backstage/test-utils';

import { SidebarTransformer } from './Sidebar';

const media = {
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
};
const matchMedia = jest.fn().mockReturnValue(media);
global.matchMedia = matchMedia;

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should position the sidebar at top of content', async () => {
    const dom = createDom(
      <body>
        <div data-md-component="container" className="md-container">
          <div data-md-component="navigation" className="md-sidebar" />
          <div data-md-component="toc" className="md-sidebar" />
          <div className="md-content" />
        </div>
      </body>,
    );

    jest
      .spyOn(dom, 'getBoundingClientRect')
      .mockReturnValue({ top: 100 } as DOMRect);

    render(
      wrapInTestApp(
        <TechDocsShadowDomProvider dom={dom}>
          <SidebarTransformer />
        </TechDocsShadowDomProvider>,
      ),
    );

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 100px;');
      }
    });
  });

  it('Should sum tabs height on the position', async () => {
    const dom = createDom(
      <body>
        <div data-md-component="container" className="md-container">
          <div data-md-component="navigation" className="md-sidebar" />
          <div data-md-component="toc" className="md-sidebar" />
          <div className="md-tabs" />
        </div>
      </body>,
    );

    jest
      .spyOn(dom, 'getBoundingClientRect')
      .mockReturnValue({ top: 100 } as DOMRect);

    const tabs = dom.querySelector('.md-container > .md-tabs');
    jest
      .spyOn(tabs!, 'getBoundingClientRect')
      .mockReturnValue({ height: 100 } as DOMRect);

    render(
      wrapInTestApp(
        <TechDocsShadowDomProvider dom={dom}>
          <SidebarTransformer />
        </TechDocsShadowDomProvider>,
      ),
    );

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 200px;');
      }
    });
  });

  it('Should reposition when a scroll event is fired', async () => {
    const dom = createDom(
      <body>
        <div data-md-component="container" className="md-container">
          <div data-md-component="navigation" className="md-sidebar" />
          <div data-md-component="toc" className="md-sidebar" />
          <div className="md-tabs" />
        </div>
      </body>,
    );

    render(
      wrapInTestApp(
        <TechDocsShadowDomProvider dom={dom}>
          <SidebarTransformer />
        </TechDocsShadowDomProvider>,
      ),
    );

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 0px;');
      }
    });

    jest
      .spyOn(dom, 'getBoundingClientRect')
      .mockReturnValue({ top: 100 } as DOMRect);

    fireEvent.scroll(window);

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 100px;');
      }
    });
  });

  it('Should reposition when a resize event is fired', async () => {
    const dom = createDom(
      <body>
        <div data-md-component="container" className="md-container">
          <div data-md-component="navigation" className="md-sidebar" />
          <div data-md-component="toc" className="md-sidebar" />
          <div className="md-tabs" />
        </div>
      </body>,
    );

    render(
      wrapInTestApp(
        <TechDocsShadowDomProvider dom={dom}>
          <SidebarTransformer />
        </TechDocsShadowDomProvider>,
      ),
    );

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 0px;');
      }
    });

    jest
      .spyOn(dom, 'getBoundingClientRect')
      .mockReturnValue({ top: 100 } as DOMRect);

    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      for (const sidebar of dom.querySelectorAll('md-sidebar')) {
        expect(sidebar?.getAttribute('style')).toBe('top: 100px;');
      }
    });
  });
});
