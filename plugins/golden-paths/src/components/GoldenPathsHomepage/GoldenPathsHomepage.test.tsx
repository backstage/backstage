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
import { renderInTestApp } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';

import { GoldenPathsHomepage } from './GoldenPathsHomepage';
import { apisWithoutEntities } from '../../test-utils';

describe('Golden Paths Homepage', () => {
  it('should render with 2 routed tabs', async () => {
    const { container } = await renderInTestApp(
      <ApiProvider apis={apisWithoutEntities}>
        <GoldenPathsHomepage />
      </ApiProvider>,
    );

    const tabs = container.querySelectorAll('[class*=MuiTabs-root] a');
    expect(tabs).toHaveLength(2);
  });
});
