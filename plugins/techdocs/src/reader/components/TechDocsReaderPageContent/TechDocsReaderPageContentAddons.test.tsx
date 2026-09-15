/*
 * Copyright 2026 The Backstage Authors
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

import { render } from '@testing-library/react';

const mockUseTechDocsAddons = jest.fn();
const mockUseTechDocsReaderPage = jest.fn();

jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useTechDocsAddons: () => mockUseTechDocsAddons(),
  useTechDocsReaderPage: () => mockUseTechDocsReaderPage(),
}));

import { TechDocsReaderPageContentAddons } from './TechDocsReaderPageContentAddons';

describe('<TechDocsReaderPageContentAddons />', () => {
  beforeEach(() => {
    mockUseTechDocsAddons.mockReturnValue({
      renderComponentsByLocation: () => null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('places sidebar addons inside their scroll wrappers', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <main data-md-component="content"></main>
      <div data-md-component="sidebar" data-md-type="navigation">
        <div class="md-sidebar__scrollwrap">
          <div class="md-sidebar__inner"></div>
        </div>
      </div>
      <div data-md-component="toc">
        <div data-techdocs-addons-location="secondary sidebar"></div>
        <div class="md-sidebar__scrollwrap">
          <div class="md-sidebar__inner"></div>
        </div>
      </div>
    `;
    mockUseTechDocsReaderPage.mockReturnValue({ shadowRoot });
    const existingSecondaryAddonLocation = shadowRoot.querySelector(
      '[data-techdocs-addons-location="secondary sidebar"]',
    );

    render(<TechDocsReaderPageContentAddons />);

    const primaryScrollWrap = shadowRoot.querySelector(
      '[data-md-type="navigation"] > .md-sidebar__scrollwrap',
    );
    const secondaryScrollWrap = shadowRoot.querySelector(
      '[data-md-component="toc"] > .md-sidebar__scrollwrap',
    );

    expect(primaryScrollWrap?.firstElementChild).toHaveAttribute(
      'data-techdocs-addons-location',
      'primary sidebar',
    );
    expect(secondaryScrollWrap?.firstElementChild).toHaveAttribute(
      'data-techdocs-addons-location',
      'secondary sidebar',
    );
    expect(secondaryScrollWrap?.firstElementChild).toBe(
      existingSecondaryAddonLocation,
    );
  });

  it('uses the outer sidebar when no scroll wrapper is available', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <main data-md-component="content"></main>
      <div data-md-component="navigation">
        <div class="md-sidebar__inner"></div>
      </div>
      <div data-md-component="sidebar" data-md-type="toc">
        <div class="md-sidebar__inner"></div>
      </div>
    `;
    mockUseTechDocsReaderPage.mockReturnValue({ shadowRoot });

    render(<TechDocsReaderPageContentAddons />);

    const primarySidebar = shadowRoot.querySelector(
      '[data-md-component="navigation"]',
    );
    const secondarySidebar = shadowRoot.querySelector('[data-md-type="toc"]');

    expect(primarySidebar?.firstElementChild).toHaveAttribute(
      'data-techdocs-addons-location',
      'primary sidebar',
    );
    expect(secondarySidebar?.firstElementChild).toHaveAttribute(
      'data-techdocs-addons-location',
      'secondary sidebar',
    );
  });
});
