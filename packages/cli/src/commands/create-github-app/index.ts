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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer, { Question } from 'inquirer';
import fetch from 'node-fetch';
import openBrowser from 'react-dev-utils/openBrowser';
import { stringify as stringifyYaml } from 'yaml';
import { GithubAppConfig } from '@backstage/integration';

import { paths } from '../../lib/paths';
import { GithubCreateAppServer } from './GithubCreateAppServer';

// This is an experimental command that at this point does not support GitHub Enterprise
// due to lacking support for creating apps from manifests.
// https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-a-github-app-from-a-manifest
export default async (org: string) => {
  // TODO(tudi2d): Why is the Org check not done here?
  const answers = await permissionAnswers();
  await verifyGithubOrg(org);
  const { fileName } = await createGHAYaml(org, answers.appType);

  console.log(
    "Here's an example on how to update the integrations section in app-config.yaml",
  );
  console.log(
    chalk.green(`
integrations:
  github:
    - host: github.com
      apps:
        - $include: ${fileName}`),
  );
};

/**
 *
 * @param org string: GitHub Organisation
 * @returns Promise<config>: Partial App Config for Admin CLI
 */
export async function adminCli(org: string) {
  await verifyGithubOrg(org);
  const answers = await permissionAnswers({
    read: true,
    members: true,
    write: true,
  });
  const { fileName, config } = await createGHAYaml(org, answers.appType);
  const auth = {
    providers: {
      github: {
        development: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      },
    },
  };
  const integration = {
    github: {
      host: 'github.com',
      apps: {
        $include: `${fileName}`,
      },
    },
  };

  return {
    auth,
    integration,
  };
}

async function verifyGithubOrg(org: string): Promise<void> {
  let response;

  try {
    response = await fetch(
      `https://api.github.com/orgs/${encodeURIComponent(org)}`,
    );
  } catch (e) {
    console.log(
      chalk.yellow(
        'Warning: Unable to verify existence of GitHub organization. ',
        e,
      ),
    );
  }

  if (response?.status === 404) {
    const questions: Question[] = [
      {
        type: 'confirm',
        name: 'shouldCreateOrg',
        message: `GitHub organization ${chalk.cyan(
          org,
        )} does not exist. Would you like to create a new Organization instead?`,
      },
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.shouldCreateOrg) {
      console.log(
        chalk.yellow('GitHub organization must exist to create GitHub app'),
      );
      process.exit(1);
    }

    openBrowser('https://github.com/account/organizations/new');

    // TODO(tudi2d): Could we maybe re-run the command rather than exit?
    console.log(
      chalk.yellow(
        'Please re-run this command when you have created your new organization',
      ),
    );

    process.exit(0);
  }
}

async function permissionAnswers(
  checked: { read: boolean; members: boolean; write: boolean } = {
    read: true,
    members: true,
    write: false,
  },
) {
  const answers = await inquirer.prompt<{ appType: string[] }>({
    name: 'appType',
    type: 'checkbox',
    message:
      'Select permissions [required] (these can be changed later but then require approvals in all installations)',
    choices: [
      {
        name: 'Read access to content (required by Software Catalog to ingest data from repositories)',
        value: 'read',
        checked: checked.read,
      },
      {
        name: 'Read access to members (required by Software Catalog to ingest GitHub teams)',
        value: 'members',
        checked: checked.members,
      },
      {
        name: 'Read and Write to content and actions (required by Software Templates to create new repositories)',
        value: 'write',
        checked: checked.write,
      },
    ],
  });

  if (answers.appType.length === 0) {
    console.log(chalk.red('You must select at least one permission'));
    // TODO(tudi2d): Maybe re-do input rather than exit?
    process.exit(1);
  }

  return answers;
}

async function createGHAYaml(
  org: string,
  permissions: string[],
): Promise<{ fileName: string; config: GithubAppConfig }> {
  const { slug, name, ...config } = await GithubCreateAppServer.run({
    org,
    permissions,
  });

  const fileName = `github-app-${slug}-credentials.yaml`;
  const content = `# Name: ${name}\n${stringifyYaml(config)}`;
  await fs.writeFile(paths.resolveTargetRoot(fileName), content);
  console.log(`GitHub App configuration written to ${chalk.cyan(fileName)}`);
  console.log(
    chalk.yellow(
      'This file contains sensitive credentials, it should not be committed to version control and handled with care!',
    ),
  );

  return {
    fileName,
    config,
  };
}
