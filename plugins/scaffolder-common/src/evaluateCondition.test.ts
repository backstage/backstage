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
import { evaluateCondition } from './evaluateCondition';

describe('evaluateCondition', () => {
  it('returns true when condition is undefined', () => {
    expect(evaluateCondition(undefined, {})).toBe(true);
  });

  it('returns the boolean value directly', () => {
    expect(evaluateCondition(true, {})).toBe(true);
    expect(evaluateCondition(false, {})).toBe(false);
  });

  it('returns true for empty string', () => {
    expect(evaluateCondition('', {})).toBe(true);
    expect(evaluateCondition('  ', {})).toBe(true);
  });

  describe('${{ }} expression syntax', () => {
    it('evaluates strict equality', () => {
      const state = { cloudProvider: 'AWS' };
      expect(
        evaluateCondition("${{ parameters.cloudProvider === 'AWS' }}", state),
      ).toBe(true);
      expect(
        evaluateCondition("${{ parameters.cloudProvider === 'GCP' }}", state),
      ).toBe(false);
    });

    it('evaluates strict inequality', () => {
      const state = { cloudProvider: 'AWS' };
      expect(
        evaluateCondition("${{ parameters.cloudProvider !== 'GCP' }}", state),
      ).toBe(true);
      expect(
        evaluateCondition("${{ parameters.cloudProvider !== 'AWS' }}", state),
      ).toBe(false);
    });

    it('evaluates loose equality', () => {
      const state = { count: 0 };
      expect(
        evaluateCondition("${{ parameters.count == 'false' }}", state),
      ).toBe(false);
      expect(evaluateCondition("${{ parameters.count == '0' }}", state)).toBe(
        true,
      );
    });

    it('evaluates loose inequality', () => {
      const state = { value: 'hello' };
      expect(
        evaluateCondition("${{ parameters.value != 'world' }}", state),
      ).toBe(true);
    });

    it('evaluates truthiness of a parameter', () => {
      expect(
        evaluateCondition('${{ parameters.enabled }}', { enabled: true }),
      ).toBe(true);
      expect(
        evaluateCondition('${{ parameters.enabled }}', { enabled: false }),
      ).toBe(false);
      expect(
        evaluateCondition('${{ parameters.name }}', { name: 'test' }),
      ).toBe(true);
      expect(evaluateCondition('${{ parameters.name }}', { name: '' })).toBe(
        false,
      );
      expect(evaluateCondition('${{ parameters.name }}', {})).toBe(false);
    });

    it('evaluates negation', () => {
      expect(
        evaluateCondition('${{ !parameters.skipDeploy }}', {
          skipDeploy: false,
        }),
      ).toBe(true);
      expect(
        evaluateCondition('${{ !parameters.skipDeploy }}', {
          skipDeploy: true,
        }),
      ).toBe(false);
    });

    it('handles nested property access', () => {
      const state = { config: { region: 'us-east-1' } };
      expect(
        evaluateCondition(
          "${{ parameters.config.region === 'us-east-1' }}",
          state,
        ),
      ).toBe(true);
    });

    it('handles missing nested properties gracefully', () => {
      expect(evaluateCondition('${{ parameters.missing.nested }}', {})).toBe(
        false,
      );
    });

    it('handles numeric comparisons', () => {
      const state = { replicas: 3 };
      expect(evaluateCondition('${{ parameters.replicas === 3 }}', state)).toBe(
        true,
      );
      expect(evaluateCondition('${{ parameters.replicas === 5 }}', state)).toBe(
        false,
      );
    });

    it('handles boolean literal comparisons', () => {
      const state = { enabled: true };
      expect(
        evaluateCondition('${{ parameters.enabled === true }}', state),
      ).toBe(true);
      expect(
        evaluateCondition('${{ parameters.enabled === false }}', state),
      ).toBe(false);
    });

    it('handles double-quoted strings', () => {
      const state = { provider: 'AWS' };
      expect(
        evaluateCondition('${{ parameters.provider === "AWS" }}', state),
      ).toBe(true);
    });

    it('handles expressions without ${{ }} wrapper', () => {
      const state = { cloudProvider: 'AWS' };
      expect(
        evaluateCondition("parameters.cloudProvider === 'AWS'", state),
      ).toBe(true);
    });

    it('treats empty arrays as falsy', () => {
      expect(evaluateCondition('${{ parameters.items }}', { items: [] })).toBe(
        false,
      );
      expect(
        evaluateCondition('${{ parameters.items }}', { items: ['a'] }),
      ).toBe(true);
    });
  });
});
