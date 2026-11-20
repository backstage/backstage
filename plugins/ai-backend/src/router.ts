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

import { randomUUID } from 'node:crypto';
import express, { type Request } from 'express';
import Router from 'express-promise-router';
import { ConfigReader } from '@backstage/config';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import type {
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { JsonObject } from '@backstage/types';
import type { SignalsService } from '@backstage/plugin-signals-node';
import type { NotificationService } from '@backstage/plugin-notifications-node';
import type {
  AiHealthReport,
  AiHttpSupport,
  AiService,
} from '@backstage/ai-node/alpha';
import {
  createRegistry,
  type ConversationId,
} from '@earendil-works/pi-durable';

const registry = createRegistry();
const config = new ConfigReader({ agent: { mode: 'interactive' } });

function modelFrom(body: unknown): { provider: string; modelId: string } {
  const model = (
    body as { model?: { provider?: unknown; modelId?: unknown } } | null
  )?.model;
  if (
    !model ||
    typeof model.provider !== 'string' ||
    !model.provider ||
    typeof model.modelId !== 'string' ||
    !model.modelId
  )
    throw new InputError('Expected provider and modelId');
  return { provider: model.provider, modelId: model.modelId };
}

function conversationId(value: string): ConversationId {
  if (!/^[1-9][0-9]*$/.test(value) || !Number.isSafeInteger(Number(value)))
    throw new InputError('Invalid conversation ID');
  return Number(value) as ConversationId;
}

export function createRouter(options: {
  ai: AiService;
  support: AiHttpSupport;
  httpAuth: HttpAuthService;
  /** Fail-open health evaluation over the service's observability events. */
  health: () => AiHealthReport;
  /** Live observation channel for session events; see the README. */
  signals: SignalsService;
  /** Platform nudge when a submission settles after its stream is gone. */
  notifications: NotificationService;
  logger: LoggerService;
}): express.Router {
  const router = Router();
  router.use(express.json({ limit: '64kb' }));

  // Readiness derived from the managed service's own signals. Deliberately
  // unauthenticated, like the repo's other plugin health routes, for
  // infrastructure probes; the signals carry no secrets — identifiers,
  // counts, and durations only.
  router.get('/health', (_req, res) => {
    const report = options.health();
    res
      .status(report.status === 'ok' ? 200 : 503)
      .json({ status: report.status, signals: report.signals });
  });
  async function credentials(req: Request) {
    const result = await options.httpAuth.credentials(req, { allow: ['user'] });
    try {
      await options.support.authorize(result);
    } catch {
      throw new NotAllowedError('AI session access denied');
    }
    return result;
  }
  async function owned(req: Request) {
    const result = await credentials(req);
    try {
      await options.support.assertSessionOwner(result, req.params.sessionId);
    } catch {
      throw new NotFoundError('AI session not found');
    }
    return result;
  }
  async function open(
    sessionId: string,
    actor: Awaited<ReturnType<typeof credentials>>,
  ) {
    return options.ai.openHarness({
      sessionId,
      credentials: actor,
      registry,
      registryVersion: 'ai-http-v1',
      config: { root: config, path: 'agent' },
    });
  }
  router.get('/v1/models', async (req, res) => {
    const actor = await credentials(req);
    res.json({ items: await options.support.listModels(actor) });
  });
  router.get('/v1/sessions', async (req, res) => {
    const actor = await credentials(req);
    const cursor =
      typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const rawLimit = req.query.limit;
    if (
      rawLimit !== undefined &&
      (typeof rawLimit !== 'string' ||
        !/^[0-9]+$/.test(rawLimit) ||
        Number(rawLimit) < 1)
    ) {
      throw new InputError('Invalid session page limit');
    }
    const limit =
      rawLimit === undefined ? undefined : Math.min(Number(rawLimit), 500);
    res.json(await options.support.listSessions(actor, { cursor, limit }));
  });
  router.post('/v1/sessions', async (req, res) => {
    const actor = await credentials(req);
    const model = modelFrom(req.body);
    const sessionId = randomUUID();
    const handle = await open(sessionId, actor);
    try {
      const root = await handle.harness.root(handle.context, {
        agent: { model },
      });
      res.status(201).json({ sessionId, conversationId: root.id });
    } finally {
      await handle.release();
    }
  });
  router.get('/v1/sessions/:sessionId', async (req, res) => {
    await owned(req);
    res.json({ sessionId: req.params.sessionId });
  });
  router.post('/v1/sessions/:sessionId/conversations', async (req, res) => {
    const actor = await owned(req);
    const model = modelFrom(req.body);
    const handle = await open(req.params.sessionId, actor);
    try {
      const conversation = await handle.harness.createConversation(
        { ownership: { kind: 'ownerless' }, agent: { model } },
        handle.context,
      );
      res.status(201).json({ conversationId: conversation.id });
    } finally {
      await handle.release();
    }
  });
  router.get(
    '/v1/sessions/:sessionId/conversations/:conversationId',
    async (req, res) => {
      const actor = await owned(req);
      const id = conversationId(req.params.conversationId);
      const handle = await open(req.params.sessionId, actor);
      try {
        const conversation = await handle.harness.conversation(
          id,
          handle.context,
        );
        if (!conversation) throw new NotFoundError('Conversation not found');
        const page = await conversation.entries(
          {},
          100,
          undefined,
          handle.context,
        );
        const items = page.items.flatMap(entry =>
          (entry.model ?? []).flatMap(message => {
            if (message.role !== 'user' && message.role !== 'assistant')
              return [];
            const content =
              typeof message.content === 'string'
                ? message.content
                : message.content
                    .filter(block => block.type === 'text')
                    .map(block => block.text)
                    .join('');
            return [{ id: entry.id, role: message.role, content }];
          }),
        );
        res.json({
          conversationId: id,
          items,
          hasMore: page.next !== undefined,
        });
      } finally {
        await handle.release();
      }
    },
  );
  router.get('/v1/sessions/:sessionId/audit', async (req, res) => {
    const actor = await credentials(req);
    const cursor = req.query.cursor;
    if (
      cursor !== undefined &&
      (typeof cursor !== 'string' ||
        !/^(0|[1-9][0-9]*)$/.test(cursor) ||
        cursor.length > 19 ||
        (cursor.length === 19 && cursor > '9223372036854775807'))
    ) {
      throw new InputError('Invalid audit cursor');
    }
    try {
      res.json(
        await options.support.readAudit(actor, req.params.sessionId, {
          cursor,
        }),
      );
    } catch {
      throw new NotAllowedError('AI audit access denied');
    }
  });
  router.post(
    '/v1/sessions/:sessionId/conversations/:conversationId/messages',
    async (req, res) => {
      const actor = await owned(req);
      const { content } = req.body ?? {};
      if (
        typeof content !== 'string' ||
        !content.trim() ||
        content.length > 32768
      )
        throw new InputError('Expected content');
      const id = conversationId(req.params.conversationId);
      const handle = await open(req.params.sessionId, actor);
      try {
        const conversation = await handle.harness.conversation(
          id,
          handle.context,
        );
        if (!conversation) throw new NotFoundError('Conversation not found');
        const watch = await conversation.watch(handle.context);
        let disconnected = res.destroyed;
        res.once('close', () => {
          disconnected = true;
        });
        try {
          const submission = await conversation.submit(
            { type: 'input', content, whenBusy: 'reject' },
            handle.context,
          );
          if (!disconnected && !res.destroyed) {
            res.status(200).set({
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-Accel-Buffering': 'no',
            });
            res.flushHeaders();
          }
          // The owner this stream and every mirror is gated to: signals
          // delivery is filtered to the publisher's recipients, and the
          // notification goes to the same user.
          const ownerRef = (actor.principal as { userEntityRef?: string })
            .userEntityRef;
          const channel = `ai.session.${req.params.sessionId}.${req.params.conversationId}`;
          // No owner ref, no mirror: delivery is gated to the recipient,
          // so a signal we cannot address is a signal we do not send.
          const mirror = ownerRef
            ? (event: string, value: unknown) => {
                void options.signals
                  .publish({
                    recipients: { type: 'user', entityRef: ownerRef },
                    channel,
                    message: { event, data: value } as JsonObject,
                  })
                  .catch(error => {
                    options.logger.warn(
                      `AI session signal publish failed on ${channel}: ${error}`,
                    );
                  });
              }
            : undefined;
          // Mirror of the inline stream: the submitter's direct SSE is
          // unchanged; the same events also ride the signals channel for
          // the owner's other connections. Fire-and-forget — observation
          // can never break the dispatch it observes.
          const send = async (event: string, value: unknown) => {
            mirror?.(event, value);
            if (disconnected || res.destroyed || res.writableEnded) return;
            if (
              !res.write(`event: ${event}\ndata: ${JSON.stringify(value)}\n\n`)
            ) {
              await new Promise<void>(resolve => {
                const finish = () => {
                  res.off('drain', finish);
                  res.off('close', finish);
                  resolve();
                };
                res.once('drain', finish);
                res.once('close', finish);
              });
            }
          };
          await send('submission', { id: submission.id });
          watch.start(async call => {
            if (call.kind !== 'value') return;
            const live = call.value.docs['pi.live'] as
              | {
                  run?: { inputs?: number[] };
                  generation?: { message?: { content?: unknown } };
                }
              | undefined;
            if (!live?.run?.inputs?.includes(submission.id)) return;
            const blocks = live?.generation?.message?.content;
            if (!Array.isArray(blocks)) return;
            const text = blocks
              .filter(
                block =>
                  block?.type === 'text' && typeof block.text === 'string',
              )
              .map(block => block.text)
              .join('');
            await send('partial', { text });
          });
          const settled = await submission.wait(handle.context);
          if ((disconnected || res.destroyed) && ownerRef) {
            // The stream is gone and the settlement arrived after it: the
            // owner gets the platform nudge instead. A client that was
            // still streaming received `settled` inline — no duplicate.
            void options.notifications
              .send({
                recipients: { type: 'entity', entityRef: ownerRef },
                payload: {
                  title: 'Your AI submission has finished',
                  description: `The submission settled with status '${settled.status}'.`,
                  severity: 'normal',
                  topic: 'ai',
                  link: `/ai/sessions/${req.params.sessionId}`,
                },
              })
              .catch(error => {
                options.logger.warn(
                  `AI settlement notification failed for ${ownerRef}: ${error}`,
                );
              });
          }
          if (settled.status === 'done' && settled.answer !== undefined) {
            const page = await conversation.entries(
              { minEntryId: settled.answer, maxEntryId: settled.answer },
              1,
              undefined,
              handle.context,
            );
            const text = (page.items[0]?.model ?? [])
              .filter(message => message.role === 'assistant')
              .flatMap(message => message.content)
              .filter(block => block.type === 'text')
              .map(block => block.text)
              .join('');
            await send('answer', { text });
          }
          await send('settled', { status: settled.status });
          if (!disconnected) res.end();
        } finally {
          await watch.stop();
        }
      } finally {
        await handle.release();
      }
    },
  );
  return router;
}
