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
  AuditorService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { InputError, NotAllowedError } from '@backstage/errors';
import {
  RecordUsageEventsRequest,
  UsageAnalyticsEventInput,
  UsagePresenceHeartbeatRequest,
  UsageTimeseriesInterval,
  usageAnalyticsReadAggregatesPermission,
  usageAnalyticsReadDetailsPermission,
} from '@backstage/plugin-usage-analytics-common';
import {
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';
import express from 'express';
import Router from 'express-promise-router';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { z } from 'zod/v3';
import { AnalyticsService } from './AnalyticsService';
import { createCsvExport, ExportDataset } from './CsvExport';
import { DatabaseAnalyticsStore } from './DatabaseAnalyticsStore';
import { ExportActivityRow, ExportPageRow, ReportQuery } from './types';

type RouterExportSource<T> = AsyncIterable<T> & {
  destroy?(error?: Error): void;
};

type RouterStore = Pick<
  DatabaseAnalyticsStore,
  | 'getOverview'
  | 'getTimeseries'
  | 'getPages'
  | 'getPlugins'
  | 'getUsers'
  | 'getActivity'
  | 'getSessions'
  | 'getEventTypes'
  | 'getPresenceSummary'
  | 'getOnlineUsers'
> & {
  exportActivity(query: ReportQuery): RouterExportSource<ExportActivityRow>;
  exportPages(query: ReportQuery): RouterExportSource<ExportPageRow>;
};

const eventSchema: z.ZodType<UsageAnalyticsEventInput> = z.object({
  eventId: z.string().uuid(),
  occurredAt: z.string().max(64),
  action: z.string().min(1).max(128),
  subject: z.string().max(2048).optional(),
  value: z.number().finite().optional(),
  pluginId: z.string().max(128).optional(),
  extensionId: z.string().max(128).optional(),
  currentPath: z.string().min(1).max(2048),
  previousPath: z.string().max(2048).optional(),
});

const eventsRequestSchema: z.ZodType<RecordUsageEventsRequest> = z.object({
  sessionId: z.string().uuid(),
  events: z.array(eventSchema),
});

const heartbeatSchema: z.ZodType<UsagePresenceHeartbeatRequest> = z.object({
  sessionId: z.string().uuid(),
  currentPath: z.string().min(1).max(2048),
});

const exportFiltersSchema = z
  .object({
    from: z.string().max(64).optional(),
    to: z.string().max(64).optional(),
    userEntityRef: z.string().min(1).max(512).optional(),
    path: z.string().min(1).max(2048).optional(),
    pluginId: z.string().min(1).max(128).optional(),
  })
  .strict();

const exportRequestSchema = z.discriminatedUnion('dataset', [
  exportFiltersSchema.extend({
    dataset: z.literal('activity'),
    action: z.string().min(1).max(128).optional(),
  }),
  exportFiltersSchema.extend({
    dataset: z.literal('pages'),
    action: z.literal('navigate').optional(),
  }),
]);

const orderFields = {
  pages: [
    'path',
    'pageViews',
    'uniqueUsers',
    'estimatedDurationSeconds',
    'lastViewedAt',
  ],
  plugins: ['pluginId', 'events', 'uniqueUsers', 'lastUsedAt'],
  users: ['userEntityRef', 'eventCount', 'sessionCount', 'lastSeenAt'],
  activity: ['occurredAt', 'action', 'currentPath', 'pluginId'],
  sessions: ['sessionId', 'userEntityRef', 'lastSeenAt'],
  onlineUsers: [
    'userEntityRef',
    'activeSessionCount',
    'currentPath',
    'lastSeenAt',
  ],
} as const;

type ExportFailure =
  | 'export-busy'
  | 'export-cancelled'
  | 'export-denied'
  | 'export-failed'
  | 'export-timeout';

class ExportLifecycleError extends Error {
  constructor(readonly reason: ExportFailure) {
    super(reason);
  }
}

export function createRouter(options: {
  auditor: AuditorService;
  httpAuth: HttpAuthService;
  logger: LoggerService;
  permissions: PermissionsService;
  service: AnalyticsService;
  store: RouterStore;
}): express.Router {
  const { auditor, httpAuth, logger, permissions, service, store } = options;
  const router = Router();
  let activeExports = 0;
  router.use(express.json({ limit: '1mb' }));

  const authorize = async (
    req: express.Request,
    permission: BasicPermission,
  ) => {
    const credentials = await httpAuth.credentials(req);
    const [decision] = await permissions.authorize([{ permission }], {
      credentials,
    });
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Permission denied');
    }
  };
  const authorizeReport = (req: express.Request) =>
    authorize(
      req,
      query(req, 'userEntityRef')
        ? usageAnalyticsReadDetailsPermission
        : usageAnalyticsReadAggregatesPermission,
    );

  router.post('/v1/events', async (req, res) => {
    const parsed = eventsRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    await service.recordEvents(
      credentials.principal.userEntityRef,
      parsed.data,
    );
    res.status(204).end();
  });

  router.post('/v1/presence/heartbeat', async (req, res) => {
    const parsed = heartbeatSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    await service.updatePresence(
      credentials.principal.userEntityRef,
      parsed.data,
    );
    res.status(204).end();
  });

  router.get('/v1/overview', async (req, res) => {
    await authorizeReport(req);
    res.json(await store.getOverview(reportQuery(req, service)));
  });

  router.get('/v1/timeseries', async (req, res) => {
    await authorizeReport(req);
    const interval = query(req, 'interval') ?? 'day';
    if (!['hour', 'day', 'week'].includes(interval)) {
      throw new InputError('interval must be hour, day, or week');
    }
    res.json(
      await store.getTimeseries(
        reportQuery(req, service),
        interval as UsageTimeseriesInterval,
      ),
    );
  });

  router.get('/v1/pages', async (req, res) => {
    await authorizeReport(req);
    res.json(
      await store.getPages(reportQuery(req, service), paging(req, service)),
    );
  });

  router.get('/v1/plugins', async (req, res) => {
    await authorizeReport(req);
    res.json(
      await store.getPlugins(
        reportQuery(req, service),
        paging(req, service, orderFields.plugins),
      ),
    );
  });

  router.get('/v1/users', async (req, res) => {
    await authorize(req, usageAnalyticsReadDetailsPermission);
    res.json(
      await store.getUsers(
        reportQuery(req, service),
        paging(req, service, orderFields.users),
      ),
    );
  });

  router.get('/v1/activity', async (req, res) => {
    await authorize(req, usageAnalyticsReadDetailsPermission);
    const range = reportQuery(req, service);
    res.json(
      await store.getActivity({
        ...range,
        ...paging(req, service, orderFields.activity),
        sessionId: query(req, 'sessionId'),
      }),
    );
  });

  router.get('/v1/sessions', async (req, res) => {
    await authorize(req, usageAnalyticsReadDetailsPermission);
    res.json(
      await store.getSessions(
        reportQuery(req, service),
        paging(req, service, orderFields.sessions),
      ),
    );
  });

  router.get('/v1/event-types', async (req, res) => {
    await authorizeReport(req);
    res.json(await store.getEventTypes(reportQuery(req, service)));
  });

  router.get('/v1/presence/summary', async (req, res) => {
    await authorize(req, usageAnalyticsReadAggregatesPermission);
    res.json(await store.getPresenceSummary(service.onlineAfter()));
  });

  router.get('/v1/presence/online', async (req, res) => {
    await authorize(req, usageAnalyticsReadDetailsPermission);
    res.json(
      await store.getOnlineUsers(
        service.onlineAfter(),
        paging(req, service, orderFields.onlineUsers),
      ),
    );
  });

  router.post('/v1/export', async (req, res) => {
    const parsed = exportRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const { dataset, from, to, ...filters } = parsed.data;
    const range = service.parseRange(from, to);
    const appliedFilters = definedFilters(filters);
    const exportQuery: ReportQuery = {
      ...range,
      ...appliedFilters,
    };
    const auditMeta = {
      dataset,
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      filters: Object.keys(appliedFilters).sort(),
    };
    const auditEvent = await auditor.createEvent({
      eventId: 'export',
      request: req,
      meta: auditMeta,
    });

    let acquiredSlot = false;
    let completed = false;
    let rowCount = 0;
    let timeout: NodeJS.Timeout | undefined;
    let controller: AbortController | undefined;
    let iterator: AsyncIterator<ExportActivityRow | ExportPageRow> | undefined;
    let source:
      | RouterExportSource<ExportActivityRow | ExportPageRow>
      | undefined;
    let csv: Readable | undefined;
    let terminalError: Error | undefined;
    let thrown: unknown;

    const onFinish = () => {
      completed = true;
    };
    const abort = (reason: ExportLifecycleError) => {
      if (!completed && controller && !controller.signal.aborted) {
        source?.destroy?.(reason);
        controller.abort(reason);
      }
    };
    const onAborted = () => abort(new ExportLifecycleError('export-cancelled'));
    const onClose = () => {
      if (!completed) {
        abort(new ExportLifecycleError('export-cancelled'));
      }
    };

    try {
      await authorize(req, exportPermission(dataset, filters.userEntityRef));

      if (activeExports >= service.exportSettings.maxConcurrent) {
        terminalError = new ExportLifecycleError('export-busy');
        res
          .status(429)
          .json({ error: { name: 'Error', message: 'Too many exports' } });
        return;
      }
      activeExports += 1;
      acquiredSlot = true;

      controller = new AbortController();
      req.on('aborted', onAborted);
      res.on('finish', onFinish);
      res.on('close', onClose);
      if (req.aborted || res.destroyed) {
        abort(new ExportLifecycleError('export-cancelled'));
      }
      timeout = setTimeout(
        () => abort(new ExportLifecycleError('export-timeout')),
        service.exportSettings.timeoutSeconds * 1_000,
      );

      source = await raceWithAbort(
        Promise.resolve(
          dataset === 'activity'
            ? store.exportActivity(exportQuery)
            : store.exportPages(exportQuery),
        ),
        controller.signal,
      );
      iterator = source[Symbol.asyncIterator]();
      const first = await raceWithAbort(iterator.next(), controller.signal);

      const countedRows = {
        async *[Symbol.asyncIterator]() {
          if (!first.done) {
            rowCount += 1;
            yield first.value;
          }
          while (true) {
            const next = await iterator!.next();
            if (next.done) {
              return;
            }
            rowCount += 1;
            yield next.value;
          }
        },
      };

      res.status(200);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${exportFilename(dataset, range)}"`,
      );
      csv =
        dataset === 'activity'
          ? createCsvExport('activity', countedRows)
          : createCsvExport('pages', countedRows);
      await pipeline(csv, res, { signal: controller.signal });
      completed = true;
    } catch (error) {
      const lifecycleError = controller?.signal.aborted
        ? controller.signal.reason
        : error;
      terminalError = controlledAuditError(lifecycleError);

      if (terminalError.message === 'export-timeout' && !res.headersSent) {
        res.status(504).json({
          error: { name: 'Error', message: 'Export timed out' },
        });
      } else if (
        terminalError.message === 'export-cancelled' ||
        res.headersSent
      ) {
        res.destroy();
      } else {
        thrown = error;
      }
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
      req.off('aborted', onAborted);
      res.off('finish', onFinish);
      res.off('close', onClose);
      if (csv) {
        csv.destroy();
      }
      source?.destroy?.();
      try {
        await iterator?.return?.();
      } catch (error) {
        terminalError ??= controlledAuditError(error);
      }
      if (acquiredSlot) {
        activeExports -= 1;
      }

      const terminalMeta = {
        ...auditMeta,
        outcome: terminalError ? 'failure' : 'success',
        rows: rowCount,
      };
      void Promise.resolve()
        .then(() =>
          terminalError
            ? auditEvent.fail({ meta: terminalMeta, error: terminalError })
            : auditEvent.success({ meta: terminalMeta }),
        )
        .catch(() => {
          logger.error(
            'Failed to persist usage analytics export audit outcome',
          );
        });
    }

    if (thrown) {
      throw thrown;
    }
  });

  return router;
}

function exportPermission(
  dataset: ExportDataset,
  userEntityRef?: string,
): BasicPermission {
  return dataset === 'activity' || userEntityRef
    ? usageAnalyticsReadDetailsPermission
    : usageAnalyticsReadAggregatesPermission;
}

function definedFilters(
  filters: Omit<z.infer<typeof exportRequestSchema>, 'dataset' | 'from' | 'to'>,
): Partial<ReportQuery> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined),
  );
}

function exportFilename(
  dataset: ExportDataset,
  range: { from: Date; to: Date },
): string {
  return `usage-analytics-${dataset}-${range.from
    .toISOString()
    .slice(0, 10)}-${range.to.toISOString().slice(0, 10)}.csv`;
}

function controlledAuditError(error: unknown): Error {
  if (
    error instanceof ExportLifecycleError &&
    ['export-timeout', 'export-cancelled', 'export-busy'].includes(error.reason)
  ) {
    return error;
  }
  if (error instanceof NotAllowedError) {
    return new ExportLifecycleError('export-denied');
  }
  return new ExportLifecycleError('export-failed');
}

function raceWithAbort<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  if (signal.aborted) {
    return Promise.reject(signal.reason);
  }
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      value => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      error => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

function reportQuery(req: express.Request, service: AnalyticsService) {
  return {
    ...service.parseRange(query(req, 'from'), query(req, 'to')),
    userEntityRef: query(req, 'userEntityRef'),
    action: query(req, 'action'),
    path: query(req, 'path'),
    pluginId: query(req, 'pluginId'),
  };
}

function paging(
  req: express.Request,
  service: AnalyticsService,
  allowedOrderFields: readonly string[] = orderFields.pages,
) {
  return service.parsePaging(
    query(req, 'limit'),
    query(req, 'offset'),
    query(req, 'orderField'),
    query(req, 'orderDirection'),
    allowedOrderFields,
  );
}

function query(req: express.Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === 'string' ? value : undefined;
}
