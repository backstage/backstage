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

import {
  createHash,
  createPrivateKey,
  KeyObject,
  randomUUID,
  X509Certificate,
} from 'node:crypto';
import { parse, stringify } from 'node:querystring';
import { SignJWT } from 'jose';

const CLIENT_ASSERTION_TYPE =
  'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

const ASSERTION_LIFETIME_SECONDS = 600;

const CERTIFICATE_PATTERN =
  /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/;
const PRIVATE_KEY_PATTERN =
  /-----BEGIN (RSA )?PRIVATE KEY-----[\s\S]+?-----END (RSA )?PRIVATE KEY-----/;

/**
 * A certificate and the matching private key used to sign client assertions.
 */
export type ClientCertificate = {
  privateKey: KeyObject;
  /** base64url-encoded SHA-256 thumbprint of the DER-encoded certificate */
  thumbprintSha256: string;
};

/**
 * Parses a PEM bundle that contains an X.509 certificate and its unencrypted
 * RSA private key, in any order.
 */
export function parseClientCertificate(pem: string): ClientCertificate {
  const certificatePem = pem.match(CERTIFICATE_PATTERN)?.[0];
  if (!certificatePem) {
    throw new Error(
      'The Microsoft client certificate does not contain a PEM-encoded certificate',
    );
  }
  const privateKeyPem = pem.match(PRIVATE_KEY_PATTERN)?.[0];
  if (!privateKeyPem) {
    throw new Error(
      'The Microsoft client certificate does not contain an unencrypted PEM-encoded private key',
    );
  }

  const certificate = new X509Certificate(certificatePem);
  const privateKey = createPrivateKey(privateKeyPem);
  if (privateKey.asymmetricKeyType !== 'rsa') {
    throw new Error(
      `The Microsoft client certificate private key must be an RSA key, got ${privateKey.asymmetricKeyType}`,
    );
  }
  if (!certificate.checkPrivateKey(privateKey)) {
    throw new Error(
      'The Microsoft client certificate private key does not match the certificate',
    );
  }

  return {
    privateKey,
    thumbprintSha256: createHash('sha256')
      .update(certificate.raw)
      .digest('base64url'),
  };
}

/**
 * Creates a signed client assertion as described in
 * https://learn.microsoft.com/en-us/entra/identity-platform/certificate-credentials
 */
export async function createClientAssertion(options: {
  clientId: string;
  audience: string;
  certificate: ClientCertificate;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({
      alg: 'PS256',
      typ: 'JWT',
      'x5t#S256': options.certificate.thumbprintSha256,
    })
    .setIssuer(options.clientId)
    .setSubject(options.clientId)
    .setAudience(options.audience)
    .setJti(randomUUID())
    .setNotBefore(now)
    .setIssuedAt(now)
    .setExpirationTime(now + ASSERTION_LIFETIME_SECONDS)
    .sign(options.certificate.privateKey);
}

type OAuth2Callback = (
  err: unknown,
  accessToken?: string,
  refreshToken?: string,
  params?: any,
) => void;

/**
 * The subset of the node-oauth `OAuth2` client used by passport-oauth2.
 */
type OAuth2Client = {
  _clientId: string;
  _clientSecret: string;
  _baseSite: string;
  _authorizeUrl: string;
  _accessTokenUrl: string;
  _customHeaders: Record<string, string>;
  _getAccessTokenUrl(): string;
  _request(
    method: string,
    url: string,
    headers: Record<string, string>,
    body: string,
    accessToken: string | null,
    callback: (err: unknown, data?: string | Buffer) => void,
  ): void;
  getOAuthAccessToken(
    code: string,
    params: Record<string, string>,
    callback: OAuth2Callback,
  ): void;
};

/**
 * Replaces the OAuth2 client of a passport-oauth2 based strategy with one that
 * authenticates to the token endpoint with a certificate-signed client
 * assertion instead of a client secret.
 *
 * The replacement is a subclass of the original client class. Token refresh in
 * `@backstage/plugin-auth-node` creates a new client through
 * `strategy._oauth2.constructor`, so both the authorization code exchange and
 * the refresh token grant use the client assertion.
 */
export function useClientAssertion(
  strategy: object,
  certificate: ClientCertificate,
): void {
  const anyStrategy = strategy as unknown as { _oauth2: OAuth2Client };
  const original = anyStrategy._oauth2;
  const BaseOAuth2 = original.constructor as new (
    ...args: unknown[]
  ) => OAuth2Client;

  class ClientAssertionOAuth2 extends BaseOAuth2 {
    // Mirrors node-oauth's OAuth2.getOAuthAccessToken, but sends a client
    // assertion instead of client_secret.
    getOAuthAccessToken(
      code: string,
      params: Record<string, string>,
      callback: OAuth2Callback,
    ): void {
      const url = this._getAccessTokenUrl();
      createClientAssertion({
        clientId: this._clientId,
        audience: url,
        certificate,
      }).then(
        assertion => {
          const body: Record<string, string> = { ...params };
          delete body.client_secret;
          body.client_id = this._clientId;
          body.client_assertion_type = CLIENT_ASSERTION_TYPE;
          body.client_assertion = assertion;
          body[
            params?.grant_type === 'refresh_token' ? 'refresh_token' : 'code'
          ] = code;

          this._request(
            'POST',
            url,
            { 'Content-Type': 'application/x-www-form-urlencoded' },
            stringify(body),
            null,
            (error, data) => {
              if (error) {
                callback(error);
                return;
              }
              let results: any;
              try {
                results = JSON.parse(String(data));
              } catch {
                results = parse(String(data));
              }
              const accessToken = results.access_token;
              const refreshToken = results.refresh_token;
              delete results.refresh_token;
              callback(null, accessToken, refreshToken, results);
            },
          );
        },
        error => callback(error),
      );
    }
  }

  const replacement = new ClientAssertionOAuth2(
    original._clientId,
    '',
    original._baseSite,
    original._authorizeUrl,
    original._accessTokenUrl,
    original._customHeaders,
  );
  // Carry over any state set on the original client after construction
  Object.assign(replacement, original, { _clientSecret: '' });
  anyStrategy._oauth2 = replacement;
}
