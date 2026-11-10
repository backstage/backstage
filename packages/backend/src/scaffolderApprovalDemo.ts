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

import {
  coreServices,
  createBackendFeatureLoader,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  createTemplateAction,
  scaffolderActionsExtensionPoint,
} from '@backstage/plugin-scaffolder-node';

export const approvalDemoModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'approval-demo',
  register(env) {
    env.registerInit({
      deps: { actions: scaffolderActionsExtensionPoint },
      async init({ actions }) {
        actions.addActions(
          createTemplateAction({
            id: 'demo:approval:confirm',
            description:
              'Checks the decision before the approval demo continues.',
            schema: {
              input: { decision: z => z.literal('approved') },
            },
            async handler(ctx) {
              ctx.logger.info('The approval decision was accepted.');
            },
          }),
        );
      },
    });
  },
});

export default createBackendFeatureLoader({
  deps: { config: coreServices.rootConfig },
  *loader({ config }) {
    if (config.getOptionalBoolean('approvalDemo.enabled')) {
      yield approvalDemoModule;
      yield import(
        '@backstage/plugin-scaffolder-backend-module-workspace-database'
      );
    }
  },
});
