#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/*
 * Copyright 2022 The Backstage Authors
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

const fetch = require('node-fetch');
const zlib = require('zlib');

// eslint-disable-next-line import/no-extraneous-dependencies
const libpub = require('libnpmpublish');
const concatStream = require('concat-stream');
const tar = require('tar-stream');

/*

This works around an incompatibility in node versioning policies between Backstage and
the openid-client package. This script downloads a target version of the openid-client
package and re-publishes it as a new version of the openid-client-any-engine package.

Usage: ./republish-openid-client.js <version>

Environment Variables:

NPM_TOKEN: The NPM auth token to use for publishing.
NPM_OTP: The NPM OTP (2FA one time password) to use for publishing.

*/

async function main(args) {
  const [version] = args;
  if (!version) {
    throw new Error('No version provided, Usage: $0 <version>');
  }

  const res = await fetch(
    `https://registry.npmjs.org/openid-client/-/openid-client-${version}.tgz`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch openid-client: ${res.status}`);
  }

  const { data, manifest } = await new Promise((resolve, reject) => {
    const extract = tar.extract();
    const pack = tar.pack();
    let foundPackageJson = undefined;

    res.body.pipe(zlib.createGunzip()).pipe(extract).on('error', reject);

    extract.on('entry', (header, stream, callback) => {
      if (header.name === 'package/package.json') {
        stream.pipe(
          concatStream(fileContents => {
            const packageJson = JSON.parse(fileContents.toString('utf8'));
            packageJson.name = 'openid-client-any-engine';
            packageJson.description =
              'Re-publish of openid-client that allows any Node.js version above 12.19.0';
            packageJson.engines.node = '>=12.19.0';

            foundPackageJson = packageJson;

            pack.entry(
              { name: 'package/package.json' },
              JSON.stringify(packageJson, null, 2),
            );
            callback();
          }),
        );
      } else {
        stream.pipe(pack.entry(header, callback));
      }
    });

    extract.on('finish', () => {
      pack.finalize();
    });

    pack
      .pipe(zlib.createGzip())
      .pipe(
        concatStream(d => {
          resolve({ data: d, manifest: foundPackageJson });
        }),
      )
      .on('error', reject);
  });

  await libpub.publish(manifest, data, {
    token: process.env.NPM_TOKEN,
    otp: process.env.NPM_OTP,
  });
}

main(process.argv.slice(2)).catch(error => {
  console.error(error);
  process.exit(1);
});
