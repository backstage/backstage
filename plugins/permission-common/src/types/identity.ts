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
/**
 * Identity to be used in permission requests. Must be unique for each
 * client caller.
 *
 * @public
 */
export type PermissionIdentity =
  | {
      type: 'user';
      userEntityRef: string;
    }
  | {
      type: 'service';
      subject: string;
    }
  | {
      type: 'none';
    }
  | { type: 'unknown' };

/**
 * @internal
 */
export const permissionIdentityToString = (
  identity?: PermissionIdentity,
): string => {
  switch (identity?.type) {
    case 'user':
      return `user.${identity.userEntityRef}`;
    case 'service':
      return `service.${identity.subject}`;
    case 'none':
      return 'none';
    case 'unknown':
    default:
      return 'unknown';
  }
};
