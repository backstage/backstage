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

import { CRUDAction } from './attributes';
import { createPermissions } from './util';

/*
 * TODO(authorization-framework): TechDocs does not have an isomorphic package; techdocs-common is
 * a backend package, only used by techdocs-backend (strange but true). For the purposes of
 * experimentation, we took a shortcut of defining TechDocs permissions here. This does bring up a
 * troubling realization that any plugin desiring authorization will need a -common package, in
 * the current setup.
 */
export const TechDocsPermission = createPermissions({
  DOCS_READ: {
    name: 'techdocs.doc.read',
    attributes: {
      CRUD_ACTION: CRUDAction.READ,
    },
  },
});
