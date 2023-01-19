/*
 * Copyright 2022 The Backstage Authors
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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';

/**
 * An identity client options object which allows extra configurations
 *
 * @public
 */
export type IdentityFactoryOptions = {
  issuer?: string;

  /** JWS "alg" (Algorithm) Header Parameter values. Defaults to an array containing just ES256.
   * More info on supported algorithms: https://github.com/panva/jose */
  algorithms?: string[];
};

/** @public */
export const identityFactory = createServiceFactory(
  (options?: IdentityFactoryOptions) => ({
    service: coreServices.identity,
    deps: {
      discovery: coreServices.discovery,
    },
    async factory({ discovery }) {
      return DefaultIdentityClient.create({ discovery, ...options });
    },
  }),
);
