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

import * as fs from 'fs-extra';
import yaml from 'yaml';

type GithubAuthConfig = {
  auth: {
    providers: {
      github: {
        development: {
          clientId: string;
          clientSecret: string;
          enterpriseInstanceUrl?: string;
        };
      };
    };
  };
  catalog?: {
    locations: Array<{
      type: string;
      target: string;
      rules: Array<{ allow: Array<string> }>;
    }>;
  };
};

const readYaml = async (file: string) => {
  return yaml.parse(await fs.readFile(file, 'utf8'));
};

export const updateConfigFile = async (
  file: string,
  config: GithubAuthConfig,
) => {
  const content = fs.existsSync(file)
    ? { ...(await readYaml(file)), ...config }
    : config;

  return await fs.writeFile(
    file,
    yaml.stringify(content, {
      indent: 2,
    }),
    'utf8',
  );
};

export const updateEnvFile = async (
  file: string,
  clientId: string,
  clientSecret: string,
) => {
  const content = `
AUTH_GITHUB_CLIENT_ID=${clientId}
AUTH_GITHUB_CLIENT_SECRET=${clientSecret}`;

  if (fs.existsSync(file)) {
    return await fs.appendFile(file, content, 'utf8');
  }

  return await fs.writeFile(file, content, 'utf8');
};

export const addUserEntity = async (file: string, username: string) => {
  const content = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: username,
      annotations: {
        'github.com/user-login': username,
      },
    },
    spec: {
      memberOf: [],
    },
  };

  return await fs.writeFile(
    file,
    yaml.stringify(content, {
      indent: 2,
    }),
    'utf8',
  );
};
