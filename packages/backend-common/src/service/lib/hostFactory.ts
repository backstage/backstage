/*
 * Copyright 2020 Spotify AB
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
import * as http from 'http';
import * as https from 'https';
import { Logger } from 'winston';
import { HttpsSettings } from './config';

/**
 * Reads some base options out of a config object.
 *
 * @param config The root of a backend config object
 * @returns A base options object
 *
 * @example
 * ```json
 * {
 *   baseUrl: "http://localhost:7000",
 *   listen: "0.0.0.0:7000"
 * }
 * ```
 */
export function createHttpServer(
  app: express.Express,
  logger: Logger,
): http.Server {
  logger.info('Initializing http server');

  return http.createServer(app);
}

export function createHttpsServer(
  app: express.Express,
  httpsSettings: HttpsSettings,
  logger: Logger,
): http.Server {
  logger.info('Initializing https server');

  const credentials: { key: string; cert: string } = {
    key: '',
    cert: '',
  };

  const signingOptions: any = httpsSettings?.certificate;

  if (signingOptions?.algorithm !== undefined) {
    logger.info('Generating self-signed certificate with attributes');

    const certificateAttributes: Array<any> = Object.entries(
      signingOptions.attributes,
    ).map(([name, value]) => ({ name, value }));

    // TODO: Create a type def for selfsigned.
    const signatures = require('selfsigned').generate(certificateAttributes, {
      algorithm: signingOptions?.algorithm,
      keySize: signingOptions?.size || 2048,
      days: signingOptions?.days || 30,
    });

    logger.info('Bootstrapping self-signed certificate');

    credentials.key = signatures.private;
    credentials.cert = signatures.cert;
  } else {
    logger.info('Bootstrapping cert from config');

    credentials.key = signingOptions?.key;
    credentials.cert = signingOptions?.cert;
  }

  if (credentials.key === '' || credentials.cert === '') {
    throw new Error('Invalid credentials');
  }

  return https.createServer(credentials, app) as http.Server;
}
