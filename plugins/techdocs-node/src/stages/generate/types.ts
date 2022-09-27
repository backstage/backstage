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

import { ContainerRunner } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';

// Determines where the generator will be run
export type GeneratorRunInType = 'docker' | 'local';

/**
 * Options for building generators
 * @public
 */
export type GeneratorOptions = {
  containerRunner?: ContainerRunner;
  logger: Logger;
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
 */
export type GeneratorRunOptions = {
  inputDir: string;
  outputDir: string;
  parsedLocationAnnotation?: ParsedLocationAnnotation;
  etag?: string;
  logger: Logger;
  logStream?: Writable;
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
