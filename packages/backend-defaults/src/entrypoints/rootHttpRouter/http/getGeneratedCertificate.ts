/*
 * Copyright 2020 The Backstage Authors
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
import { LoggerService } from '@backstage/backend-plugin-api';
import forge from 'node-forge';

const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;

const IP_HOSTNAME_REGEX = /:|^\d+\.\d+\.\d+\.\d+$/;

export async function getGeneratedCertificate(
  hostname: string,
  logger: LoggerService,
) {
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

  if (await fs.pathExists(certPath)) {
    try {
      const cert = await fs.readFile(certPath);

      const crt = forge.pki.certificateFromPem(cert.toString());
      const remainingMs = crt.validity.notAfter.getTime() - Date.now();
      if (remainingMs > FIVE_DAYS_IN_MS) {
        logger.info('Using existing self-signed certificate');
        return {
          key: cert,
          cert,
        };
      }
    } catch (error) {
      logger.warn(`Unable to use existing self-signed certificate, ${error}`);
    }
  }

  logger.info('Generating new self-signed certificate');
  const newCert = await generateCertificate(hostname);
  await fs.writeFile(certPath, newCert.cert + newCert.key, 'utf8');
  return newCert;
}

async function generateCertificate(hostname: string) {
  const attributes = [
    {
      name: 'commonName',
      value: 'dev-cert',
    },
  ];

  const sans = [
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
  ];

  // Add hostname from backend.baseUrl if it doesn't already exist in our list of SANs
  if (!sans.find(({ value, ip }) => value === hostname || ip === hostname)) {
    sans.push(
      IP_HOSTNAME_REGEX.test(hostname)
        ? {
            type: 7,
            ip: hostname,
          }
        : {
            type: 2,
            value: hostname,
          },
    );
  }

  const params = {
    algorithm: 'sha256',
    keySize: 2048,
    days: 30,
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
        altNames: sans,
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
