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
 * Creates a Http server instance based on an Express application.
 *
 * @param app The Express application object
 * @param logger Optional Winston logger object
 * @returns A Http server instance
 *
 */
export function createHttpServer(
  app: express.Express,
  logger?: Logger,
): http.Server {
  logger?.info('Initializing http server');

  return http.createServer(app);
}

/**
 * Creates a Https server instance based on an Express application.
 *
 * @param app The Express application object
 * @param httpsSettings HttpsSettings for self-signed certificate generation
 * @param logger Optional Winston logger object
 * @returns A Https server instance
 *
 */
export function createHttpsServer(
  app: express.Express,
  httpsSettings: HttpsSettings,
  logger?: Logger,
): http.Server {
  logger?.info('Initializing https server');

  const credentials: { key: string; cert: string } = {
    key: '',
    cert: '',
  };

  const signingOptions: any = httpsSettings?.certificate;

  if (signingOptions?.attributes) {
    logger?.info('Generating self-signed certificate with attributes');
    if (signingOptions?.algorithm) {
      logger?.warn(
        'Certificate generation configuration with parameters in backend.https.certificate is deprecated, set backend.https = true instead',
      );
    }

    const certificateAttributes: Array<any> = Object.entries(
      signingOptions.attributes,
    ).map(([name, value]) => ({ name, value }));

    const signatures = require('selfsigned').generate(certificateAttributes, {
      algorithm: signingOptions?.algorithm || 'sha256',
      keySize: signingOptions?.size || 2048,
      days: signingOptions?.days || 30,
      extensions: [
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          timeStamping: true,
        },
        {
          name: 'subjectAltName',
          altNames: [
            {
              type: 2, // DNS
              value: 'localhost',
            },
            {
              type: 2,
              value: 'localhost.localdomain',
            },
            {
              type: 2,
              value: '[::1]',
            },
            {
              type: 7, // IP
              ip: '127.0.0.1',
            },
            {
              type: 7,
              ip: 'fe80::1',
            },
            ...(signingOptions.attributes.commonName
              ? [
                  {
                    type: 2, // DNS
                    value: signingOptions.attributes.commonName,
                  },
                ]
              : []),
          ],
        },
      ],
    });

    credentials.key = signatures.private;
    credentials.cert = signatures.cert;
  } else {
    logger?.info('Loading certificate from config');

    credentials.key = signingOptions?.key;
    credentials.cert = signingOptions?.cert;
  }

  if (credentials.key === '' || credentials.cert === '') {
    throw new Error('Invalid credentials');
  }

  return https.createServer(credentials, app) as http.Server;
}
