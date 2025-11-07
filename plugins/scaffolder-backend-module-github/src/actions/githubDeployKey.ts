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
  return createTemplateAction({
    id: 'github:deployKey:create',
    description: 'Creates and stores Deploy Keys',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        publicKey: z =>
          z.string({
            description:
              'Generated from `ssh-keygen`.  Begins with `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, `ecdsa-sha2-nistp521`, `ssh-ed25519`, `sk-ecdsa-sha2-nistp256@openssh.com`, or `sk-ssh-ed25519@openssh.com`.',
          }),
        privateKey: z =>
          z.string({
            description: 'SSH Private Key generated from `ssh-keygen`',
          }),
        deployKeyName: z =>
          z.string({
            description: `Name of the Deploy Key`,
          }),
        privateKeySecretName: z =>
          z
            .string({
              description:
                'Name of the GitHub Secret to store the private key related to the Deploy Key.  Defaults to: `KEY_NAME_PRIVATE_KEY` where `KEY_NAME` is the name of the Deploy Key',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
      },
      output: {
        privateKeySecretName: z =>
          z.string({
            description:
              'The GitHub Action Repo Secret Name for the Private Key',
          }),
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

      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      await ctx.checkpoint({
        key: `create.deploy.key.${owner}.${repo}.${publicKey}`,
        fn: async () => {
          await client.rest.repos.createDeployKey({
            owner: owner,
            repo: repo,
            title: deployKeyName,
            key: publicKey,
          });
        },
      });

      const { key, keyId } = await ctx.checkpoint({
        key: `get.repo.public.key.${owner}.${repo}`,
        fn: async () => {
          const publicKeyResponse = await client.rest.actions.getRepoPublicKey({
            owner: owner,
            repo: repo,
          });
          return {
            key: publicKeyResponse.data.key,
            keyId: publicKeyResponse.data.key_id,
          };
        },
      });

      await Sodium.ready;
      const binaryKey = Sodium.from_base64(
        key,
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

      await ctx.checkpoint({
        key: `create.or.update.repo.secret.${owner}.${repo}.${keyId}`,
        fn: async () => {
          await client.rest.actions.createOrUpdateRepoSecret({
            owner: owner,
            repo: repo,
            secret_name: privateKeySecretName,
            encrypted_value: encryptedBase64Secret,
            key_id: keyId,
          });
        },
      });

      ctx.output('privateKeySecretName', privateKeySecretName);
    },
  });
}
