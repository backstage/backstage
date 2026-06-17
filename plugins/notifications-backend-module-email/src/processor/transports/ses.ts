/*
 * Copyright 2024 The Backstage Authors
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
import { createTransport } from 'nodemailer';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';

import { Config } from '@backstage/config';
import { AwsCredentialsManager } from '@backstage/integration-aws-node';

export const createSesTransport = async (
  config: Config,
  credentialsManager: AwsCredentialsManager,
) => {
  const credentials = await credentialsManager.getCredentialProvider({
    accountId: config.getOptionalString('accountId'),
  });

  const sesClient = new SESv2Client([
    {
      apiVersion: config.getOptionalString('apiVersion'),
      region: config.getOptionalString('region'),
      credentials: credentials.sdkCredentialProvider,
      endpoint: config.getOptionalString('endpoint'),
    },
  ]);

  return createTransport({
    SES: { sesClient, SendEmailCommand },
  });
};
