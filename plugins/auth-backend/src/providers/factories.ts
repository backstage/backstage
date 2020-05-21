/*
 * Copyright 2020 Spotify AB
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

import { AuthProviderFactories } from './types';
import { GoogleAuthProvider } from './google/provider';

export class ProviderFactories {
  private static readonly providerFactories: AuthProviderFactories = {
    google: GoogleAuthProvider,
  };

  public static getProviderFactory(providerId: string) {
    const ProviderImpl = ProviderFactories.providerFactories.providerId;
    if (!ProviderImpl) {
      throw Error(
        `Provider Implementation missing for : ${providerId} auth provider`,
      );
    }
    return ProviderImpl;
  }
}
