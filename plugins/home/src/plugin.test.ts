/*
 * Copyright 2021 The Backstage Authors
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

import packageJson from '../package.json';
import { homePlugin } from './plugin';

describe('home', () => {
  it('should export plugin', () => {
    expect(homePlugin).toBeDefined();
  });

  // Temporarily ensure we are installing a working version of the react-grid-layout library
  // For more details, see: https://github.com/react-grid-layout/react-grid-layout/issues/1959
  // TODO(@backstage/home-maintainers): Delete this once the sub-dependency issue has been resolved.
  it('should pin react-grid-layout version to 1.3.4', async () => {
    expect(packageJson.dependencies['react-grid-layout']).toBe('1.3.4');
  });
});
