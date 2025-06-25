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
import { PermissionIdentity, permissionIdentityToString } from './identity.ts';

describe('permissionIdentityToString', () => {
  it('should return user identity string', () => {
    const identity: PermissionIdentity = {
      type: 'user',
      userEntityRef: 'user:default/jane',
    };
    expect(permissionIdentityToString(identity)).toBe('user.user:default/jane');
  });

  it('should return service identity string', () => {
    const identity: PermissionIdentity = {
      type: 'service',
      subject: 'my-service',
    };
    expect(permissionIdentityToString(identity)).toBe('service.my-service');
  });

  it('should return none for no identity', () => {
    const identity: PermissionIdentity = { type: 'none' };
    expect(permissionIdentityToString(identity)).toBe('none');
  });

  it('should return unknown for unknown identity', () => {
    const identity: PermissionIdentity = { type: 'unknown' };
    expect(permissionIdentityToString(identity)).toBe('unknown');
  });

  it('should handle undefined identity', () => {
    expect(permissionIdentityToString(undefined)).toBe('unknown');
  });
});
