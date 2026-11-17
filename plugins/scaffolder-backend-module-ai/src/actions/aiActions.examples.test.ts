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
import yaml from 'yaml';
import { createAiGenerateAction, createAiTransformAction } from './aiActions';
import { generateExamples } from './aiGenerate.examples';
import { transformExamples } from './aiTransform.examples';

const options = {
  ai: { openHarness: jest.fn() } as never,
  config: { getOptionalConfig: jest.fn(() => undefined) } as never,
  permissions: {
    authorize: jest.fn(async () => [{ result: 'ALLOW' }]),
  } as never,
};

describe('ai action examples', () => {
  it('exposes both actions with compiled schemas and examples', () => {
    const generate = createAiGenerateAction(options);
    const transform = createAiTransformAction(options);
    expect(generate.id).toBe('ai:generate');
    expect(generate.schema?.input).toBeDefined();
    expect(transform.id).toBe('ai:transform');
    expect(transform.schema?.input).toBeDefined();
  });

  it.each(generateExamples)('$description', ({ example }) => {
    const step = yaml.parse(example).steps[0];
    expect(step.action).toBe('ai:generate');
    expect(typeof step.input.prompt).toBe('string');
    expect(step.input.prompt.length).toBeGreaterThan(0);
  });

  it.each(transformExamples)('$description', ({ example }) => {
    const step = yaml.parse(example).steps[0];
    expect(step.action).toBe('ai:transform');
    expect(typeof step.input.prompt).toBe('string');
    expect(step.input.schema).toBeDefined();
  });
});
