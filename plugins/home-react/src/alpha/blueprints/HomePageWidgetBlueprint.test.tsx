/*
 * Copyright 2025 The Backstage Authors
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

import { screen } from '@testing-library/react';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { HomePageWidgetBlueprint } from './HomePageWidgetBlueprint';
import { homePageWidgetDataRef } from '../dataRefs';

describe('HomePageWidgetBlueprint', () => {
  /**
   * CURRENT BEHAVIOUR (passes today)
   *
   * Documents that the existing `components` (ComponentParts) API correctly
   * wraps a widget inside an InfoCard with the given title. This test acts as
   * a backward-compatibility guard: it must keep passing after the new `loader`
   * param is added.
   */
  describe('components param — card-based widget (existing API)', () => {
    it('renders the widget content wrapped in an InfoCard', async () => {
      const widget = HomePageWidgetBlueprint.make({
        name: 'card-widget',
        params: {
          title: 'My Card Title',
          components: async () => ({
            Content: () => <div data-testid="card-content">Card Content</div>,
          }),
        },
      });

      const data = createExtensionTester(widget).get(homePageWidgetDataRef);
      renderInTestApp(data.component);

      // Widget content renders inside the card
      expect(await screen.findByTestId('card-content')).toBeDefined();

      // The InfoCard title heading is present — proves the card wrapper exists.
      // A non-card widget should NOT exhibit this behaviour.
      expect(await screen.findByText('My Card Title')).toBeDefined();
    });
  });

  /**
   * DESIRED BEHAVIOUR
   *
   * A widget registered with a `loader` param renders its component
   * directly, WITHOUT any InfoCard / CardExtension wrapping. This is the
   * correct model for non-card widgets such as a full-width search bar,
   * a banner, or a hero section.
   */
  describe('loader param — generic (non-card) widget', () => {
    it('renders the component directly without InfoCard wrapping when using loader', async () => {
      const widget = HomePageWidgetBlueprint.make({
        name: 'search-bar',
        params: {
          loader: async () =>
            function SearchBar() {
              return <div data-testid="bare-widget">Search Bar</div>;
            },
          title: 'Search',
          description: 'A full-width search bar — should NOT be card-wrapped',
        },
      });

      const data = createExtensionTester(widget).get(homePageWidgetDataRef);
      renderInTestApp(data.component);

      // The bare component must appear in the DOM
      expect(await screen.findByTestId('bare-widget')).toBeDefined();

      // No card title heading should be rendered.
      // queryByRole returns null without throwing when the element is absent.
      expect(screen.queryByRole('heading', { name: 'Search' })).toBeNull();
    });
  });
});
