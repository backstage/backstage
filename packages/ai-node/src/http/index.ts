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

import type { BasicPermission } from '@backstage/plugin-permission-common';
import type {
  AuthService,
  BackstageCredentials,
  DatabaseService,
  PermissionsRegistryService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import {
  AI_INSTALLATION_CONFIG_PATH,
  parseAiInstallationConfig,
} from '../config-extension';
import type { AuditPage } from '../journal/types';
import { createWiredAttemptJournal } from '../journal/wired';
import { listUserSessions, readSessionOrigin } from '../ownership/recovery';
import {
  createModelAccess,
  type ModelDescriptor,
} from '../permissions/modelAccess';
import {
  aiAuditReadPermission,
  aiSessionUsePermission as fixedSessionUsePermission,
} from '@backstage/plugin-ai-common';

/** Permission required for every AI HTTP operation. @alpha */
export const aiSessionUsePermission: BasicPermission =
  fixedSessionUsePermission;

/** Dependencies for a plugin-scoped, read-only HTTP adapter. @alpha */
export type AiHttpSupportOptions = {
  database: DatabaseService;
  auth: AuthService;
  permissions: PermissionsService;
  permissionsRegistry: PermissionsRegistryService;
  pluginMetadata: PluginMetadataService;
  config: Config;
};

/** Authorized read operations for the consuming plugin's managed AI sessions. @alpha */
export interface AiHttpSupport {
  authorize(credentials: BackstageCredentials): Promise<void>;
  listModels(
    credentials: BackstageCredentials,
  ): Promise<readonly ModelDescriptor[]>;
  listSessions(
    credentials: BackstageCredentials,
    options?: { cursor?: string; limit?: number },
  ): Promise<{ items: string[]; nextCursor?: string }>;
  assertSessionOwner(
    credentials: BackstageCredentials,
    sessionId: string,
  ): Promise<void>;
  readAudit(
    credentials: BackstageCredentials,
    sessionId: string,
    options?: { cursor?: string; limit?: number },
  ): Promise<AuditPage>;
}

/**
 * Creates read-only support for a plugin's browser routes. Session and audit
 * reads are scoped to the plugin identity; audit reads additionally require
 * ownership and `ai.audit.read`. The returned facade exposes no credentials.
 *
 * @alpha
 */
export async function createAiHttpSupport(
  options: AiHttpSupportOptions,
): Promise<AiHttpSupport> {
  const { auth, permissions, permissionsRegistry, pluginMetadata } = options;
  const db = await options.database.getClient();
  const pluginId = pluginMetadata.getId();
  const models = parseAiInstallationConfig({
    root: options.config,
    path: AI_INSTALLATION_CONFIG_PATH,
  }).models;
  const modelAccess = createModelAccess({
    // The full canonical descriptors, so discovery reports the catalog
    // fields consumers choose models by, not just the identity pair.
    models: models.map(model => ({
      provider: model.provider,
      modelId: model.id,
      api: model.api,
      type: model.type,
      // Image models carry no context window; presence follows the
      // catalog entry's own shape.
      ...('contextWindow' in model
        ? { contextWindow: model.contextWindow }
        : {}),
      ...('maxTokens' in model ? { maxTokens: model.maxTokens } : {}),
    })),
    authorizer: permissions,
  });
  permissionsRegistry.addPermissions([
    aiSessionUsePermission,
    aiAuditReadPermission,
  ]);
  // The same wired journal the managed integration consumes: ownership
  // through the recovery sessions, audit reads through the separate
  // ai.audit.read permission.
  const journal = createWiredAttemptJournal({ db, permissions });
  async function user(credentials: BackstageCredentials): Promise<string> {
    if (!auth.isPrincipal(credentials, 'user'))
      throw new Error('AI routes require user credentials');
    const decisions = await permissions.authorize(
      [{ permission: aiSessionUsePermission }],
      { credentials },
    );
    if (decisions.length !== 1 || decisions[0]?.result !== 'ALLOW')
      throw new Error('AI session access denied');
    return credentials.principal.userEntityRef;
  }
  return {
    async authorize(credentials) {
      await user(credentials);
    },
    async listModels(credentials) {
      await user(credentials);
      return modelAccess.listModels(credentials);
    },
    async listSessions(credentials, query) {
      const userId = await user(credentials);
      return listUserSessions(db, {
        pluginId,
        userId,
        cursor: query?.cursor,
        limit: query?.limit ?? 100,
      });
    },
    async assertSessionOwner(credentials, sessionId) {
      const userId = await user(credentials);
      const origin = await readSessionOrigin(db, { pluginId, sessionId });
      if (origin?.kind !== 'user' || origin.userId !== userId)
        throw new Error('AI session not found');
    },
    async readAudit(credentials, sessionId, query) {
      await user(credentials);
      return journal.read(credentials, {
        pluginId,
        sessionId,
        cursor: query?.cursor,
        limit: query?.limit,
      });
    },
  };
}
