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
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { createScaffolderFormDecorator } from '@backstage/plugin-scaffolder-react/alpha';

export const mockDecorator = createScaffolderFormDecorator({
  id: 'mock-decorator',
  schema: {
    input: {
      test: z => z.string(),
    },
  },
  deps: {
    githubApi: githubAuthApiRef,
  },
  decorator: async (
    { setSecrets, setFormState, input: { test } },
    { githubApi: _githubApi },
  ) => {
    setFormState(state => ({ ...state, test, mock: 'MOCK' }));
    setSecrets(state => ({ ...state, GITHUB_TOKEN: 'MOCK_TOKEN' }));
  },
});
