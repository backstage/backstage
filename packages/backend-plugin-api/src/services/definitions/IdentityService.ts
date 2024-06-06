/*
 * Copyright 2020 The Backstage Authors
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

import { IdentityApi } from '@backstage/plugin-auth-node';

/**
 * This is the legacy service for identity handling in Backstage. Please migrate to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/identity | service documentation} for more details.
 *
 * @public
 * @deprecated Please {@link https://backstage.io/docs/tutorials/auth-service-migration | migrate} to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
 */
export interface IdentityService extends IdentityApi {}
