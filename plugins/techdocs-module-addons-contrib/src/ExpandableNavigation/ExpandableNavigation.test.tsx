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

import { TechDocsAddonTester } from '@backstage/plugin-techdocs-addons-test-utils';

import { fireEvent, waitFor } from '@testing-library/react';
import { screen } from 'shadow-dom-testing-library';

import { ExpandableNavigation } from '../plugin';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';

const mockNavWithSublevels = (
  <div data-md-component="navigation">
    <nav>
      <ul>
        <li className="md-nav__item md-nav__item--nested">
          <input
            id="nav-2"
            type="checkbox"
            data-md-toggle="nav-2"
            className="md-nav__toggle md-toggle"
          />
          <ul data-md-scrollfix="" className="md-nav__list">
            <li className="md-nav__item">
              <a className="md-nav__link" title="First Level Nested" href="/">
                First Level Nested
              </a>
            </li>
            <li className="md-nav__item md-nav__item--nested">
              <input
                id="nav-2-2"
                type="checkbox"
                data-md-toggle="nav-2-2"
                className="md-nav__toggle md-toggle"
              />
              <ul data-md-scrollfix="" className="md-nav__list">
                <li className="md-nav__item">
                  <a
                    className="md-nav__link"
                    title="Second Level Nested"
                    href="/"
                  >
                    Second Level Nested
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
);

const mockNavWithoutSublevels = (
  <div data-md-component="navigation">
    <nav>
      <ul>
        <li className="md-nav__item">
          <a className="md-nav__link" title="Nav Item" href="/">
            Nav Item
          </a>
        </li>
        <li className="md-nav__item">
          <a className="md-nav__link" title="Second Nav Item" href="/">
            Second Nav Item
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

describe('ExpandableNavigation', () => {
  const entityPresentationApiMock = {
    forEntity: jest.fn(),
  };
  entityPresentationApiMock.forEntity.mockReturnValue({
    snapshot: {
      primaryTitle: 'Test Entity',
    },
  });

  it('renders without exploding', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<ExpandableNavigation />])
      .withDom(mockNavWithSublevels)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(
      screen.getByShadowRole('button', { name: 'expand-nav' }),
    ).toBeInTheDocument();
  });

  it('expands and collapses navigation', async () => {
    const { shadowRoot } = await TechDocsAddonTester.buildAddonsInTechDocs([
      <ExpandableNavigation />,
    ])
      .withDom(mockNavWithSublevels)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    const toggles =
      shadowRoot!.querySelectorAll<HTMLInputElement>('.md-toggle');

    expect(toggles).toHaveLength(2);
    toggles.forEach(item => {
      expect(item).not.toBeChecked();
    });

    const expandButton = screen.getByShadowRole('button', {
      name: 'expand-nav',
    });

    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(
        screen.getByShadowRole('button', { name: 'collapse-nav' }),
      ).toBeInTheDocument();
      toggles.forEach(item => {
        expect(item).toBeChecked();
      });
    });

    const collapseButton = screen.getByShadowRole('button', {
      name: 'collapse-nav',
    });

    fireEvent.click(collapseButton);

    await waitFor(() => {
      toggles.forEach(item => {
        expect(item).not.toBeChecked();
      });
    });
  });

  it('does not render when navigation has no sublevels', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<ExpandableNavigation />])
      .withDom(mockNavWithoutSublevels)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(
      screen.queryByShadowRole('button', { name: 'expand-nav' }),
    ).not.toBeInTheDocument();
  });
});
