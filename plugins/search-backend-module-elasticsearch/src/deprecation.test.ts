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

import { mockServices } from '@backstage/backend-test-utils';

describe('warnLegacyOpenSearchProvider', () => {
  it('warns once with migration guidance for repeated legacy provider usage', () => {
    const logger = mockServices.logger.mock();

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { warnLegacyOpenSearchProvider } = require('./deprecation');
      warnLegacyOpenSearchProvider(logger, 'opensearch');
      warnLegacyOpenSearchProvider(logger, 'aws');
      warnLegacyOpenSearchProvider(logger, 'opensearch');
    });

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '@backstage/plugin-search-backend-module-opensearch',
      ),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('search.opensearch'),
    );
  });
});
