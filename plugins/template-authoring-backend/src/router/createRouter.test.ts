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
import express from 'express';
import request from 'supertest';
import { createRouter } from './createRouter';
import { TemplateGenerationService } from '../services/TemplateGenerationService';
import { TemplateValidator } from '../services/TemplateValidator';

const buildApp = (
  svc: Partial<TemplateGenerationService>,
  validator: Partial<TemplateValidator> = {
    check: () => ({ ok: true, warnings: [] }),
  },
) => {
  const app = express();
  app.use(
    createRouter({
      generationService: svc as TemplateGenerationService,
      validator: validator as TemplateValidator,
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
    }),
  );
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const status =
        err?.name === 'InputError'
          ? 400
          : err?.status ?? err?.statusCode ?? 500;
      res
        .status(status)
        .json({ error: { message: err?.message ?? String(err) } });
    },
  );
  return app;
};

describe('createRouter', () => {
  const sampleTemplate = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: { name: 'x' },
    spec: {
      owner: 'group:default/p',
      type: 'service',
      steps: [{ id: 'a', action: 'fetch:template' }],
    },
  };

  it('POST /v1/generate returns yaml + template + citations + merged warnings', async () => {
    const generate = jest.fn().mockResolvedValue({
      yaml: 'apiVersion: scaffolder.backstage.io/v1beta3\nkind: Template\n',
      template: sampleTemplate,
      citations: {
        referenceTemplates: ['template:default/base'],
        actionsUsed: ['fetch:template'],
      },
      warnings: ['generation-warn'],
    });
    const check = jest
      .fn()
      .mockReturnValue({ ok: false, warnings: ['validator-warn'] });

    const app = buildApp({ generate }, { check });

    const res = await request(app)
      .post('/v1/generate')
      .send({
        description: 'a small service',
        referenceTemplates: ['template:default/base'],
      });

    expect(res.status).toEqual(200);
    expect(res.body.yaml).toContain(
      'apiVersion: scaffolder.backstage.io/v1beta3',
    );
    expect(res.body.citations.actionsUsed).toEqual(['fetch:template']);
    expect(res.body.warnings).toEqual(['generation-warn', 'validator-warn']);

    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'a small service',
        referenceRefs: ['template:default/base'],
      }),
    );
    expect(check).toHaveBeenCalledWith(sampleTemplate);
  });

  it('defaults referenceTemplates to [] when omitted', async () => {
    const generate = jest.fn().mockResolvedValue({
      yaml: 'x',
      template: sampleTemplate,
      citations: { referenceTemplates: [], actionsUsed: [] },
      warnings: [],
    });
    const app = buildApp({ generate });

    await request(app).post('/v1/generate').send({ description: 'x' });

    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({ referenceRefs: [] }),
    );
  });

  it('rejects requests missing a string description', async () => {
    const generate = jest.fn();
    const app = buildApp({ generate });

    const res = await request(app).post('/v1/generate').send({});

    expect(res.status).toEqual(400);
    expect(res.body.error.message).toMatch(/string `description`/);
    expect(generate).not.toHaveBeenCalled();
  });

  it('rejects a non-array referenceTemplates', async () => {
    const generate = jest.fn();
    const app = buildApp({ generate });

    const res = await request(app)
      .post('/v1/generate')
      .send({ description: 'x', referenceTemplates: 'template:default/a' });

    expect(res.status).toEqual(400);
    expect(res.body.error.message).toMatch(/must be an array of strings/);
  });
});
