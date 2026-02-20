/*
 * Copyright 2024 The Backstage Authors
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

import express, { Router, Request, Response, NextFunction } from 'express';
import request from 'supertest';

describe('Express error handler ordering', () => {
  it('should run error handlers after routes even when registered first', async () => {
    const app = express();
    const router = Router();

    const executionOrder: string[] = [];

    // Register error handler BEFORE routes
    router.use(
      (err: Error, _req: Request, _res: Response, next: NextFunction) => {
        executionOrder.push('error-handler');
        next(err);
      },
    );

    // Add routes AFTER error handler
    router.get('/success', (_req, res) => {
      executionOrder.push('success-route');
      res.json({ ok: true });
    });

    router.get('/error', (_req, _res) => {
      executionOrder.push('error-route');
      throw new Error('Test error');
    });

    // Final error handler to actually send response
    router.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        executionOrder.push('final-error-handler');
        res.status(500).json({ error: err.message });
      },
    );

    app.use(router);

    // Test success case
    executionOrder.length = 0;
    await request(app).get('/success').expect(200);

    expect(executionOrder).toEqual(['success-route']);

    // Test error case
    executionOrder.length = 0;
    await request(app).get('/error').expect(500);

    // Error handler runs AFTER the route
    expect(executionOrder).toEqual([
      'error-route',
      'error-handler',
      'final-error-handler',
    ]);
  });

  it('should allow pre-route middleware to set up context for error handlers', async () => {
    const app = express();
    const router = Router();

    const contexts: any[] = [];

    // Pre-route middleware
    router.use((req, _res, next) => {
      (req as any).context = { id: Math.random(), completed: false };
      contexts.push((req as any).context);
      next();
    });

    // Error handler registered BEFORE routes
    router.use(
      (err: Error, req: Request, _res: Response, next: NextFunction) => {
        const context = (req as any).context;
        if (context) {
          context.error = err.message;
          context.completed = true;
        }
        next(err);
      },
    );

    // Routes added AFTER error handler
    router.get('/fail', (_req, _res) => {
      throw new Error('Route failed');
    });

    // Final error handler
    router.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).json({ error: err.message });
      },
    );

    app.use(router);

    await request(app).get('/fail').expect(500);

    // Context was set up before route, and error handler had access to it
    expect(contexts).toHaveLength(1);
    expect(contexts[0]).toMatchObject({
      completed: true,
      error: 'Route failed',
    });
  });

  it('should demonstrate the pattern works for audit tracking', async () => {
    const app = express();
    const router = Router();

    const auditEvents: Array<{ status: 'success' | 'failure'; path: string }> =
      [];

    // Audit setup middleware (before routes)
    router.use((req, res, next) => {
      const event = { status: 'success' as const, path: req.path };
      (req as any).auditEvent = event;

      // Intercept res.json to mark success
      const originalJson = res.json.bind(res);
      res.json = body => {
        auditEvents.push(event);
        return originalJson(body);
      };

      next();
    });

    // Error handler registered BEFORE routes
    router.use(
      (err: Error, req: Request, _res: Response, next: NextFunction) => {
        const event = (req as any).auditEvent;
        if (event) {
          event.status = 'failure';
          auditEvents.push(event);
        }
        next(err);
      },
    );

    // Routes added AFTER middleware
    router.get('/success', (_req, res) => {
      res.json({ ok: true });
    });

    router.get('/error', (_req, _res) => {
      throw new Error('Failed');
    });

    // Final error handler
    router.use(
      (_err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).json({ error: 'Internal error' });
      },
    );

    app.use(router);

    // Test success path
    await request(app).get('/success').expect(200);

    // Test error path
    await request(app).get('/error').expect(500);

    // Both paths were audited correctly
    expect(auditEvents).toEqual([
      { status: 'success', path: '/success' },
      { status: 'failure', path: '/error' },
    ]);
  });

  it('should prove the pluginRoutes pattern works for post-route error handlers', async () => {
    const app = express();
    const auditEvents: Array<{ status: string; path: string }> = [];

    // Simulate outer router with validation
    const outerRouter = Router();

    // Pre-route middleware
    outerRouter.use((req: Request, res: Response, next: NextFunction) => {
      const event = { status: 'success', path: req.path };
      (req as any).auditEvent = event;

      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode < 400) {
          auditEvents.push(event);
        }
        return originalJson(body);
      };

      next();
    });

    // Create inner router for plugin routes
    const pluginRoutes = Router();
    outerRouter.use(pluginRoutes);

    // Error handler added AFTER pluginRoutes mount
    outerRouter.use(
      (err: Error, req: Request, _res: Response, next: NextFunction) => {
        const event = (req as any).auditEvent;
        if (event) {
          event.status = 'failure';
          auditEvents.push(event);
        }
        next(err);
      },
    );

    // Final error handler
    outerRouter.use(
      (_err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).json({ error: 'Error' });
      },
    );

    // Routes added to pluginRoutes AFTER everything is set up
    pluginRoutes.get('/success', (_req: Request, res: Response) => {
      res.json({ ok: true });
    });

    pluginRoutes.get('/error', (_req: Request, _res: Response) => {
      throw new Error('Failed');
    });

    app.use(outerRouter);

    // Test success
    await request(app).get('/success').expect(200);

    // Test error - error handler should catch it!
    await request(app).get('/error').expect(500);

    // Both were audited correctly
    expect(auditEvents).toEqual([
      { status: 'success', path: '/success' },
      { status: 'failure', path: '/error' },
    ]);
  });
});
