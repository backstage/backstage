/*
 * Copyright 2025 The Backstage Authors
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
import { PermissionsService } from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

// Helper function to check conditional authorization for a single resource
export async function checkResourcePermission(
  permissions: PermissionsService,
  permission: any,
  _resourceId: string,
  resource: any,
  isAuthorized: any,
  credentials: any,
): Promise<{ allowed: boolean; status?: number; message?: string }> {
  const decision = await permissions.authorizeConditional([{ permission }], {
    credentials,
  });

  if (decision[0].result === AuthorizeResult.DENY) {
    return { allowed: false, status: 403, message: 'Forbidden' };
  }

  // For conditional authorization, check against the actual resource
  if (decision[0].result === AuthorizeResult.CONDITIONAL) {
    if (!isAuthorized(decision[0], resource)) {
      return { allowed: false, status: 403, message: 'Forbidden' };
    }
  }

  return { allowed: true };
}
