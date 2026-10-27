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
import { evaluateCondition } from './evaluateCondition';

describe('evaluateCondition', () => {
  it('handles absent conditions and native boolean values', () => {
    expect(evaluateCondition(undefined, {})).toBe(true);
    expect(evaluateCondition('', {})).toBe(true);
    expect(evaluateCondition('  ', {})).toBe(true);
    expect(evaluateCondition('${{ }}', {})).toBe(true);
    expect(evaluateCondition(true, {})).toBe(true);
    expect(evaluateCondition(false, {})).toBe(false);
    expect(evaluateCondition('${{ true }}', {})).toBe(true);
    expect(evaluateCondition('${{ false }}', {})).toBe(false);
  });

  it('supports Nunjitsu expressions with or without delimiters', () => {
    const state = { provider: 'AWS', replicas: 3, config: { enabled: true } };
    for (const expression of [
      "parameters.provider === 'AWS'",
      'parameters.provider != "GCP"',
      'parameters.replicas >= 2 and parameters.config.enabled',
      "parameters.provider in ['AWS', 'Azure']",
      "parameters.provider | lower == 'aws'",
      'not parameters.disabled',
      "parameters['config'].enabled",
    ]) {
      expect(evaluateCondition(expression, state)).toBe(true);
      expect(evaluateCondition(`  \${{ ${expression} }}  `, state)).toBe(true);
    }
    expect(evaluateCondition('${{ parameters.replicas > 3 }}', state)).toBe(
      false,
    );
    expect(
      evaluateCondition('${{ not parameters.config.enabled }}', state),
    ).toBe(false);
    expect(evaluateCondition("${{ parameters.replicas == '3' }}", state)).toBe(
      true,
    );
    expect(evaluateCondition("${{ parameters.replicas === '3' }}", state)).toBe(
      false,
    );
  });

  it('matches action step truthiness and distinguishes null from undefined', () => {
    for (const value of [false, '', 0, null, []]) {
      expect(evaluateCondition('${{ parameters.value }}', { value })).toBe(
        false,
      );
    }
    for (const value of [true, 'false', 1, ['a'], {}]) {
      expect(evaluateCondition('${{ parameters.value }}', { value })).toBe(
        true,
      );
    }
    expect(evaluateCondition('${{ parameters.missing.nested }}', {})).toBe(
      false,
    );
    expect(
      evaluateCondition('${{ parameters.value === null }}', { value: null }),
    ).toBe(true);
    expect(evaluateCondition('${{ parameters.value === null }}', {})).toBe(
      false,
    );
    expect(evaluateCondition('${{ parameters.value === undefined }}', {})).toBe(
      true,
    );
    expect(
      evaluateCondition('${{ parameters.value === undefined }}', {
        value: null,
      }),
    ).toBe(false);
  });

  it('keeps steps visible on invalid expressions and recovers for the next evaluation', () => {
    for (const expression of [
      '${{ invalid...syntax }}',
      '${{ parameters.constructor }}',
      '${{ parameters.__proto__ }}',
      '${{ parameters.value.prototype }}',
      '${{ unknownFunction() }}',
    ]) {
      expect(evaluateCondition(expression, { value: {} })).toBe(true);
      expect(evaluateCondition('${{ false }}', {})).toBe(false);
    }
  });

  it('treats template-looking parameter values as data and leaves inputs unchanged', () => {
    const state = { name: '${{ 7 * 7 }}', items: ['original'] };
    expect(evaluateCondition("${{ parameters.name === '49' }}", state)).toBe(
      false,
    );
    expect(
      evaluateCondition('${{ parameters.items.push("temporary") }}', state),
    ).toBe(true);
    expect(state).toEqual({ name: '${{ 7 * 7 }}', items: ['original'] });
    expect(
      evaluateCondition('${{ parameters.config.value is defined }}', {
        config: { value: undefined },
      }),
    ).toBe(false);
  });
});
