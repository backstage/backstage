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

import { ApiBlueprint, coreApis } from '@backstage/frontend-plugin-api';
import { documentTitleApiRef } from '@backstage/frontend-plugin-api/alpha';
import { z } from 'zod/v4';
import { DefaultDocumentTitleApi } from '../apis/DefaultDocumentTitleApi';

export const DocumentTitleApi = ApiBlueprint.makeWithOverrides({
  name: 'document-title',
  configSchema: {
    template: z.string().default('{page} | {app}'),
    separator: z.string().default(' | '),
    order: z
      .enum(['innermost-first', 'outermost-first'])
      .default('innermost-first'),
  },
  factory(originalFactory, { config }) {
    return originalFactory(defineParams =>
      defineParams({
        api: documentTitleApiRef,
        deps: { configApi: coreApis.config },
        factory: ({ configApi }) =>
          new DefaultDocumentTitleApi({
            configApi,
            template: config.template,
            separator: config.separator,
            order: config.order,
          }),
      }),
    );
  },
});
