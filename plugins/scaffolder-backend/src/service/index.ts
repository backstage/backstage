/*
 * Copyright 2023 The Backstage Authors
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
  createScaffolderEntityConditionalDecision,
  scaffolderTemplateEntityConditions,
  createScaffolderTemplateConditionalDecision,
  scaffolderTemplateConditions,
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-node/alpha';

export {
  /**
   * @deprecated use {@link createScaffolderEntityConditionalDecision} from @backstage/plugin-scaffolder-node/alpha instead
   */
  createScaffolderEntityConditionalDecision,

  /**
   * @deprecated use {@link scaffolderTemplateEntityConditions} from @backstage/plugin-scaffolder-node/alpha instead
   */
  scaffolderTemplateEntityConditions,

  /**
   * @deprecated use {@link createScaffolderTemplateConditionalDecision} from @backstage/plugin-scaffolder-node/alpha instead
   */
  createScaffolderTemplateConditionalDecision,

  /**
   * @deprecated use {@link scaffolderTemplateConditions} from @backstage/plugin-scaffolder-node/alpha instead
   */
  scaffolderTemplateConditions,

  /**
   * @deprecated use {@link createScaffolderActionConditionalDecision} from @backstage/plugin-scaffolder-node/alpha instead
   */
  createScaffolderActionConditionalDecision,

  /**
   * @deprecated use {@link scaffolderActionConditions} from @backstage/plugin-scaffolder-node/alpha instead
   */
  scaffolderActionConditions,
};
