/*
 * Copyright 2024 The Backstage Authors
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

import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { NotImplementedError } from '@backstage/errors';

export const guestAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async () => {
    return { profile: {} };
  },
  initialize({ config }) {
    const allowOutsideDev = config.getOptionalBoolean(
      'dangerouslyAllowOutsideDevelopment',
    );
    if (process.env.NODE_ENV !== 'development' && allowOutsideDev !== true) {
      throw new NotImplementedError(
        'The guest provider cannot be used outside of a development environment',
      );
    }
  },
  async authenticate() {
    return { result: {} };
  },
});
