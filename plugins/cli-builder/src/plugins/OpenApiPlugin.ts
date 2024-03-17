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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { coreCliServices } from '../services';
import fetch from 'cross-fetch';
import { kebabCase } from 'lodash';
import { readFile } from 'fs-extra';
import { parse } from 'uri-template';
import Parser from '@apidevtools/swagger-parser';

export type ParameterLocation = 'query' | 'header' | 'path' | 'cookie';

interface OperationObject {
  operationId: string;
  description?: string;
  parameters?: {
    in: ParameterLocation;
    name: string;
    required?: boolean;
    explode?: boolean;
    schema: any;
  }[];
  requestBody?: any;
}

async function fetchOpenApiSpec(baseUrl: string) {
  const response = await fetch(`${baseUrl}/openapi.json`);
  if (!response.ok) {
    throw new Error('Bad response');
  }
  const spec = await response.json();
  return (await Parser.dereference(spec)) as any;
}

function getOperations(spec: {
  paths: Record<string, Record<string, OperationObject>>;
}) {
  const operations = [];
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      operations.push({ path, operation, method });
    }
  }
  return operations;
}

const examplePlugin = createBackendPlugin({
  pluginId: 'api',
  register(env) {
    env.registerInit({
      deps: {
        commander: coreCliServices.commander,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
      },
      async init({ logger, commander, discovery }) {
        const specs = [];
        for (const pluginId of ['catalog', 'todo', 'search']) {
          const spec = await fetchOpenApiSpec(
            await discovery.getBaseUrl(pluginId),
          );
          specs.push({ spec, pluginId });
        }
        for (const { spec, pluginId } of specs) {
          const pluginCommand = commander
            .command(`${pluginId} [command]`)
            .description(`API interface for ${pluginId}`);
          for (const { path, operation, method } of getOperations(spec)) {
            const operationCommand = pluginCommand
              .command(kebabCase(operation.operationId))
              .option('--json');

            for (const parameter of operation.parameters ?? []) {
              const isArray = parameter.schema.type === 'array';
              const flagName = `--${kebabCase(parameter.name)} <${
                parameter.name
              }${isArray ? '...' : ''}>`;
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              parameter.required
                ? operationCommand.requiredOption(flagName)
                : operationCommand.option(flagName);
            }

            if (operation.requestBody) {
              operationCommand.requiredOption('--body <filename>');
            }

            operationCommand.action(async options => {
              const fetchOptions: RequestInit = {};
              const headers: any = {};
              if (operation.requestBody && options.body) {
                const fileContents = await readFile(options.body);
                fetchOptions.body = JSON.parse(fileContents.toString());
                headers['Content-Type'] = 'application/json';
              }
              const expandOptions: any = {};
              const queryParams: string[] = [];
              for (const parameter of operation.parameters ?? []) {
                if (parameter.in === 'path' || parameter.in === 'query') {
                  expandOptions[parameter.name] =
                    options[kebabCase(parameter.name)];
                }

                if (parameter.in === 'query') {
                  queryParams.push(
                    `${parameter.name}${parameter.explode ? '*' : ''}`,
                  );
                }
              }
              let pathToTemplate = `${path}`;
              if (queryParams.length) {
                pathToTemplate += `{?${queryParams.join(',')}}`;
              }

              const { host, protocol } = new URL(
                await discovery.getBaseUrl(pluginId),
              );
              const templatedUri = `${protocol}${host}${parse(
                pathToTemplate,
              ).expand(expandOptions)}`;

              logger.info(`Sending request to ${templatedUri}`);
              const response = await fetch(templatedUri, {
                method,
                headers,
                ...fetchOptions,
              });
              logger.info('sent');
              if (!response.ok) {
                console.error(
                  `Request to ${templatedUri} failed with ${response.statusText} (${response.status})`,
                );
                console.error(await response.text());
                return;
              }
              logger.info(`Request succeeded!`);
              if (
                response.headers
                  .get('Content-Type')
                  ?.startsWith('application/json')
              ) {
                const parsedResponse = await response.json();
                if (options.json) {
                  console.log(parsedResponse);
                  return;
                }
                console.table(parsedResponse);
              } else {
                const parsedResponse = await response.text();
                if (options.json) {
                  throw new Error('Unable to coerce value into json.');
                }
                console.log(parsedResponse);
              }
            });
          }
        }
      },
    });
  },
});

export default examplePlugin;
