/*
 * Copyright 2026 Estehsan Tariq
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

import { createPermission } from '@backstage/plugin-permission-common';

/** Permission required to read a user's onboarding progress.
 * @public
 */
export const onboardingProgressReadPermission = createPermission({
  name: 'onboarding.progress.read',
  attributes: { action: 'read' },
});

/**
 * Permission required to update a user's task status.
 * @public
 */
export const onboardingProgressUpdatePermission = createPermission({
  name: 'onboarding.progress.update',
  attributes: { action: 'update' },
});

/**
 * Permission required to view team-level onboarding statistics.
 * @public
 */
export const onboardingTeamReadPermission = createPermission({
  name: 'onboarding.team.read',
  attributes: { action: 'read' },
});

/**
 * Permission required to assign an onboarding template to a user.
 * @public
 */
export const onboardingTemplateAssignPermission = createPermission({
  name: 'onboarding.template.assign',
  attributes: { action: 'create' },
});

/**
 * All onboarding permissions, for use in permission policy registration.
 * @public
 */
export const onboardingPermissions = [
  onboardingProgressReadPermission,
  onboardingProgressUpdatePermission,
  onboardingTeamReadPermission,
  onboardingTemplateAssignPermission,
];
