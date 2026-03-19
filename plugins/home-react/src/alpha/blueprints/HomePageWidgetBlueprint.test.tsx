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
  it('renders the component directly without InfoCard wrapping', async () => {
    const widget = HomePageWidgetBlueprint.make({
      name: 'search-bar',
      params: {
        loader: async () =>
          function SearchBar() {
            return <div data-testid="bare-widget">Search Bar</div>;
          },
        title: 'Search',
        description: 'A full-width search bar',
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

  it('forwards settings as props to the loaded component', async () => {
    const widget = HomePageWidgetBlueprint.make({
      name: 'greeting',
      params: {
        loader: async () =>
          function Greeting({ message }: { message?: string }) {
            return <div data-testid="greeting">{message ?? 'no message'}</div>;
          },
        settings: {
          schema: {
            title: 'Greeting settings',
            type: 'object',
            properties: {
              message: { title: 'Message', type: 'string', default: 'hello' },
            },
          },
        },
      },
    });

    const data = createExtensionTester(widget).get(homePageWidgetDataRef);

    // Simulate what the grid does: spread saved settings onto the component type
    const WidgetType = data.component.type as React.ComponentType<
      Record<string, unknown>
    >;
    renderInTestApp(<WidgetType message="hello from settings" />);

    expect((await screen.findByTestId('greeting')).textContent).toBe(
      'hello from settings',
    );
  });
});
