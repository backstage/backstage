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

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { createRouteRef, NavContentItem } from '@backstage/frontend-plugin-api';
import { DefaultNavContent } from './DefaultNavContent';

const routeRef = createRouteRef();

const TestIcon = () => <span data-testid="icon" />;

const CustomItem = () => <div>Custom item</div>;
const Logo = () => <div>Logo</div>;
const Search = () => <div>Search</div>;

describe('DefaultNavContent', () => {
  it('orders items and renders optional content', async () => {
    await renderInTestApp(
      <DefaultNavContent
        Logo={Logo}
        Search={Search}
        items={
          [
            {
              title: 'Alpha',
              text: 'Alpha',
              to: '/alpha',
              icon: TestIcon,
              routeRef,
            },
            {
              title: 'Beta',
              text: 'Beta',
              to: '/beta',
              icon: TestIcon,
              position: 2,
              dividerBelow: true,
              routeRef,
            },
            {
              title: 'Charlie',
              text: 'Charlie',
              to: '/charlie',
              icon: TestIcon,
              position: 0,
              routeRef,
            },
            {
              title: 'Delta',
              text: 'Delta',
              to: '/delta',
              icon: TestIcon,
              hide: true,
              routeRef,
            },
            {
              position: 3,
              CustomComponent: CustomItem,
            },
          ] as NavContentItem[]
        }
      />,
    );

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.queryByText('Delta')).not.toBeInTheDocument();

    screen.getByText('Charlie');
    screen.getByText('Alpha');
    screen.getByText('Beta');
    screen.getByText('Custom item');

    const navText = screen.getByLabelText('sidebar nav').textContent ?? '';
    expect(navText.indexOf('Charlie')).toBeLessThan(navText.indexOf('Alpha'));
    expect(navText.indexOf('Alpha')).toBeLessThan(navText.indexOf('Beta'));
    expect(navText.indexOf('Beta')).toBeLessThan(
      navText.indexOf('Custom item'),
    );

    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });
});
