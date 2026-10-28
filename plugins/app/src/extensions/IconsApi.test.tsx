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

import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  AppRootElementBlueprint,
  createApiRef,
  iconsApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { type LegacyIconsApi } from '../apis/legacyApiRefs';
import { screen } from '@testing-library/react';

it('provides the original icons contract backed by a custom v2 API', async () => {
  const oldIconsApiRef = createApiRef<LegacyIconsApi>().with({
    id: 'core.icons',
    pluginId: 'app',
  });
  const element = <span>custom icon</span>;
  const iconsApi = {
    icon: jest.fn((key: string) => (key === 'custom' ? element : undefined)),
    listIconKeys: () => ['custom'],
  };
  function Consumer() {
    const legacy = useApi(oldIconsApiRef);
    const current = useApi(iconsApiRef);
    expect(iconsApiRef.id).toBe('core.icons.v2');
    expect(current).toBe(iconsApi);
    expect(legacy.icon('custom')).toBe(element);
    expect(legacy.listIconKeys()).toEqual(['custom']);
    expect(legacy.getIcon('missing')).toBeUndefined();
    const Icon = legacy.getIcon('custom')!;
    expect(legacy.getIcon('custom')).toBe(Icon);
    return <Icon />;
  }
  renderTestApp({
    apis: [[iconsApiRef, iconsApi]],
    extensions: [
      AppRootElementBlueprint.make({
        name: 'legacy-icons-test',
        params: { element: <Consumer /> },
      }),
    ],
  });
  expect(await screen.findByText('custom icon')).toBeInTheDocument();
});
