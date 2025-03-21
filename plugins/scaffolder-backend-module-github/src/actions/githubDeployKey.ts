/*
 * Copyright 2021 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { getOctokitOptions } from '../util';
import { Octokit } from 'octokit';
import Sodium from 'libsodium-wrappers';
import { examples } from './githubDeployKey.examples';

/**
 * Creates an `github:deployKey:create` Scaffolder action that creates a Deploy Key
 *
 * @public
 */
export function createGithubDeployKeyAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;
  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction<{
    repoUrl: string;
    publicKey: string;
    privateKey: string;
    deployKeyName: string;
    privateKeySecretName?: string;
    token?: string;
  }>({
    id: 'github:deployKey:create',
    description: 'Creates and stores Deploy Keys',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'publicKey', 'privateKey', 'deployKeyName'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
            type: 'string',
          },
          publicKey: {
            title: 'SSH Public Key',
            description:
              'Generated from `ssh-keygen`.  Begins with `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, `ecdsa-sha2-nistp521`, `ssh-ed25519`, `sk-ecdsa-sha2-nistp256@openssh.com`, or `sk-ssh-ed25519@openssh.com`.',
            type: 'string',
          },
          privateKey: {
            title: 'SSH Private Key',
            description: 'SSH Private Key generated from `ssh-keygen`',
            type: 'string',
          },
          deployKeyName: {
            title: 'Deploy Key Name',
            description: `Name of the Deploy Key`,
            type: 'string',
          },
          privateKeySecretName: {
            title: 'Private Key GitHub Secret Name',
            description:
              'Name of the GitHub Secret to store the private key related to the Deploy Key.  Defaults to: `KEY_NAME_PRIVATE_KEY` where `KEY_NAME` is the name of the Deploy Key',
            type: 'string',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          privateKeySecretName: {
            title: 'The GitHub Action Repo Secret Name for the Private Key',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        publicKey,
        privateKey,
        deployKeyName,
        privateKeySecretName = `${deployKeyName
          .split(' ')
          .join('_')
          .toLocaleUpperCase('en-US')}_PRIVATE_KEY`,
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        token: providedToken,
        host,
        owner,
        repo,
      });

      const client = new Octokit(octokitOptions);

      await client.rest.repos.createDeployKey({
        owner: owner,
        repo: repo,
        title: deployKeyName,
        key: publicKey,
      });
      const publicKeyResponse = await client.rest.actions.getRepoPublicKey({
        owner: owner,
        repo: repo,
      });

      await Sodium.ready;
      const binaryKey = Sodium.from_base64(
        publicKeyResponse.data.key,
        Sodium.base64_variants.ORIGINAL,
      );
      const binarySecret = Sodium.from_string(privateKey);
      const encryptedBinarySecret = Sodium.crypto_box_seal(
        binarySecret,
        binaryKey,
      );
      const encryptedBase64Secret = Sodium.to_base64(
        encryptedBinarySecret,
        Sodium.base64_variants.ORIGINAL,
      );

      await client.rest.actions.createOrUpdateRepoSecret({
        owner: owner,
        repo: repo,
        secret_name: privateKeySecretName,
        encrypted_value: encryptedBase64Secret,
        key_id: publicKeyResponse.data.key_id,
      });

      ctx.output('privateKeySecretName', privateKeySecretName);
    },
  });
}
