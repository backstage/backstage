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
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import * as routes from './routes';

export const rootRouteRef = convertLegacyRouteRef(routes.rootRouteRef);
export const legacySelectedTemplateRouteRef = convertLegacyRouteRef(
  routes.legacySelectedTemplateRouteRef,
);
export const selectedTemplateRouteRef = convertLegacyRouteRef(
  routes.selectedTemplateRouteRef,
);
export const scaffolderTaskRouteRef = convertLegacyRouteRef(
  routes.scaffolderTaskRouteRef,
);
export const scaffolderListTaskRouteRef = convertLegacyRouteRef(
  routes.scaffolderListTaskRouteRef,
);
export const actionsRouteRef = convertLegacyRouteRef(routes.actionsRouteRef);
export const editRouteRef = convertLegacyRouteRef(routes.editRouteRef);
export const editorRouteRef = convertLegacyRouteRef(routes.editorRouteRef);
export const customFieldsRouteRef = convertLegacyRouteRef(
  routes.customFieldsRouteRef,
);
export const templateFormRouteRef = convertLegacyRouteRef(
  routes.templateFormRouteRef,
);
export const templatingExtensionsRouteRef = convertLegacyRouteRef(
  routes.templatingExtensionsRouteRef,
);

export { registerComponentRouteRef, viewTechDocRouteRef } from './routes';
