/*
 * Copyright 2020 Spotify AB
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
import { Writable } from 'stream';
import Docker from 'dockerode';
import { Entity } from '@backstage/catalog-model';
import { ParsedLocationAnnotation } from '../../helpers';

/**
 * The returned directory from the generator which is ready
 * to pass to the next stage of the TechDocs which is publishing
 */
export type GeneratorRunResult = {
  resultDir: string;
};

/**
 * The values that the generator will receive.
 *
 * @param {string} directory The directory of the uncompiled documentation, with the values from the frontend
 * @param {Docker} dockerClient A docker client to run any generator on top of your directory
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation backstage.io/techdocs-ref annotation of an entity
 * @param {Writable} [logStream] A dedicated log stream
 */
export type GeneratorRunOptions = {
  directory: string;
  dockerClient: Docker;
  parsedLocationAnnotation: ParsedLocationAnnotation;
  logStream?: Writable;
};

export type GeneratorBase = {
  // runs the generator with the values and returns the directory to be published
  run(opts: GeneratorRunOptions): Promise<GeneratorRunResult>;
};

/**
 * List of supported generator options
 */
export type SupportedGeneratorKey = 'techdocs' | string;

/**
 * The generator builder holds the generator ready for run time
 */
export type GeneratorBuilder = {
  register(protocol: SupportedGeneratorKey, generator: GeneratorBase): void;
  get(entity: Entity): GeneratorBase;
};
