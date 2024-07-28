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

import { ApiRef, createApiRef } from '../system';

/**
 * A wrapper for retrieving any errors caught in authentication redirect flow
 *
 * @public
 */
export type AuthErrorApi = {
  /**
   * Get any caught errors during the auth redirect flow
   */
  getSignInAuthError(): Promise<Error | undefined>;
};

/**
 * The {@link ApiRef} of {@link AuthErrorApi}.
 *
 * @remarks
 *
 * This is a wrapper that uses fetch to retrieve any caught errors
 * in the authentication redirect flow process. This API calls a
 * Backstage endpoint to read any error stored in authentication error
 * cookie and returns it to the user.
 *
 * @public
 */
export const authErrorApiRef: ApiRef<AuthErrorApi> = createApiRef({
  id: 'core.authError',
});
