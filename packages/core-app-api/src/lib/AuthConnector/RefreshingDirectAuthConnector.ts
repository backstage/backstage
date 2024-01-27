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

import { DirectAuthConnector } from './DirectAuthConnector';

/**
 * Add support for refreshing direct tokens. Used for guest authentication.
 */
export class RefreshingDirectAuthConnector<
  DirectAuthResponse,
> extends DirectAuthConnector<DirectAuthResponse> {
  /**
   * Pulled from DefaultAuthConnector and adapted for use with DirectAuthConnector.
   */
  async refreshSession(): Promise<any> {
    const res = await fetch(
      `${await this.buildUrl('/refresh')}&optional=true`,
      {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        credentials: 'include',
      },
    ).catch(error => {
      throw new Error(`Auth refresh request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(
        `Auth refresh request failed, ${res.statusText}`,
      );
      error.status = res.status;
      throw error;
    }

    const authInfo = await res.json();

    if (authInfo.error) {
      const error = new Error(authInfo.error.message);
      if (authInfo.error.name) {
        error.name = authInfo.error.name;
      }
      throw error;
    }
    return authInfo;
  }
}
