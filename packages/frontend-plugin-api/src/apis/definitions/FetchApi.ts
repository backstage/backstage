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

import { ApiRef, createApiRef } from '../system';

/**
 * A wrapper for the fetch API, that has additional behaviors such as the
 * ability to automatically inject auth information where necessary.
 *
 * @public
 */
export type FetchApi = {
  /**
   * The `fetch` implementation.
   */
  fetch: typeof fetch;
};

/**
 * The {@link ApiRef} of {@link FetchApi}.
 *
 * @remarks
 *
 * This is a wrapper for the fetch API, that has additional behaviors such as
 * the ability to automatically inject auth information where necessary.
 *
 * Note that the default behavior of this API (unless overridden by your org),
 * is to require that the user is already signed in so that it has auth
 * information to inject. Therefore, using the default implementation of this
 * utility API e.g. on the `SignInPage` or similar, would cause issues. In
 * special circumstances like those, you can use the regular system `fetch`
 * instead.
 *
 * @public
 */
export const fetchApiRef: ApiRef<FetchApi> = createApiRef({
  id: 'core.fetch',
});
