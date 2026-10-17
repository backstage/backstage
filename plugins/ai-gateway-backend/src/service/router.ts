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
  HttpAuthService,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { AIModelsService } from '@backstage/backend-plugin-api/alpha';
import {
  InputError,
  NotAllowedError,
  ServiceUnavailableError,
  isError,
} from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { JsonObject } from '@backstage/types';
import { json } from 'express';
import { createOpenApiRouter } from '../schema/openapi';
import { GenerateTextRequest } from '../schema/openapi/generated/models';
import { aiGatewayInvokePermission } from '../permissions';

/** @internal */
export interface AiGatewayLimits {
  maxInputCharacters: number;
  maxSchemaCharacters: number;
  maxOutputTokens: number;
  /** Allowed provider and model pairs. When undefined only the defaults are allowed. */
  allowedModels?: Array<{ provider: string; model: string }>;
}

// Errors with these names are raised by the AI models service for problems the
// caller can act on. Anything else may originate from an upstream provider and
// can contain prompt contents or provider details, so it is never forwarded.
const SAFE_ERROR_NAMES = new Set(['InputError', 'ServiceUnavailableError']);

const GENERIC_PROVIDER_ERROR = 'The AI provider request failed';

function toClientError(error: unknown, logger: LoggerService): Error {
  if (isError(error) && SAFE_ERROR_NAMES.has(error.name)) {
    return error;
  }
  // Only log the error name, upstream errors can embed the request body.
  logger.warn('AI gateway request failed', {
    errorName: isError(error) ? error.name : typeof error,
  });
  return new ServiceUnavailableError(GENERIC_PROVIDER_ERROR);
}

function validateModelSelection(
  body: GenerateTextRequest,
  allowedModels: AiGatewayLimits['allowedModels'],
) {
  const { provider, model } = body;
  if (provider === undefined && model === undefined) {
    return;
  }
  if (!allowedModels) {
    throw new InputError(
      'Selecting a provider or model is not allowed, configure aiGateway.allowedModels to enable it',
    );
  }
  if (provider === undefined || model === undefined) {
    throw new InputError(
      'Both `provider` and `model` must be set when selecting a model',
    );
  }
  if (!allowedModels.some(a => a.provider === provider && a.model === model)) {
    throw new InputError(
      `The model '${model}' of provider '${provider}' is not allowed`,
    );
  }
}

function validateRequest(
  body: GenerateTextRequest,
  limits: AiGatewayLimits,
  schema?: JsonObject,
) {
  validateModelSelection(body, limits.allowedModels);
  const hasPrompt = body.prompt !== undefined;
  const hasMessages = body.messages !== undefined;
  if (hasPrompt === hasMessages) {
    throw new InputError('Exactly one of `prompt` or `messages` is required');
  }
  if (body.messages?.length === 0) {
    throw new InputError('At least one message is required');
  }

  const inputSize =
    (body.system?.length ?? 0) +
    (body.prompt?.length ?? 0) +
    (body.messages ?? []).reduce((sum, m) => sum + m.content.length, 0);
  if (inputSize > limits.maxInputCharacters) {
    throw new InputError(
      `The request input is too large, the limit is ${limits.maxInputCharacters} characters`,
    );
  }

  if (schema && JSON.stringify(schema).length > limits.maxSchemaCharacters) {
    throw new InputError(
      `The request schema is too large, the limit is ${limits.maxSchemaCharacters} characters`,
    );
  }
}

/** @internal */
export async function createRouter(options: {
  aiModels: AIModelsService;
  httpAuth: HttpAuthService;
  permissions: PermissionsService;
  logger: LoggerService;
  limits: AiGatewayLimits;
}) {
  const { aiModels, httpAuth, permissions, logger, limits } = options;

  // JSON escapes can expand characters, and non-ASCII characters take up to 4 bytes.
  const bodyLimitBytes =
    (limits.maxInputCharacters + limits.maxSchemaCharacters) * 6 + 64 * 1024;
  const router = await createOpenApiRouter({
    middleware: [json({ limit: bodyLimitBytes })],
  });

  async function authorize(req: Parameters<typeof httpAuth.credentials>[0]) {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const [decision] = await permissions.authorize(
      [{ permission: aiGatewayInvokePermission }],
      { credentials },
    );
    if (decision.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError('Not allowed to use the AI gateway');
    }
    return credentials;
  }

  function requestSettings(body: GenerateTextRequest) {
    return {
      provider: body.provider,
      model: body.model,
      system: body.system,
      prompt: body.prompt,
      messages: body.messages,
      maxOutputTokens: limits.maxOutputTokens,
    };
  }

  router.post('/v1/generate/text', async (req, res) => {
    const credentials = await authorize(req);
    validateRequest(req.body, limits);

    try {
      const result = await aiModels.generateText(requestSettings(req.body));
      logger.info('AI gateway text generation', {
        user: credentials.principal.userEntityRef,
        provider: result.provider,
        model: result.model,
        ...result.usage,
      });
      res.json({
        text: result.text,
        finishReason: result.finishReason,
        usage: result.usage,
      });
    } catch (error) {
      throw toClientError(error, logger);
    }
  });

  router.post('/v1/generate/object', async (req, res) => {
    const credentials = await authorize(req);
    validateRequest(req.body, limits, req.body.schema);

    try {
      const result = await aiModels.generateObject({
        ...requestSettings(req.body),
        schema: req.body.schema,
      });
      logger.info('AI gateway object generation', {
        user: credentials.principal.userEntityRef,
        provider: result.provider,
        model: result.model,
        ...result.usage,
      });
      res.json({
        object: result.object,
        finishReason: result.finishReason,
        usage: result.usage,
      });
    } catch (error) {
      throw toClientError(error, logger);
    }
  });

  router.post('/v1/generate/stream', async (req, res) => {
    const credentials = await authorize(req);
    validateRequest(req.body, limits);

    const abortController = new AbortController();
    // The response closing before it finished means that the client went away
    res.on('close', () => {
      if (!res.writableFinished) {
        abortController.abort();
      }
    });

    // Start the stream before sending headers so that selection and
    // configuration errors are reported with a proper status code.
    let result;
    try {
      result = aiModels.streamText({
        ...requestSettings(req.body),
        abortSignal: abortController.signal,
      });
    } catch (error) {
      throw toClientError(error, logger);
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const send = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      for await (const delta of result.textStream) {
        send('text', { delta });
      }
      const { finishReason, usage } = await result.response;
      logger.info('AI gateway text streaming', {
        user: credentials.principal.userEntityRef,
        provider: result.provider,
        model: result.model,
        ...usage,
      });
      send('done', { finishReason, usage });
    } catch (error) {
      if (!abortController.signal.aborted) {
        send('error', { message: toClientError(error, logger).message });
      }
    }
    res.end();
  });

  return router;
}
