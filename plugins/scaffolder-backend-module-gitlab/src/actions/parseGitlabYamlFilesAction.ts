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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { type ScmIntegrationRegistry } from '@backstage/integration';
import { getToken } from '../util';
import { Gitlab } from '@gitbeaker/node';
import YAML from 'js-yaml';

/**
 * Creates a `gitlab:parseGitlabYamlFiles` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const parseGitlabYamlFilesAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction<{
    repoUrl: string;
    projectId: string | number;
    filePath: string;
    propPath: string;
    split: string;
    token?: string;
  }>({
    id: 'gitlab:yamlFiles:parse',
    description: 'Retrieve a value from a .yaml file in a Gitlab repository',
    schema: {
      input: {
        required: ['repoUrl', 'projectId', 'filePath'],
        type: 'object',
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
            description:
              'The Repository Location to the .yaml file containing the variable',
          },
          projectId: {
            title: 'Project ID',
            type: ['string', 'number'],
            description:
              'The Project ID to the .yaml file containing the variable',
          },
          filePath: {
            title: 'File path',
            type: 'string',
            description: 'File path to the .yaml file containing the variable',
          },
          propPath: {
            title: 'Property Path',
            type: 'string',
            description: 'The property path of the variable to retrieve',
          },
          split: {
            title: 'Split Manipulation of the retrieved variable',
            type: 'string',
            description:
              'The kind of split manipulation you want to use on your retrieved variable',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitLab',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          value: {
            title: 'Value',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, projectId, filePath, propPath, split } = ctx.input;
      const { token, integrationConfig } = getToken(ctx.input, integrations);

      const api = new Gitlab({
        host: integrationConfig.config.baseUrl,
        token: token,
      });

      const file = await api.RepositoryFiles.show(
        projectId,
        filePath,
        'master',
      );

      if (!file.content) {
        throw new Error(`File not found: ${filePath}`);
      }

      ctx.logger.info(`Retrieving yaml file from "${ctx.input.projectId}"`);
      const isYamlFile = /\.(yaml|yml|kubeconfig)$/i.test(filePath);

      if (!isYamlFile) {
        throw new Error(`Invalid file type: ${filePath} is not a YAML file`);
      }

      let yamlData;

      try {
        yamlData = YAML.load(file.content);
      } catch (err) {
        throw new Error(`Error parsing YAML file: ${err}`);
      }

      if (!yamlData) {
        throw new Error(`YAML file ${filePath} could not be parsed`);
      }
      function getPropertyByPath<T extends { [key: string]: any }>(
        obj: T,
        path: string,
      ) {
        if (typeof path !== 'string') {
          throw new Error('Invalid path: path must be a string');
        }
        let value: any = obj;
        if (
          /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
            value,
          )
        ) {
          const buff = Buffer.from(value, 'base64');
          value = YAML.load(buff.toString('utf8'));
        }
        const keys = path.split(/[\.\[\]]/).filter(key => key !== '');
        for (const key of keys) {
          if (typeof value === 'object' && value !== null && key in value) {
            value = value[key];
          } else if (Array.isArray(value) && !isNaN(parseInt(key, 10))) {
            value = value[parseInt(key, 10)];
          } else {
            throw new Error(`Key not found: ${key}`);
          }
        }
        return value;
      }
      function parseSplit(stringD: string): [string[], number[]] {
        const splitArgs: string[] = [];
        const arrayNums: number[] = [];
        const regex = /(?:split|slice)\(['"](.+?)['"]\)(?:\[(\d+)\])?/g;
        let match: RegExpExecArray | null = regex.exec(stringD);
        while (match !== null) {
          splitArgs.push(match[1]);
          arrayNums.push(match[2] ? parseInt(match[2], 10) : 0);
          match = regex.exec(stringD);
        }
        return [splitArgs, arrayNums];
      }
      function executeSplitCommands(
        string: string,
        splitArgs: string[],
        arrayNums: number[],
      ): string {
        let res: string = string;
        for (let i = 0; i < splitArgs.length; i++) {
          const splitArg = splitArgs[i];
          const arrayNum = arrayNums[i];
          if (typeof arrayNum === 'number') {
            res = res.split(splitArg)[arrayNum];
          } else {
            throw new Error(
              `Invalid value ${arrayNum} for arrayNums[${i}]. Expected a number.`,
            );
          }
        }
        return res;
      }
      let result: any = undefined;
      if (propPath) {
        result = getPropertyByPath(
          yamlData as { [key: string]: any },
          propPath,
        );
      }
      if (split) {
        if (
          /split\('.+'\)(?:\[\d+\])?(?:\.(?:split\('.+'\)(?:\[\d+\])?)*)?/.test(
            split,
          )
        ) {
          const [splitArgs, arrayNums] = parseSplit(split);
          result = executeSplitCommands(result, splitArgs, arrayNums);
        } else {
          throw new Error(
            'Invalid manipulation argument. Only correct split functions are allowed',
          );
        }
      } else if (!propPath) {
        result = yamlData;
      }
      if (result !== undefined) {
        ctx.output('value', result as string);
      }
    },
  });
};
