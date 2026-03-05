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

import { createPropertyRule } from './createPropertyRule';

/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with the specified spec subfield. Also matches on values
 * if value is provided.
 *
 * The key argument to the `apply` and `toQuery` methods can be nested, such as
 * 'field.nestedfield'.
 * @alpha
 */
export const hasSpec = createPropertyRule('spec');
