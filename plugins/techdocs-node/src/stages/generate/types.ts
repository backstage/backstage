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

import { Entity } from '@backstage/catalog-model';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Determines where the generator will be run. `'docker'` is a shorthand for running the generator in a container.
 * If no {@link GeneratorOptions.containerRunner} is specified, the internal `DockerContainerRunner` will be used.
 */
export type GeneratorRunInType = 'docker' | 'local';

/**
 * Options for building generators
 * @public
 */
export type GeneratorOptions = {
  logger: LoggerService;
  containerRunner?: TechDocsContainerRunner;
};

/**
 * The techdocs generator configurations options.
 */
export type GeneratorConfig = {
  runIn: GeneratorRunInType;
  dockerImage?: string;
  pullImage?: boolean;
  omitTechdocsCoreMkdocsPlugin?: boolean;
  legacyCopyReadmeMdToIndexMd?: boolean;
  defaultPlugins?: string[];
};

/**
 * The values that the generator will receive.
 *
 * @public
 * @param inputDir - The directory of the uncompiled documentation, with the values from the frontend
 * @param outputDir - Directory to store generated docs in. Usually - a newly created temporary directory.
 * @param parsedLocationAnnotation - backstage.io/techdocs-ref annotation of an entity
 * @param etag - A unique identifier for the prepared tree e.g. commit SHA. If provided it will be stored in techdocs_metadata.json.
 * @param logger - A logger that forwards the messages to the caller to be displayed outside of the backend.
 * @param logStream - A log stream that can send raw log messages to the caller to be displayed outside of the backend.
 * @param siteOptions - Options for the site: The `name` property will be used in mkdocs.yml config for the required `site_name` property, default value is "Documentation Site"
 */
export type GeneratorRunOptions = {
  inputDir: string;
  outputDir: string;
  parsedLocationAnnotation?: ParsedLocationAnnotation;
  etag?: string;
  logger: Logger;
  logStream?: Writable;
  siteOptions?: { name?: string };
  runAsDefaultUser?: boolean;
};

/**
 * Generates documentation files
 * @public
 */
export type GeneratorBase = {
  /**
   * Runs the generator with the values
   * @public
   */
  run(opts: GeneratorRunOptions): Promise<void>;
};

/**
 * List of supported generator options
 * @public
 */
export type SupportedGeneratorKey = 'techdocs' | string;

/**
 * The generator builder holds the generator ready for run time
 * @public
 */
export type GeneratorBuilder = {
  register(protocol: SupportedGeneratorKey, generator: GeneratorBase): void;
  get(entity: Entity): GeneratorBase;
};

export type DefaultMkdocsContent = {
  site_name: string;
  docs_dir: string;
  plugins: String[];
};

/**
 * Handles the running of containers to generate TechDocs.
 *
 * Custom implementations, e.g. for Kubernetes or other execution environments, can be inspired by the internal default
 * implementation `DockerContainerRunner`.
 *
 * @public
 */
export interface TechDocsContainerRunner {
  /**
   * Runs a container image to completion.
   */
  runContainer(opts: {
    imageName: string;
    command?: string | string[];
    args: string[];
    logStream?: Writable;
    mountDirs?: Record<string, string>;
    workingDir?: string;
    envVars?: Record<string, string>;
    pullImage?: boolean;
    defaultUser?: boolean;
    pullOptions?: {
      authconfig?: {
        username?: string;
        password?: string;
        auth?: string;
        email?: string;
        serveraddress?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }): Promise<void>;
}
