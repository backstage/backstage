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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import AWS, { Credentials } from 'aws-sdk';
import { sign } from 'aws4';
import { AWSClusterDetails } from '../types/types';
import { KubernetesAuthTranslator } from './types';

const base64 = (str: string) =>
  Buffer.from(str.toString(), 'binary').toString('base64');
const prepend = (prep: string) => (str: string) => prep + str;
const replace = (search: string | RegExp, substitution: string) => (
  str: string,
) => str.replace(search, substitution);
const pipe = (fns: ReadonlyArray<any>) => (thing: string): string =>
  fns.reduce((val, fn) => fn(val), thing);
const removePadding = replace(/=+$/, '');
const makeUrlSafe = pipe([replace('+', '-'), replace('/', '_')]);

type SigningCreds = {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  sessionToken: string | undefined;
};

export class AwsIamKubernetesAuthTranslator
  implements KubernetesAuthTranslator {
  validCredentials(creds: SigningCreds): boolean {
    return ((creds?.accessKeyId &&
      creds?.secretAccessKey &&
      creds?.sessionToken) as unknown) as boolean;
  }

  awsGetCredentials = async (): Promise<Credentials> => {
    return new Promise((resolve, reject) => {
      AWS.config.getCredentials(err => {
        if (err) {
          return reject(err);
        }

        return resolve(AWS.config.credentials as Credentials);
      });
    });
  };

  async getCredentials(assumeRole: string | undefined): Promise<SigningCreds> {
    return new Promise<SigningCreds>(async (resolve, reject) => {
      const awsCreds = await this.awsGetCredentials();

      if (!(awsCreds instanceof Credentials))
        return reject(Error('No AWS credentials found.'));

      let creds: SigningCreds = {
        accessKeyId: awsCreds.accessKeyId,
        secretAccessKey: awsCreds.secretAccessKey,
        sessionToken: awsCreds.sessionToken,
      };

      if (!this.validCredentials(creds))
        return reject(Error('Invalid AWS credentials found.'));
      if (!assumeRole) return resolve(creds);

      try {
        const params = {
          RoleArn: assumeRole,
          RoleSessionName: 'backstage-login',
        };
        const assumedRole = await new AWS.STS().assumeRole(params).promise();

        if (!assumedRole.Credentials) {
          throw new Error(`No credentials returned for role ${assumeRole}`);
        }

        creds = {
          accessKeyId: assumedRole.Credentials.AccessKeyId,
          secretAccessKey: assumedRole.Credentials.SecretAccessKey,
          sessionToken: assumedRole.Credentials.SessionToken,
        };
      } catch (e) {
        console.warn(`There was an error assuming the role: ${e}`);
        return reject(Error(`Unable to assume role: ${e}`));
      }
      return resolve(creds);
    });
  }
  async getBearerToken(
    clusterName: string,
    assumeRole: string | undefined,
  ): Promise<string> {
    const credentials = await this.getCredentials(assumeRole);

    const request = {
      host: `sts.amazonaws.com`,
      path: `/?Action=GetCallerIdentity&Version=2011-06-15&X-Amz-Expires=60`,
      headers: {
        'x-k8s-aws-id': clusterName,
      },
      signQuery: true,
    };

    const signedRequest = sign(request, credentials);

    return pipe([
      (signed: any) => `https://${signed.host}${signed.path}`,
      base64,
      removePadding,
      makeUrlSafe,
      prepend('k8s-aws-v1.'),
    ])(signedRequest);
  }

  async decorateClusterDetailsWithAuth(
    clusterDetails: AWSClusterDetails,
  ): Promise<AWSClusterDetails> {
    const clusterDetailsWithAuthToken: AWSClusterDetails = Object.assign(
      {},
      clusterDetails,
    );

    clusterDetailsWithAuthToken.serviceAccountToken = await this.getBearerToken(
      clusterDetails.name,
      clusterDetails.assumeRole,
    );
    return clusterDetailsWithAuthToken;
  }
}
