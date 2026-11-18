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

import {
  aiAuditReadPermission,
  aiModelUsePermission,
  aiSessionUsePermission,
  aiToolUsePermission,
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
} from './permissions';

describe('AI permissions', () => {
  it('pins the fixed names, types and resource types policy authors import', () => {
    expect(aiModelUsePermission).toMatchObject({
      type: 'resource',
      name: 'ai.model.use',
      resourceType: RESOURCE_TYPE_AI_MODEL,
    });
    expect(aiToolUsePermission).toMatchObject({
      type: 'resource',
      name: 'ai.tool.use',
      resourceType: RESOURCE_TYPE_AI_TOOL,
    });
    expect(RESOURCE_TYPE_AI_MODEL).toBe('ai-model');
    expect(RESOURCE_TYPE_AI_TOOL).toBe('ai-tool');
    // Basic permissions carry no resource type: there is nothing per session
    // or per audit read to describe, so no name construction exists.
    expect(aiSessionUsePermission).toMatchObject({
      type: 'basic',
      name: 'ai.session.use',
    });
    expect(aiAuditReadPermission).toMatchObject({
      type: 'basic',
      name: 'ai.audit.read',
      attributes: { action: 'read' },
    });
    for (const permission of [
      aiModelUsePermission,
      aiToolUsePermission,
      aiSessionUsePermission,
      aiAuditReadPermission,
    ]) {
      expect(permission.name).not.toMatch(/[%<>]/);
    }
  });
});
