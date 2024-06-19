/*
 * Copyright 2023 The Backstage Authors
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
import { StaticTokenIssuer } from './StaticTokenIssuer';
import { createLocalJWKSet, jwtVerify } from 'jose';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { StaticKeyStore } from './StaticKeyStore';
import { mockServices } from '@backstage/backend-test-utils';

const logger = mockServices.logger.mock();
const entityRef = stringifyEntityRef({
  kind: 'User',
  namespace: 'default',
  name: 'name',
});

describe('StaticTokenIssuer', () => {
  it('should issue valid tokens signed by the first listed key', async () => {
    const staticKeyStore = {
      listKeys: () => {
        return Promise.resolve({
          items: [
            {
              createdAt: new Date(),
              key: {
                kty: 'EC',
                x: 'vrJVK0vSV4LRwdUXA55pb3rruB92ZoUEY72HTvjIP9w',
                y: 'UmyzoVoTERJPOE9Kvdf5t797FquRMxyFsNc0R0IrCmc',
                crv: 'P-256',
                kid: '1',
                alg: 'ES256',
                use: 'sig',
              },
            },
            {
              createdAt: new Date(),
              key: {
                kty: 'EC',
                x: 'vrJVK0vSV4LRwdUXA55pb3rruB92ZoUEY72HTvjIP9w',
                y: 'UmyzoVoTERJPOE9Kvdf5t797FquRMxyFsNc0R0IrCmc',
                crv: 'P-256',
                kid: '2',
                alg: 'ES256',
                use: 'sig',
              },
            },
          ],
        });
      },
      getPrivateKey: (kid: string) => {
        expect(kid).toEqual('1');
        return {
          kty: 'EC',
          x: 'vrJVK0vSV4LRwdUXA55pb3rruB92ZoUEY72HTvjIP9w',
          y: 'UmyzoVoTERJPOE9Kvdf5t797FquRMxyFsNc0R0IrCmc',
          crv: 'P-256',
          d: 'R8Ja2ppMEgOm1KeYKpje00U1luybndt6yC263vcgeKo',
          kid: '1',
          alg: 'ES256',
        };
      },
    };

    const keyDurationSeconds = 86400;
    const options = {
      logger,
      issuer: 'my-issuer',
      sessionExpirationSeconds: keyDurationSeconds,
    };
    const issuer = new StaticTokenIssuer(
      options,
      staticKeyStore as unknown as StaticKeyStore,
    );
    const token = await issuer.issueToken({
      claims: {
        sub: entityRef,
        ent: [entityRef],
        'x-fancy-claim': 'my special claim',
        aud: 'this value will be overridden',
      },
    });

    const { keys } = await issuer.listPublicKeys();
    const keyStore = createLocalJWKSet({ keys: keys });
    const verifyResult = await jwtVerify(token, keyStore);
    expect(verifyResult.protectedHeader).toEqual({
      kid: '1',
      alg: 'ES256',
    });
    expect(verifyResult.payload).toEqual({
      iss: 'my-issuer',
      aud: 'backstage',
      sub: entityRef,
      ent: [entityRef],
      'x-fancy-claim': 'my special claim',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    expect(verifyResult.payload.exp).toBe(
      verifyResult.payload.iat! + keyDurationSeconds,
    );
  });
});
