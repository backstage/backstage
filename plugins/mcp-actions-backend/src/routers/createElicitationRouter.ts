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
import PromiseRouter from 'express-promise-router';
import { json, Router } from 'express';
import { HttpAuthService, AuthService } from '@backstage/backend-plugin-api';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { SecretsStore } from '../services/SecretsStore';

function resolveUserEntityRef(
  auth: AuthService,
  credentials: import('@backstage/backend-plugin-api').BackstageCredentials,
): string {
  if (auth.isPrincipal(credentials, 'user')) {
    return credentials.principal.userEntityRef;
  }
  if (auth.isPrincipal(credentials, 'service')) {
    return `service:${credentials.principal.subject}`;
  }
  return 'unknown';
}

export function createElicitationRouter(opts: {
  secretsStore: SecretsStore;
  actions: ActionsService;
  httpAuth: HttpAuthService;
  auth: AuthService;
}): Router {
  const { secretsStore, actions, httpAuth, auth } = opts;
  const router = PromiseRouter();
  router.use(json({ limit: '64kb' }));

  router.get('/v1/elicitations/:elicitationId', async (req, res) => {
    const { elicitationId } = req.params;
    const pending = await secretsStore.getPending(elicitationId);
    if (!pending) {
      throw new NotFoundError('Elicitation not found or expired');
    }

    const credentials = await httpAuth.credentials(req);
    const userRef = resolveUserEntityRef(auth, credentials);
    if (userRef !== pending.userEntityRef) {
      throw new NotAllowedError('User mismatch');
    }

    const { actions: allActions } = await actions.list({ credentials });
    const action = allActions.find(a => a.id === pending.actionId);
    if (!action?.schema.secrets) {
      throw new NotFoundError('Action not found or has no secrets schema');
    }

    res.json({
      elicitationId,
      action: {
        id: action.id,
        title: action.title,
        description: action.description,
      },
      secretsSchema: action.schema.secrets,
      csrfToken: pending.csrfToken,
    });
  });

  router.post('/v1/elicitations/:elicitationId/secrets', async (req, res) => {
    const { elicitationId } = req.params;
    const pending = await secretsStore.getPending(elicitationId);
    if (!pending) {
      throw new NotFoundError('Elicitation not found or expired');
    }

    const credentials = await httpAuth.credentials(req);
    const userRef = resolveUserEntityRef(auth, credentials);
    if (userRef !== pending.userEntityRef) {
      throw new NotAllowedError('User mismatch');
    }

    const { csrfToken, secrets } = req.body;
    if (!csrfToken || csrfToken !== pending.csrfToken) {
      throw new InputError('Invalid CSRF token');
    }

    if (!secrets || typeof secrets !== 'object') {
      throw new InputError('Missing or invalid secrets');
    }

    await secretsStore.complete(elicitationId, secrets);
    res.json({ ok: true });
  });

  return router;
}
