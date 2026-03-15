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
import { HomePageCardWidgetBlueprint } from './HomePageCardWidgetBlueprint';
import { homePageWidgetDataRef } from '../dataRefs';

describe('HomePageCardWidgetBlueprint', () => {
  it('renders the widget content wrapped in an InfoCard with the given title', async () => {
    const widget = HomePageCardWidgetBlueprint.make({
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
    expect(await screen.findByText('My Card Title')).toBeDefined();
  });
});
