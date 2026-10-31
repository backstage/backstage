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

import express from 'express';
import fs from 'fs-extra';
import request from 'supertest';
import { AppConfig, ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  createMockDirectory,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import { createRouter } from './router';

const mockDir = createMockDirectory();

global.__non_webpack_require__ = {
  /* eslint-disable-next-line no-restricted-syntax */
  resolve: () => mockDir.resolve('package.json'),
};

const extensions = [
  'sign-in-page:app',
  { 'api:auth': { config: { provider: 'github' } } },
  'sign-in-page:other',
  { 'page:catalog': { disabled: true, config: { title: 'Internal catalog' } } },
];

const frontendData = {
  app: {
    title: 'Backstage',
    baseUrl: 'https://example.com/backstage/',
    extensions,
  },
  backend: { baseUrl: 'https://api.example.com' },
};

function readInjectedConfigs(html: string): AppConfig[] {
  const json = html.match(
    /<script type="backstage.io\/config">([\s\S]*?)<\/script>/,
  )?.[1];
  expect(json).toBeDefined();
  return JSON.parse(json!);
}

function readInjectedConfig(html: string) {
  return ConfigReader.fromConfigs(readInjectedConfigs(html)).get();
}

describe('public entry point config', () => {
  beforeEach(() => {
    const template = `<html><head><title><%= config.getString('app.title') %></title></head><body><script src="<%= publicPath %>/static/main.js"></script></body></html>`;
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'test-app' }),
      'dist/static/main.js': 'main bundle',
      'dist/public/static/main.js': 'public bundle',
      'dist/index.html.tmpl': template,
      'dist/public/index.html.tmpl': template,
      'dist/public/index.html':
        '<html><head></head><body>disallowed-build-config</body></html>',
      'dist/.config-schema.json': JSON.stringify({
        backstageConfigSchemaVersion: 1,
        schemas: [
          {
            path: '/mock',
            value: {
              type: 'object',
              properties: {
                app: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', visibility: 'frontend' },
                    baseUrl: { type: 'string', visibility: 'frontend' },
                    extensions: {
                      type: 'array',
                      deepVisibility: 'frontend',
                      items: {
                        anyOf: [{ type: 'string' }, { type: 'object' }],
                      },
                    },
                    extension: {
                      type: 'object',
                      deepVisibility: 'frontend',
                    },
                    privateValue: { type: 'string', visibility: 'backend' },
                    secret: { type: 'string', visibility: 'secret' },
                  },
                },
                backend: {
                  type: 'object',
                  properties: {
                    baseUrl: { type: 'string', visibility: 'frontend' },
                    secret: { type: 'string', visibility: 'secret' },
                  },
                },
              },
            },
          },
        ],
      }),
    });
  });

  afterEach(() => {
    mockDir.clear();
    jest.restoreAllMocks();
  });

  async function createApp(
    publicConfig?: {
      allowedConfig?: string[];
      allowedExtensions?: string[];
    },
    options?: {
      disablePublicEntryPoint?: boolean;
      disableConfigInjection?: boolean;
      extension?: JsonObject;
    },
  ) {
    const data = {
      app: {
        ...frontendData.app,
        disableStaticFallbackCache: true,
        ...options,
        privateValue: 'backend-only',
        secret: 'app-secret',
        ...(publicConfig === undefined ? {} : { publicConfig }),
      },
      backend: { ...frontendData.backend, secret: 'backend-secret' },
    };
    const config = mockServices.rootConfig({ data });
    const original = config.get();
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      database: mockServices.database.mock(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth({
        defaultCredentials: mockCredentials.none(),
      }),
      config,
      appPackageName: 'test-app',
    });
    expect(config.get()).toEqual(original);
    return express().use('/backstage', router);
  }

  it('preserves all frontend config when the block is absent', async () => {
    const app = await createApp();
    const publicResponse = await request(app).get('/backstage/');
    const mainResponse = await request(app)
      .get('/backstage/')
      .set('Cookie', mockCredentials.limitedUser.cookie());
    expect(publicResponse.status).toBe(200);
    expect(mainResponse.status).toBe(200);
    expect(readInjectedConfig(publicResponse.text)).toEqual(frontendData);
    expect(readInjectedConfig(mainResponse.text)).toEqual(frontendData);
  });

  it.each(['disabled', 'absent'])(
    'keeps full config when the public entry point is %s',
    async state => {
      if (state === 'absent') {
        await fs.remove(mockDir.resolve('dist/public'));
      }
      const app = await createApp(
        {},
        { disablePublicEntryPoint: state === 'disabled' },
      );
      const response = await request(app).get('/backstage/');
      expect(response.status).toBe(200);
      expect(readInjectedConfig(response.text)).toEqual(frontendData);
    },
  );

  it('leaves build-time config untouched when config injection is disabled', async () => {
    const app = await createApp({}, { disableConfigInjection: true });
    const response = await request(app).get('/backstage/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('disallowed-build-config');
    expect(response.text).not.toContain('backstage.io/config');
  });

  it('selects visible keys and exact extension IDs without changing authenticated config', async () => {
    const app = await createApp({
      allowedConfig: ['app.title', 'backend', 'app.secret', 'app.privateValue'],
      allowedExtensions: ['sign-in-page:app', 'api:auth'],
    });
    const publicResponse = await request(app).get('/backstage/');
    expect(publicResponse.status).toBe(200);
    expect(readInjectedConfig(publicResponse.text)).toEqual({
      app: { title: 'Backstage', extensions: extensions.slice(0, 2) },
      backend: frontendData.backend,
    });
    expect(publicResponse.text).toContain('<title>Backstage</title>');
    expect(publicResponse.text).toContain('src="/backstage/static/main.js"');
    const asset = await request(app).get('/backstage/static/main.js');
    expect(asset.status).toBe(200);
    expect(asset.text).toBe('public bundle');

    const mainResponse = await request(app)
      .get('/backstage/')
      .set('Cookie', mockCredentials.limitedUser.cookie());
    expect(mainResponse.status).toBe(200);
    expect(readInjectedConfig(mainResponse.text)).toEqual(frontendData);
    const signInResponse = await request(app)
      .post('/backstage/')
      .type('form')
      .send({ type: 'sign-in', token: mockCredentials.user.token() });
    expect(signInResponse.status).toBe(200);
    expect(readInjectedConfig(signInResponse.text)).toEqual(frontendData);
  });

  it('filters public JavaScript injection while preserving the main bundle config', async () => {
    await Promise.all([
      fs.remove(mockDir.resolve('dist/index.html.tmpl')),
      fs.remove(mockDir.resolve('dist/public/index.html.tmpl')),
      fs.writeFile(
        mockDir.resolve('dist/static/main.js'),
        '"__APP_INJECTED_RUNTIME_CONFIG__"',
      ),
      fs.writeFile(
        mockDir.resolve('dist/public/static/main.js'),
        '"__APP_INJECTED_RUNTIME_CONFIG__"',
      ),
    ]);
    const app = await createApp({ allowedExtensions: ['api:auth'] });
    const publicResponse = await request(app).get('/backstage/static/main.js');
    const mainResponse = await request(app)
      .get('/backstage/static/main.js')
      .set('Cookie', mockCredentials.limitedUser.cookie());
    for (const [response, expected] of [
      [publicResponse, { app: { extensions: [extensions[1]] } }],
      [mainResponse, frontendData],
    ] as const) {
      expect(response.status).toBe(200);
      const serialized = response.text.match(
        /\/\*__APP_INJECTED_CONFIG_MARKER__\*\/(.*?)\/\*__INJECTED_END__\*\//,
      )?.[1];
      expect(serialized).toBeDefined();
      const configs = JSON.parse(JSON.parse(serialized!)) as AppConfig[];
      expect(ConfigReader.fromConfigs(configs).get()).toEqual(expected);
    }
  });

  it.each([false, true])(
    'uses injected HTML for index aliases with public filtering enabled: %s',
    async restricted => {
      await fs.link(
        mockDir.resolve('dist/public/index.html'),
        mockDir.resolve('dist/public/index-alias.html'),
      );
      const app = await createApp(
        restricted ? { allowedConfig: ['app.title'] } : undefined,
      );
      for (const path of [
        '/index.html',
        '/%69ndex.html',
        '/index%2ehtml',
        '/index-alias.html',
        '//index.html',
        '/%2e/index.html',
        '/INDEX.HTML',
        '//',
      ]) {
        const response = await request(app).get(`/backstage${path}`);
        expect(response.status).toBe(200);
        expect(response.text).not.toContain('disallowed-build-config');
        expect(readInjectedConfig(response.text)).toEqual(
          restricted
            ? {
                app: { title: 'Backstage', extensions: [] },
              }
            : frontendData,
        );
      }
    },
  );

  it('filters environment config with the same rules and preserves layer precedence', async () => {
    const envExtensions = [
      { 'api:auth': { config: { provider: 'gitlab' } } },
      'page:private',
    ];
    jest.replaceProperty(process, 'env', {
      ...process.env,
      APP_CONFIG_app_title: 'Environment title',
      APP_CONFIG_app_baseUrl: 'https://example.com/env-path',
      APP_CONFIG_app_extensions: JSON.stringify(envExtensions),
    });
    const app = await createApp({
      allowedConfig: ['app'],
      allowedExtensions: ['api:auth'],
    });
    const publicResponse = await request(app).get('/backstage/');
    expect(publicResponse.status).toBe(200);
    expect(readInjectedConfigs(publicResponse.text)[0].data).toEqual({
      app: {
        title: 'Environment title',
        baseUrl: 'https://example.com/env-path',
        extensions: [envExtensions[0]],
      },
    });
    expect(publicResponse.text).toContain('src="/backstage/static/main.js"');
    expect(readInjectedConfig(publicResponse.text)).toEqual({
      app: { ...frontendData.app, extensions: [extensions[1]] },
    });
    const mainResponse = await request(app)
      .get('/backstage/')
      .set('Cookie', mockCredentials.limitedUser.cookie());
    expect(readInjectedConfig(mainResponse.text)).toEqual(frontendData);
    expect(readInjectedConfigs(mainResponse.text)[0].data).toEqual({
      app: {
        title: 'Environment title',
        baseUrl: 'https://example.com/env-path',
        extensions: envExtensions,
      },
    });
  });

  it.each([
    {},
    { allowedConfig: [], allowedExtensions: [] },
    { allowedExtensions: ['api:auth'] },
    { allowedExtensions: ['api:auth.config'] },
    { allowedConfig: ['app.extensions'] },
    { allowedConfig: ['app.extension'] },
    {
      allowedConfig: [
        'app.extension.api:auth',
        'app.extension.api:auth.config',
      ],
    },
    { allowedConfig: ['app["extension"]["api:auth"]'] },
    { allowedConfig: ['app.extensions.0', 'app.extensions.1.api:auth'] },
    { allowedConfig: ['app.extensions[0]', 'app["extensions"]'] },
    { allowedConfig: ['app'], allowedExtensions: [] },
    {
      allowedConfig: ['app', 'app.extensions', 'app.extensions.0'],
      allowedExtensions: ['api:auth'],
    },
  ])(
    'restricts extensions independently of key paths: %j',
    async publicConfig => {
      const extension = {
        'api:auth': { config: { provider: 'github' } },
        'api:auth.extra': { config: { title: 'Not an exact match' } },
        'page:catalog': {
          disabled: false,
          config: { title: 'Internal catalog' },
        },
      };
      const app = await createApp(publicConfig, { extension });
      const response = await request(app).get('/backstage/');
      expect(response.status).toBe(200);
      const includesApp = publicConfig.allowedConfig?.includes('app');
      expect(readInjectedConfig(response.text)).toEqual({
        app: {
          ...(includesApp
            ? { title: 'Backstage', baseUrl: frontendData.app.baseUrl }
            : {}),
          extension: publicConfig.allowedExtensions?.includes('api:auth')
            ? { 'api:auth': extension['api:auth'] }
            : {},
          extensions: publicConfig.allowedExtensions?.includes('api:auth')
            ? [extensions[1]]
            : [],
        },
      });
      expect(response.text).toContain('src="/backstage/static/main.js"');
      expect(response.text).toContain('<title>Backstage</title>');
      const mainResponse = await request(app)
        .get('/backstage/')
        .set('Cookie', mockCredentials.limitedUser.cookie());
      expect(readInjectedConfig(mainResponse.text)).toEqual({
        ...frontendData,
        app: { ...frontendData.app, extension },
      });
    },
  );
});
