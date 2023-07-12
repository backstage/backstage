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

import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend/alpha';
import { catalogPlugin } from '@backstage/plugin-catalog-backend/alpha';
import { kubernetesPlugin } from '@backstage/plugin-kubernetes-backend/alpha';
import {
  permissionModuleAllowAllPolicy,
  permissionPlugin,
} from '@backstage/plugin-permission-backend/alpha';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder-backend/alpha';
import { catalogModuleTemplateKind } from '@backstage/plugin-scaffolder-backend/alpha';
import { searchModuleCatalogCollator } from '@backstage/plugin-search-backend-module-catalog/alpha';
import { searchModuleExploreCollator } from '@backstage/plugin-search-backend-module-explore/alpha';
import { searchModuleTechDocsCollator } from '@backstage/plugin-search-backend-module-techdocs/alpha';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { techdocsPlugin } from '@backstage/plugin-techdocs-backend/alpha';
import { todoPlugin } from '@backstage/plugin-todo-backend';
import { entityFeedbackPlugin } from '@backstage/plugin-entity-feedback-backend';
import { catalogModuleUnprocessedEntities } from '@backstage/plugin-catalog-backend-module-unprocessed';
import { badgesPlugin } from '@backstage/plugin-badges-backend';
import { azureDevOpsPlugin } from '@backstage/plugin-azure-devops-backend';
import { linguistPlugin } from '@backstage/plugin-linguist-backend';
import { devtoolsPlugin } from '@backstage/plugin-devtools-backend';
import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { adrPlugin } from '@backstage/plugin-adr-backend';

const backend = createBackend();

backend.add(appPlugin({ appPackageName: 'example-app' }));

// Badges
backend.add(badgesPlugin());

// Azure DevOps
backend.add(azureDevOpsPlugin());

// DevTools
backend.add(devtoolsPlugin());

// Entity Feedback
backend.add(entityFeedbackPlugin());

// Linguist
const linguistSchedule: TaskScheduleDefinition = {
  frequency: { minutes: 2 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 15 },
};

backend.add(
  linguistPlugin({
    schedule: linguistSchedule,
    age: { days: 30 },
    batchSize: 2,
    useSourceLocation: false,
  }),
);

// Todo
backend.add(todoPlugin());

backend.add(adrPlugin());

// Techdocs
backend.add(techdocsPlugin());

// Catalog
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());

backend.add(scaffolderPlugin());

// Search
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator());
backend.add(searchModuleTechDocsCollator());
backend.add(searchModuleExploreCollator());

// Kubernetes
backend.add(kubernetesPlugin());

// Permissions
backend.add(permissionPlugin());
backend.add(permissionModuleAllowAllPolicy());

backend.add(catalogModuleUnprocessedEntities());

backend.start();
