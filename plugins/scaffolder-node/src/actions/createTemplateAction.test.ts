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
import { createTemplateAction } from './createTemplateAction';
import { z } from 'zod';

describe('createTemplateAction', () => {
  it('should allow creating with jsonschema and use the old deprecated types', () => {
    const action = createTemplateAction<{ repoUrl: string }, { test: string }>({
      id: 'test',
      schema: {
        input: {
          type: 'object',
          required: ['repoUrl'],
          properties: {
            repoUrl: { type: 'string' },
          },
        },
        output: {
          type: 'object',
          required: ['test'],
          properties: {
            test: { type: 'string' },
          },
        },
      },
      handler: async ctx => {
        // @ts-expect-error - repoUrl is string
        const a: number = ctx.input.repoUrl;

        const b: string = ctx.input.repoUrl;
        expect(b).toBeDefined();

        const stream = ctx.logStream;
        expect(stream).toBeDefined();

        ctx.output('test', 'value');

        // @ts-expect-error - not valid output type
        ctx.output('test', 4);

        // @ts-expect-error - not valid output name
        ctx.output('test2', 'value');
      },
    });

    expect(action).toBeDefined();
  });

  it('should allow creating with zod and use the old deprecated types', () => {
    const action = createTemplateAction({
      id: 'test',
      schema: {
        input: z.object({
          repoUrl: z.string(),
        }),
        output: z.object({
          test: z.string(),
        }),
      },
      handler: async ctx => {
        // @ts-expect-error - repoUrl is string
        const a: number = ctx.input.repoUrl;

        const b: string = ctx.input.repoUrl;
        expect(b).toBeDefined();

        const stream = ctx.logStream;
        expect(stream).toBeDefined();

        ctx.output('test', 'value');

        // @ts-expect-error - not valid output type
        ctx.output('test', 4);

        // @ts-expect-error - not valid output name
        ctx.output('test2', 'value');
      },
    });

    expect(action).toBeDefined();
  });

  it('should allow creating with new first class zod support', () => {
    const action = createTemplateAction({
      id: 'test',
      schema: {
        input: {
          repoUrl: d => d.string(),
        },
        output: {
          test: d => d.string(),
        },
      },
      handler: async ctx => {
        // @ts-expect-error - repoUrl is string
        const a: number = ctx.input.repoUrl;

        const b: string = ctx.input.repoUrl;
        expect(b).toBeDefined();

        // @ts-expect-error - logStream is not available
        const stream = ctx.logStream;

        expect(stream).toBeDefined();

        ctx.output('test', 'value');

        // @ts-expect-error - not valid output type
        ctx.output('test', 4);

        // @ts-expect-error - not valid output name
        ctx.output('test2', 'value');
      },
    });

    expect(action).toBeDefined();
  });
});
