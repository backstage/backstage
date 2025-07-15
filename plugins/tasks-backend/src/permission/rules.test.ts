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
import {
  isFromPlugin,
  matchesTaskPattern,
  taskPermissionRules,
  taskPermissionResourceRef,
} from './rules';
import { TaskMetadata } from '../types';

describe('Task Permission Rules', () => {
  const mockTaskMetadata: TaskMetadata = {
    id: 'test-task-id',
    pluginId: 'test-plugin',
    taskId: 'original-task-123',
    meta: {
      title: 'Test Task Title',
      description: 'Test description',
    },
    task: {
      taskId: 'original-task-123',
      pluginId: 'test-plugin',
      scope: 'global',
      settings: { version: 1 },
      taskState: { status: 'idle' },
      workerState: { status: 'idle' },
    },
    computed: {
      status: 'idle',
      cadence: '0 */4 * * *',
      lastRunEndedAt: '2023-12-01T10:00:00Z',
    },
  };

  describe('Resource Reference', () => {
    it('should have correct plugin ID and resource type', () => {
      expect(taskPermissionResourceRef.pluginId).toBe('tasks');
      expect(taskPermissionResourceRef.resourceType).toBe('task');
    });

    it('should export all rules in taskPermissionRules array', () => {
      expect(taskPermissionRules).toHaveLength(2);
      expect(taskPermissionRules).toContain(isFromPlugin);
      expect(taskPermissionRules).toContain(matchesTaskPattern);
    });
  });

  describe('IS_FROM_PLUGIN Rule', () => {
    it('should return true when plugin IDs match', () => {
      const params = { pluginId: 'test-plugin' };
      const result = isFromPlugin.apply(mockTaskMetadata, params);

      expect(result).toBe(true);
    });

    it('should return false when plugin IDs do not match', () => {
      const params = { pluginId: 'different-plugin' };
      const result = isFromPlugin.apply(mockTaskMetadata, params);

      expect(result).toBe(false);
    });

    it('should generate correct query for toQuery', () => {
      const params = { pluginId: 'test-plugin' };
      const query = isFromPlugin.toQuery(params);

      expect(query).toEqual({
        pluginId: 'test-plugin',
      });
    });

    describe('Edge Cases', () => {
      it('should return false for empty plugin ID parameter', () => {
        const params = { pluginId: '' };
        const result = isFromPlugin.apply(mockTaskMetadata, params);

        expect(result).toBe(false);
      });

      it('should return false when resource has null pluginId', () => {
        const corruptedTask = { ...mockTaskMetadata, pluginId: null as any };
        const params = { pluginId: 'test-plugin' };
        const result = isFromPlugin.apply(corruptedTask, params);

        expect(result).toBe(false);
      });

      it('should return false when resource has undefined pluginId', () => {
        const corruptedTask = {
          ...mockTaskMetadata,
          pluginId: undefined as any,
        };
        const params = { pluginId: 'test-plugin' };
        const result = isFromPlugin.apply(corruptedTask, params);

        expect(result).toBe(false);
      });

      it('should handle special characters in plugin IDs', () => {
        const specialPluginId = 'plugin-with-special-chars_123';
        const taskWithSpecialPluginId = {
          ...mockTaskMetadata,
          pluginId: specialPluginId,
        };
        const params = { pluginId: specialPluginId };
        const result = isFromPlugin.apply(taskWithSpecialPluginId, params);

        expect(result).toBe(true);
      });

      it('should generate safe queries for special characters', () => {
        const params = { pluginId: 'plugin-with-special-chars_123' };
        const query = isFromPlugin.toQuery(params);

        expect(query).toEqual({ pluginId: 'plugin-with-special-chars_123' });
      });

      it('should be case sensitive', () => {
        const params = { pluginId: 'TEST-PLUGIN' };
        const result = isFromPlugin.apply(mockTaskMetadata, params);

        expect(result).toBe(false);
      });
    });
  });

  describe('MATCHES_TASK_PATTERN Rule', () => {
    describe('Exact Matching', () => {
      it('should return true for exact match', () => {
        const params = {
          pattern: 'original-task-123',
          matchType: 'exact' as const,
        };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(true);
      });

      it('should return false for non-exact match', () => {
        const params = {
          pattern: 'different-task',
          matchType: 'exact' as const,
        };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(false);
      });

      it('should generate correct query for exact match', () => {
        const params = {
          pattern: 'original-task-123',
          matchType: 'exact' as const,
        };
        const query = matchesTaskPattern.toQuery(params);
        expect(query).toEqual({ taskId: 'original-task-123' });
      });
    });

    describe('Glob Matching', () => {
      it('should return true for glob pattern match', () => {
        const params = { pattern: 'original-*', matchType: 'glob' as const };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(true);
      });

      it('should return true for wildcard pattern', () => {
        const params = { pattern: '*-task-*', matchType: 'glob' as const };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(true);
      });

      it('should return false for non-matching glob pattern', () => {
        const params = { pattern: 'catalog-*', matchType: 'glob' as const };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(false);
      });

      it('should return empty query for glob patterns', () => {
        const params = { pattern: 'original-*', matchType: 'glob' as const };
        const query = matchesTaskPattern.toQuery(params);
        expect(query).toEqual({});
      });
    });

    describe('Regex Matching', () => {
      it('should return true for regex pattern match', () => {
        const params = {
          pattern: '^original-.*-123$',
          matchType: 'regex' as const,
        };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(true);
      });

      it('should return false for non-matching regex pattern', () => {
        const params = { pattern: '^catalog-.*', matchType: 'regex' as const };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(false);
      });

      it('should handle invalid regex gracefully', () => {
        const params = {
          pattern: '[invalid-regex',
          matchType: 'regex' as const,
        };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(false);
      });

      it('should return empty query for regex patterns', () => {
        const params = { pattern: '^original-.*', matchType: 'regex' as const };
        const query = matchesTaskPattern.toQuery(params);
        expect(query).toEqual({});
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty task ID', () => {
        const emptyTask = { ...mockTaskMetadata, taskId: '' };
        const params = { pattern: '', matchType: 'exact' as const };
        const result = matchesTaskPattern.apply(emptyTask, params);
        expect(result).toBe(true);
      });

      it('should handle null task ID', () => {
        const nullTask = { ...mockTaskMetadata, taskId: null as any };
        const params = { pattern: 'test', matchType: 'exact' as const };
        const result = matchesTaskPattern.apply(nullTask, params);
        expect(result).toBe(false);
      });

      it('should return false for unknown match type', () => {
        const params = { pattern: 'test', matchType: 'unknown' as any };
        const result = matchesTaskPattern.apply(mockTaskMetadata, params);
        expect(result).toBe(false);
      });
    });
  });

  describe('Rule Registry', () => {
    it('should export all rules in taskPermissionRules array', () => {
      expect(Array.isArray(taskPermissionRules)).toBe(true);
      expect(taskPermissionRules).toHaveLength(2);
      expect(taskPermissionRules[0]).toBe(isFromPlugin);
      expect(taskPermissionRules[1]).toBe(matchesTaskPattern);
    });

    it('should contain unique rules', () => {
      const ruleNames = taskPermissionRules.map(rule => rule.name);
      const uniqueRuleNames = [...new Set(ruleNames)];
      expect(ruleNames).toHaveLength(uniqueRuleNames.length);
    });

    it('should have all rules with proper resourceType', () => {
      taskPermissionRules.forEach(rule => {
        expect(rule.resourceType).toBe('task');
      });
    });
  });

  describe('Query Generation Security', () => {
    it('should not expose sensitive data in query objects', () => {
      const sensitiveParams = {
        pattern: 'sensitive-task-id',
        matchType: 'exact' as const,
      };
      const query = matchesTaskPattern.toQuery(sensitiveParams);

      expect(Object.keys(query)).toEqual(['taskId']);
      expect(query).toEqual({
        taskId: 'sensitive-task-id',
      });
    });

    it('should generate queries with only expected properties', () => {
      const pluginQuery = isFromPlugin.toQuery({ pluginId: 'test' });
      expect(Object.keys(pluginQuery)).toEqual(['pluginId']);

      const taskIdQuery = matchesTaskPattern.toQuery({
        pattern: 'test',
        matchType: 'exact',
      });
      expect(Object.keys(taskIdQuery)).toEqual(['taskId']);
    });

    it('should handle pattern matching queries safely', () => {
      const exactQuery = matchesTaskPattern.toQuery({
        pattern: 'test',
        matchType: 'exact',
      });
      expect(exactQuery).toEqual({ taskId: 'test' });

      const globQuery = matchesTaskPattern.toQuery({
        pattern: 'test*',
        matchType: 'glob',
      });
      expect(globQuery).toEqual({});
    });
  });

  describe('Resource Integrity', () => {
    it('should handle completely malformed resource gracefully', () => {
      const malformedResource = {} as TaskMetadata;

      expect(() => {
        isFromPlugin.apply(malformedResource, { pluginId: 'test' });
      }).not.toThrow();

      expect(() => {
        matchesTaskPattern.apply(malformedResource, {
          pattern: 'test',
          matchType: 'exact',
        });
      }).not.toThrow();
    });

    it('should deny access for malformed resources', () => {
      const malformedResource = {} as TaskMetadata;

      expect(isFromPlugin.apply(malformedResource, { pluginId: 'test' })).toBe(
        false,
      );

      expect(
        matchesTaskPattern.apply(malformedResource, {
          pattern: 'test',
          matchType: 'exact',
        }),
      ).toBe(false);
    });
  });

  describe('Parameter Validation', () => {
    it('should handle empty parameter objects gracefully', () => {
      const emptyParams = {} as any;

      expect(() => {
        isFromPlugin.apply(mockTaskMetadata, emptyParams);
      }).not.toThrow();

      expect(isFromPlugin.apply(mockTaskMetadata, emptyParams)).toBe(false);
    });

    it('should handle null parameters gracefully', () => {
      const nullParams = null as any;

      expect(() => {
        isFromPlugin.apply(mockTaskMetadata, nullParams);
      }).toThrow();
    });
  });
});
