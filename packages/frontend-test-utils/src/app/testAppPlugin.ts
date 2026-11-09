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

import { ApiBlueprint } from '@backstage/frontend-plugin-api';
import appPlugin from '@backstage/plugin-app';
import { mockApis } from '../apis/mockApis';
import { getMockApiFactory } from '../apis/MockWithApiFactory';

const fakeApis = {
  alert: mockApis.alert,
  error: () => mockApis.error({ collect: true }),
  'oauth-request': mockApis.oauthRequest,
  storage: mockApis.storage,
  toast: mockApis.toast,
};

export function createTestAppPlugin(
  disabledExtensions: Array<'app/layout' | 'app/routes' | 'app/nav'> = [],
) {
  return appPlugin.withOverrides({
    extensions: [
      ...(['sign-in-page:app', ...disabledExtensions] as const).map(id =>
        appPlugin.getExtension(id).override({ disabled: true }),
      ),
      ...Object.entries(fakeApis).map(([name, createFake]) =>
        ApiBlueprint.make({
          name,
          params: defineParams =>
            defineParams(getMockApiFactory(createFake())!),
        }),
      ),
    ],
  });
}
