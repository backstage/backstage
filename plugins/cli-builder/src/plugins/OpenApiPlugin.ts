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
  LoggerService,
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { coreCliServices } from '../services';
import fetch from 'cross-fetch';
import { kebabCase } from 'lodash';
import { readFile } from 'fs-extra';
import { parse } from 'uri-template';
import Parser from '@apidevtools/swagger-parser';
import { OpenAPIObject } from 'openapi3-ts/oas30';
import dot from 'dot-object';

async function fetchOpenApiSpec(baseUrl: string) {
  const response = await fetch(`${baseUrl}/openapi.json`);
  if (!response.ok) {
    throw new Error(`Bad response (${response.status})`);
  }
  const spec = await response.json();
  return (await Parser.dereference(spec)) as any;
}

function getOperations(spec: OpenAPIObject) {
  const operations = [];
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      operations.push({ path, operation, method });
    }
  }
  return operations;
}

function flattenObjectArray(objArray: object[]) {
  const highestNumberOfKeys = Math.max(
    ...objArray.map(o => Object.keys(dot.dot(o)).length),
  );
  if (highestNumberOfKeys > 5) {
    // Don't try to flatten objects with more than 5 keys
    return objArray;
  }
  return objArray.map(o => dot.dot(o));
}

async function handleResponse(
  response: Response,
  logger: LoggerService,
  options: { json: boolean },
) {
  if (!response.ok) {
    logger.error(`Request failed with code (${response.status})`);
    console.error(await response.text());
    return;
  }
  if (response.headers.get('Content-Type')?.startsWith('application/json')) {
    const parsedResponse = await response.json();
    if (options.json) {
      console.log(JSON.stringify(parsedResponse, null, 2));
      return;
    }
    if (Array.isArray(parsedResponse)) {
      console.table(flattenObjectArray(parsedResponse));
    } else {
      console.log(JSON.stringify(parsedResponse, null, 2));
    }
  } else {
    const parsedResponse = await response.text();
    if (options.json) {
      throw new Error('Unable to coerce value into json.');
    }
    console.log(parsedResponse);
  }
}

const openapiPlugin = createBackendPlugin({
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
        for (const pluginId of ['catalog', 'search']) {
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
              const option = parameter.required
                ? operationCommand.requiredOption(flagName)
                : operationCommand.option(flagName);
              if (parameter.description) {
                option.description(parameter.description);
              }
            }

            if (operation.requestBody) {
              operationCommand.requiredOption('--body-file <filename>');
            }

            operationCommand.action(async options => {
              const fetchOptions: RequestInit = {};
              const headers: Record<string, string> = {};
              if (operation.requestBody && options.bodyFile) {
                const fileContents = await readFile(options.bodyFile);
                fetchOptions.body = fileContents.toString();
                headers['Content-Type'] = 'application/json';
              }
              const expandOptions: Record<string, string> = {};
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
              let pathToTemplate = path;
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
              await handleResponse(response, logger, options);
            });
          }
        }
      },
    });
  },
});

export default openapiPlugin;
