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
import { permissionRules } from '@backstage/plugin-catalog-backend';
/**
 *
 * Jenkins' permission rules can be used to defined different kind of rules to check if the user authorizes an action
 * (or listing the jobs ever)
 *
 * Provided rules:
 * {isEntityOwner} can be used to determine if a user or the group of the user
 * owns an entity.
 *
 * @public
 */
export const jenkinsPermissionRules = {
  isEntityOwner: permissionRules.isEntityOwner,
};
