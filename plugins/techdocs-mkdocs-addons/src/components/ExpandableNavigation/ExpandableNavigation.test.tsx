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

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import { ExpandableNavigation } from '../../plugin';

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
  it('renders without exploding', async () => {
    const { getByRole } = await TechDocsAddonTester.buildAddonsInTechDocs([
      <ExpandableNavigation />,
    ])
      .withDom(mockNavWithSublevels)
      .renderWithEffects();

    await waitFor(() => {
      expect(getByRole('button', { name: 'expand-nav' })).toBeInTheDocument();
    });
  });

  it('expands and collapses navigation', async () => {
    const { getByRole, shadowRoot } =
      await TechDocsAddonTester.buildAddonsInTechDocs([
        <ExpandableNavigation />,
      ])
        .withDom(mockNavWithSublevels)
        .renderWithEffects();

    const toggles =
      shadowRoot!.querySelectorAll<HTMLInputElement>('.md-toggle');

    expect(toggles).toHaveLength(2);
    toggles.forEach(item => {
      expect(item).not.toBeChecked();
    });

    const expandButton = getByRole('button', { name: 'expand-nav' });

    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(getByRole('button', { name: 'collapse-nav' })).toBeInTheDocument();
      toggles.forEach(item => {
        expect(item).toBeChecked();
      });
    });

    const collapseButton = getByRole('button', { name: 'collapse-nav' });

    fireEvent.click(collapseButton);

    await waitFor(() => {
      toggles.forEach(item => {
        expect(item).not.toBeChecked();
      });
    });
  });

  it('does not render when navigation has no sublevels', async () => {
    const { queryByRole } = await TechDocsAddonTester.buildAddonsInTechDocs([
      <ExpandableNavigation />,
    ])
      .withDom(mockNavWithoutSublevels)
      .renderWithEffects();

    expect(
      queryByRole('button', { name: 'expand-nav' }),
    ).not.toBeInTheDocument();
  });
});
