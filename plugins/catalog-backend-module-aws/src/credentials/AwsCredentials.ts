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

import aws, { Credentials } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';

export class AwsCredentials {
  /**
   * If accessKeyId and secretAccessKey are missing, the DefaultAWSCredentialsProviderChain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  static create(
    config: {
      accessKeyId?: string;
      secretAccessKey?: string;
      roleArn?: string;
    },
    roleSessionName: string,
  ): Credentials | CredentialsOptions | undefined {
    if (!config) {
      return undefined;
    }

    const accessKeyId = config.accessKeyId;
    const secretAccessKey = config.secretAccessKey;
    let explicitCredentials: Credentials | undefined;

    if (accessKeyId && secretAccessKey) {
      explicitCredentials = new Credentials({
        accessKeyId,
        secretAccessKey,
      });
    }

    const roleArn = config.roleArn;
    if (roleArn) {
      return new aws.ChainableTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleArn: roleArn,
          RoleSessionName: roleSessionName,
        },
      });
    }

    return explicitCredentials;
  }
}
