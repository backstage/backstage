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

import { fireEvent, screen } from '@testing-library/react';
import { coreApis } from '@backstage/frontend-plugin-api';
import { mockApis, renderInTestApp } from '@backstage/frontend-test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createAppHistory } from '../../../../../packages/frontend-app-api/src/routing/AppHistory';
import { catalogApiRef } from '../../api';
import { MockStarredEntitiesApi, starredEntitiesApiRef } from '../../apis';
import { EntityListProvider, useEntityList } from '../../hooks';
import { EntityKindPicker } from '../EntityKindPicker';
import { UserListPicker } from './UserListPicker';

function SelectedFilter() {
  const { filters } = useEntityList();
  return <output>Selected: {filters.user?.value}</output>;
}

it.each([false, true])(
  'settles empty owned filters without navigation feedback (Navigation API: %s)',
  async hasNavigationApi => {
    const originalUrl = window.location.href;
    const originalNavigation = Object.getOwnPropertyDescriptor(
      window,
      'navigation',
    );
    const url = (user: string) =>
      `/catalog?filters%5Bkind%5D=component&filters%5Buser%5D=${user}&limit=20`;
    window.history.replaceState(null, '', url('owned'));
    const navigation = Object.assign(new EventTarget(), {
      currentEntry: { key: 'catalog', index: 0 },
      canGoBack: false,
    });
    if (hasNavigationApi) {
      Object.defineProperty(window, 'navigation', {
        configurable: true,
        value: navigation,
      });
    }
    const history = createAppHistory();
    const replaceState = window.history.replaceState.bind(window.history);
    const urls: string[] = [];
    const replaceSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation((state, title, target) => {
        urls.push(String(target));
        // Bound a regression so an infinite effect loop fails without hanging Jest.
        if (urls.length > 30) {
          throw new Error(`Catalog URL did not settle: ${urls.join(', ')}`);
        }
        replaceState(state, title, target);
        // Browsers with the Navigation API report direct replaceState calls too.
        navigation.dispatchEvent(
          Object.assign(new Event('currententrychange'), {
            navigationType: 'replace',
          }),
        );
      });
    const starredEntitiesApi = new MockStarredEntitiesApi();
    starredEntitiesApi.toggleStarred('component:default/example');
    const result = renderInTestApp(
      <EntityListProvider pagination>
        <EntityKindPicker initialFilter="component" />
        <UserListPicker initialFilter="owned" />
        <SelectedFilter />
      </EntityListProvider>,
      {
        apis: [
          [coreApis.appHistory, history],
          [
            catalogApiRef,
            catalogApiMock({
              entities: [
                {
                  apiVersion: 'backstage.io/v1alpha1',
                  kind: 'Component',
                  metadata: { name: 'example', namespace: 'default' },
                },
              ],
            }),
          ],
          [starredEntitiesApiRef, starredEntitiesApi],
          mockApis.identity({
            userEntityRef: 'user:default/guest',
            ownershipEntityRefs: ['user:default/guest'],
          }),
        ],
      },
    );
    try {
      expect(await screen.findByText('Selected: all')).toBeInTheDocument();
      expect(window.location.search).toBe(
        new URL(url('all'), window.location.origin).search,
      );
      const allIndex = urls.indexOf(url('all'));
      expect(allIndex).toBeGreaterThanOrEqual(0);
      expect(urls.slice(allIndex)).not.toContain(url('owned'));

      fireEvent.click(screen.getByText('Starred'));
      expect(await screen.findByText('Selected: starred')).toBeInTheDocument();
      expect(window.location.search).toBe(
        new URL(url('starred'), window.location.origin).search,
      );
    } finally {
      result.unmount();
      history.dispose();
      replaceSpy.mockRestore();
      if (originalNavigation) {
        Object.defineProperty(window, 'navigation', originalNavigation);
      } else {
        delete (window as unknown as { navigation?: unknown }).navigation;
      }
      window.history.replaceState(null, '', originalUrl);
    }
  },
);
