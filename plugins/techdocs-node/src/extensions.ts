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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { DocsBuildStrategy } from './techdocsTypes';
import {
  PreparerBase,
  PublisherBase,
  PublisherType,
  RemoteProtocol,
  TechdocsGenerator,
} from './stages';
import * as winston from 'winston';
import { PublisherSettings } from './stages/publish/types';

/**
 * Extension point type for configuring TechDocs builds.
 *
 * @public
 */
export interface TechdocsBuildsExtensionPoint {
  setBuildStrategy(buildStrategy: DocsBuildStrategy): void;
  setBuildLogTransport(transport: winston.transport): void;
}

/**
 * Extension point for configuring TechDocs builds.
 *
 * @public
 */
export const techdocsBuildsExtensionPoint =
  createExtensionPoint<TechdocsBuildsExtensionPoint>({
    id: 'techdocs.builds',
  });

/**
 * Extension point type for configuring a custom TechDocs generator
 *
 * @public
 */
export interface TechdocsGeneratorExtensionPoint {
  setTechdocsGenerator(generator: TechdocsGenerator): void;
}

/**
 * Extension point for configuring a custom TechDocs generator
 *
 * @public
 */
export const techdocsGeneratorExtensionPoint =
  createExtensionPoint<TechdocsGeneratorExtensionPoint>({
    id: 'techdocs.generator',
  });

/**
 * Extension point type for configuring a custom TechDocs preparer
 *
 * @public
 */
export interface TechdocsPreparerExtensionPoint {
  registerPreparer(protocol: RemoteProtocol, preparer: PreparerBase): void;
}

/**
 * Extension point for configuring a custom TechDocs preparer
 *
 * @public
 */
export const techdocsPreparerExtensionPoint =
  createExtensionPoint<TechdocsPreparerExtensionPoint>({
    id: 'techdocs.preparer',
  });

/**
 * Extension point type for configuring a custom TechDocs publisher
 *
 * @public
 */
export interface TechdocsPublisherExtensionPoint {
  registerPublisher(type: PublisherType, publisher: PublisherBase): void;
  registerPublisherSettings<T extends keyof PublisherSettings>(
    publisher: T,
    settings: PublisherSettings[T],
  ): void;
}

/**
 * Extension point for configuring a custom TechDocs publisher
 *
 * @public
 */
export const techdocsPublisherExtensionPoint =
  createExtensionPoint<TechdocsPublisherExtensionPoint>({
    id: 'techdocs.publisher',
  });
