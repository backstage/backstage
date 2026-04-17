/*
 * Copyright 2026 The Backstage Authors
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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { AuthService } from '@backstage/backend-plugin-api';
import { createListScaffolderTasksAction } from './listScaffolderTasksAction';
import { ScaffolderService } from '@backstage/plugin-scaffolder-node';
import { createDryRunTemplateAction } from './createDryRunTemplateAction';
import { createListScaffolderActionsAction } from './createListScaffolderActionsAction';
import { createExecuteTemplateAction } from './createExecuteTemplateAction';
import { createGetScaffolderTaskLogsAction } from './createGetScaffolderTaskLogsAction';

export const createScaffolderActions = (options: {
  actionsRegistry: ActionsRegistryService;
  scaffolderService: ScaffolderService;
  auth: AuthService;
}) => {
  createListScaffolderTasksAction({
    actionsRegistry: options.actionsRegistry,
    auth: options.auth,
    scaffolderService: options.scaffolderService,
  });
  createDryRunTemplateAction(options);
  createListScaffolderActionsAction(options);
  createExecuteTemplateAction(options);
  createGetScaffolderTaskLogsAction(options);
};
