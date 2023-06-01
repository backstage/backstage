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

import { createRouter } from '@backstage/plugin-permission-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { DelegateWithAllowAllFallbackPermissionPolicy } from '@backstage/plugin-permission-backend';
import { MainPermissionPolicy } from '@backstage/plugin-permission-node';
import { DefaultPlaylistPermissionPolicy } from '@backstage/plugin-playlist-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // You can change mainPolicy to some other customized MainPermissionPolicy implementation.
  // The AllowAllAfterSubPolicies main policy is a simplistic, basic policy that delegates
  // to sub-policies provided by other plugins and finally
  // returns an AllowAll answer if no contributed sub-policy was elligible.
  const mainPolicy: MainPermissionPolicy =
    new DelegateWithAllowAllFallbackPermissionPolicy();
  if (mainPolicy.addSubPolicies) {
    // Add sub-policies contributed by other plugins here
    mainPolicy.addSubPolicies(new DefaultPlaylistPermissionPolicy());
  }

  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: mainPolicy,
    identity: env.identity,
  });
}
