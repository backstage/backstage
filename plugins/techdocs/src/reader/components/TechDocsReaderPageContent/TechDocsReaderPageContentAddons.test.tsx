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
  it('places sidebar addons inside their scroll wrappers', () => {
    mockUseTechDocsAddons.mockReturnValue({
      renderComponentsByLocation: () => null,
    });
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <main data-md-component="content"></main>
      <div data-md-component="sidebar" data-md-type="navigation">
        <div class="md-sidebar__scrollwrap"></div>
      </div>
      <div data-md-component="sidebar" data-md-type="toc">
        <div class="md-sidebar__scrollwrap"></div>
      </div>
    `;
    mockUseTechDocsReaderPage.mockReturnValue({ shadowRoot });

    render(<TechDocsReaderPageContentAddons />);

    expect(
      shadowRoot.querySelector(
        '[data-md-type="navigation"] > .md-sidebar__scrollwrap > [data-techdocs-addons-location="primary sidebar"]',
      ),
    ).not.toBeNull();
    expect(
      shadowRoot.querySelector(
        '[data-md-type="toc"] > .md-sidebar__scrollwrap > [data-techdocs-addons-location="secondary sidebar"]',
      ),
    ).not.toBeNull();
  });
});
