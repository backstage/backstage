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

import {
  AuthMetadata,
  AuthenticationStrategy,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import * as container from '@google-cloud/container';
import { Config } from '@backstage/config';

/**
 * GoogleServiceAccountStrategy provides authentication using Google Service Account credentials.
 *
 * Credentials can be provided via configuration:
 * ```yaml
 * kubernetes:
 *   googleServiceAccountCredentials: |
 *     {
 *       "type": "service_account",
 *       "project_id": "your-project-id",
 *       "private_key_id": "key-id",
 *       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
 *       "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
 *       "client_id": "client-id",
 *       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
 *       "token_uri": "https://oauth2.googleapis.com/token",
 *       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
 *       "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
 *     }
 * ```
 *
 * If no credentials are provided in config, falls back to GOOGLE_APPLICATION_CREDENTIALS or ADC.
 *
 * @public
 */
export class GoogleServiceAccountStrategy implements AuthenticationStrategy {
  private readonly credentials?: string;

  constructor(opts: { config: Config }) {
    this.credentials = opts.config.getOptionalString(
      'kubernetes.googleServiceAccountCredentials',
    );
  }
  public async getCredential(): Promise<KubernetesCredential> {
    let client: container.v1.ClusterManagerClient;

    if (this.credentials) {
      // Use credentials from config
      try {
        const credentialsObject = JSON.parse(this.credentials);

        client = new container.v1.ClusterManagerClient({
          credentials: credentialsObject,
        });
      } catch (error) {
        throw new Error(
          `Failed to parse Google Service Account credentials from config: ${
            error instanceof Error ? error.message : 'Invalid JSON'
          }`,
        );
      }
    } else {
      // Fall back to Application Default Credentials or GOOGLE_APPLICATION_CREDENTIALS
      client = new container.v1.ClusterManagerClient();
    }

    const token = await client.auth.getAccessToken();

    if (!token) {
      throw new Error(
        'Unable to obtain access token for Google Cloud authentication. Check your credentials configuration.',
      );
    }
    return { type: 'bearer token', token };
  }

  public validateCluster(): Error[] {
    return [];
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
