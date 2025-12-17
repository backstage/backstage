/*
 * Copyright 2025 The Backstage Authors
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
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { createQueryAction } from './createQueryAction.ts';
import { SearchIndexService } from '@backstage/plugin-search-backend-node/alpha';
import { LifecycleService } from '@backstage/backend-plugin-api';

export const registerActions = (options: {
  engine: SearchEngine;
  actionsRegistry: ActionsRegistryService;
  lifecycle: LifecycleService;
  searchIndexService: SearchIndexService;
}) => {
  const { lifecycle } = options;
  // Register after startup to ensure all document types are registered
  lifecycle.addStartupHook(() => {
    createQueryAction(options);
  });
};
