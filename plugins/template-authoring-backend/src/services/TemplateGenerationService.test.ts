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

import { mockServices } from '@backstage/backend-test-utils';
import { ReferenceTemplateLoader } from './ReferenceTemplateLoader';
import {
  GeneratedTemplate,
  TemplateGenerationService,
} from './TemplateGenerationService';

const minimalTemplate = (): GeneratedTemplate => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: { name: 'demo-service' },
  spec: {
    owner: 'group:default/platform',
    type: 'service',
    steps: [
      {
        id: 'fetch',
        name: 'Fetch skeleton',
        action: 'fetch:template',
        input: {
          url: './skeleton',
          values: { name: '${{ parameters.name }}' },
        },
      },
      {
        id: 'publish',
        name: 'Publish to GitHub',
        action: 'publish:github',
        input: { repoUrl: '${{ parameters.repoUrl }}' },
      },
    ],
  },
});

describe('TemplateGenerationService', () => {
  const logger = mockServices.logger.mock();

  const buildService = (
    objectToReturn: GeneratedTemplate,
    loader: Partial<ReferenceTemplateLoader> = {
      load: jest.fn().mockResolvedValue([]),
    },
  ) => {
    const generateObject = jest
      .fn()
      .mockResolvedValue({ object: objectToReturn });
    return {
      svc: new TemplateGenerationService(
        loader as ReferenceTemplateLoader,
        'mock-model',
        generateObject,
        logger,
        'group:default/unowned',
      ),
      generateObject,
      loader,
    };
  };

  it('calls generateObject with the user description and system prompt', async () => {
    const { svc, generateObject } = buildService(minimalTemplate());

    await svc.generate({
      description: 'A Node.js microservice with logging',
    });

    expect(generateObject).toHaveBeenCalledTimes(1);
    const call = generateObject.mock.calls[0][0];
    expect(call.model).toEqual('mock-model');
    expect(call.schema).toBeDefined();
    expect(call.system).toMatch(/scaffolder Template entities/);
    expect(call.system).toMatch(/fetch:template/);
    expect(call.prompt).toContain('A Node.js microservice with logging');
  });

  it('returns the template as YAML + parsed object + citations', async () => {
    const { svc } = buildService(minimalTemplate());

    const result = await svc.generate({ description: 'demo' });

    expect(result.template.metadata.name).toEqual('demo-service');
    expect(result.yaml).toContain(
      'apiVersion: scaffolder.backstage.io/v1beta3',
    );
    expect(result.yaml).toContain('kind: Template');
    expect(result.yaml).toContain('name: demo-service');
    expect(result.citations.actionsUsed).toEqual(
      expect.arrayContaining(['fetch:template', 'publish:github']),
    );
    expect(result.warnings).toEqual([]);
  });

  it('embeds reference templates into the user prompt', async () => {
    const referenceEntity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template' as const,
      metadata: { name: 'base', namespace: 'default' },
      spec: { owner: 'group:default/p', type: 'service', steps: [] },
    };
    const load = jest.fn().mockResolvedValue([referenceEntity]);
    const { svc, generateObject } = buildService(minimalTemplate(), { load });

    await svc.generate({
      description: 'extend the base service',
      referenceRefs: ['template:default/base'],
    });

    expect(load).toHaveBeenCalledWith(['template:default/base'], {
      credentials: undefined,
    });
    const prompt = generateObject.mock.calls[0][0].prompt as string;
    expect(prompt).toContain('Reference templates');
    expect(prompt).toContain('default/base');
  });

  it('throws InputError on an empty description', async () => {
    const { svc } = buildService(minimalTemplate());
    await expect(svc.generate({ description: '   ' })).rejects.toThrow(
      /description must not be empty/,
    );
  });

  it('defaults missing owner and surfaces a warning', async () => {
    const tpl = minimalTemplate();
    (tpl.spec as any).owner = '';
    const { svc } = buildService(tpl);

    const result = await svc.generate({ description: 'demo' });

    expect(result.template.spec.owner).toEqual('group:default/unowned');
    expect(result.warnings).toEqual([
      expect.stringMatching(/spec.owner was missing/),
    ]);
  });
});
