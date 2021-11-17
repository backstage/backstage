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

import { PermissionRule } from '../types';

/**
 * Creates a condition function for a given authorization rule and parameter type.
 *
 * For example, an isEntityOwner rule for catalog entities might take an array of entityRef strings.
 * The rule itself defines _how_ to check a given resource, whereas a condition also includes _what_
 * to verify.
 *
 * Plugin authors should generally use the {@link createPermissionIntegration} helper, which creates
 * conditions for the rules supplied. However, a different plugin can also add rules to this
 * integration (using the returned `registerPermissionRule` from this function), and create the
 * condition to be used in an {@link PermissionPolicy} using this method directly.
 * @public
 */
export const conditionFor =
  <TParams extends any[]>(rule: PermissionRule<unknown, unknown, TParams>) =>
  (...params: TParams) => ({
    rule: rule.name,
    params,
  });
