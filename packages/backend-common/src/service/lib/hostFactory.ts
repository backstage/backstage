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

import fs from 'fs-extra';
import { resolve as resolvePath, dirname } from 'path';
import express from 'express';
import * as http from 'http';
import * as https from 'https';
import { Logger } from 'winston';
import { CertificateSigningOptions, HttpsSettings } from './config';

const ALMOST_MONTH_IN_MS = 25 * 24 * 60 * 60 * 1000;

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
export async function createHttpsServer(
  app: express.Express,
  httpsSettings: HttpsSettings,
  logger?: Logger,
): Promise<http.Server> {
  logger?.info('Initializing https server');

  let credentials: { key: string | Buffer; cert: string | Buffer };

  const signingOptions: any = httpsSettings?.certificate;

  // TODO(Rugvip): remove support for generated certificate params and make this a more straightforward check
  if (signingOptions?.attributes) {
    credentials = await getGeneratedCertificate(signingOptions, logger);
  } else {
    logger?.info('Loading certificate from config');

    credentials = {
      key: signingOptions?.key,
      cert: signingOptions?.cert,
    };
  }

  if (!credentials.key || !credentials.cert) {
    throw new Error('Invalid HTTPS credentials');
  }

  return https.createServer(credentials, app) as http.Server;
}

async function getGeneratedCertificate(
  options: CertificateSigningOptions,
  logger?: Logger,
) {
  if (options?.algorithm) {
    logger?.warn(
      'Certificate generation configuration with parameters in backend.https.certificate is deprecated, set backend.https = true instead',
    );
  }

  const hasModules = await fs.pathExists('node_modules');
  let certPath;
  if (hasModules) {
    certPath = resolvePath(
      'node_modules/.cache/backstage-backend/dev-cert.pem',
    );
    await fs.ensureDir(dirname(certPath));
  } else {
    certPath = resolvePath('.dev-cert.pem');
  }

  let cert = undefined;
  if (await fs.pathExists(certPath)) {
    const stat = await fs.stat(certPath);
    const ageMs = Date.now() - stat.ctimeMs;
    if (stat.isFile() && ageMs < ALMOST_MONTH_IN_MS) {
      cert = await fs.readFile(certPath);
    }
  }

  if (cert) {
    logger?.info('Using existing self-signed certificate');
    return {
      key: cert,
      cert: cert,
    };
  }

  logger?.info('Generating new self-signed certificate');
  const newCert = await createCertificate(options);
  await fs.writeFile(certPath, newCert.cert + newCert.key, 'utf8');
  return newCert;
}

async function createCertificate(options: CertificateSigningOptions) {
  const attributes: Array<any> = Object.entries(
    options.attributes,
  ).map(([name, value]) => ({ name, value }));

  const params = {
    algorithm: options?.algorithm || 'sha256',
    keySize: options?.size || 2048,
    days: options?.days || 30,
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
          ...(options.attributes.commonName
            ? [
                {
                  type: 2, // DNS
                  value: options.attributes.commonName,
                },
              ]
            : []),
        ],
      },
    ],
  };

  return new Promise<{ key: string; cert: string }>((resolve, reject) =>
    require('selfsigned').generate(
      attributes,
      params,
      (err: Error, bundle: { private: string; cert: string }) => {
        if (err) {
          reject(err);
        } else {
          resolve({ key: bundle.private, cert: bundle.cert });
        }
      },
    ),
  );
}
