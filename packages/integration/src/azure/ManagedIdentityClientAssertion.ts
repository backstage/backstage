/*
 * Copyright 2025 The Backstage Authors
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
import { ManagedIdentityCredential } from '@azure/identity';
import { ClientAssertion } from './ClientAssertion';

export type ManagedIdentityClientAssertionOptions = {
  clientId?: string;
};

const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
const expiresWithinFiveMinutes = (clientAssertion: ClientAssertion) =>
  clientAssertion.expiresOnTimestamp - Date.now() <= fiveMinutes;

/**
 * Class representing a Managed Identity Client Assertion.
 * This class is responsible for obtaining a signed client assertion using Azure Managed Identity.
 */
export class ManagedIdentityClientAssertion {
  private credential: ManagedIdentityCredential;
  private clientAssertion?: ClientAssertion;

  /**
   * Creates an instance of ManagedIdentityClientAssertion.
   * @param options - Optional parameters for the ManagedIdentityClientAssertion.
   *                  - clientId: The client ID of the managed identity. If not provided, 'system-assigned' is used.
   */
  constructor(options?: ManagedIdentityClientAssertionOptions) {
    let { clientId } = options || {};
    clientId ??= 'system-assigned';

    this.credential =
      clientId === 'system-assigned'
        ? new ManagedIdentityCredential()
        : new ManagedIdentityCredential(clientId);
  }

  /**
   * Gets a signed client assertion.
   * If a valid client assertion is already cached which doesn't expire soon, it returns the cached assertion.
   * Otherwise, it obtains a new access token and creates a new client assertion.
   * @returns A promise that resolves to the signed client assertion.
   */
  public async getSignedAssertion(): Promise<string> {
    if (
      this.clientAssertion !== undefined &&
      !expiresWithinFiveMinutes(this.clientAssertion)
    ) {
      return this.clientAssertion.signedAssertion;
    }

    const accessToken = await this.credential.getToken(
      'api://AzureADTokenExchange',
    );

    this.clientAssertion = {
      signedAssertion: accessToken.token,
      expiresOnTimestamp: accessToken.expiresOnTimestamp,
    };

    return accessToken.token;
  }
}
