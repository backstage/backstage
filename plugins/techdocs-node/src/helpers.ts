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

import {
  LoggerService,
  UrlReaderService,
  resolveSafeChildPath,
} from '@backstage/backend-plugin-api';
import {
  Entity,
  getEntitySourceLocation,
  parseLocationRef,
} from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import path from 'path';
import { PreparerResponse, RemoteProtocol } from './stages/prepare/types';
import { Config } from '@backstage/config';
import { ConfluenceReader } from '@backstage/backend-defaults';

/**
 * Parsed location annotation
 * @public
 */
export type ParsedLocationAnnotation = {
  type: RemoteProtocol;
  target: string;
};

/**
 * Returns a parsed locations annotation
 * @public
 * @param annotationName - The name of the annotation in the entity metadata
 * @param entity - A TechDocs entity instance
 */
export const parseReferenceAnnotation = (
  annotationName: string,
  entity: Entity,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[annotationName];
  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  const { type, target } = parseLocationRef(annotation);
  return {
    type: type as RemoteProtocol,
    target,
  };
};

/**
 * TechDocs references of type `dir` are relative the source location of the entity.
 * This function transforms relative references to absolute ones, based on the
 * location the entity was ingested from. If the entity was registered by a `url`
 * location, it returns a `url` location with a resolved target that points to the
 * targeted subfolder. If the entity was registered by a `file` location, it returns
 * an absolute `dir` location.
 * @public
 * @param entity - the entity with annotations
 * @param dirAnnotation - the parsed techdocs-ref annotation of type 'dir'
 * @param scmIntegrations - access to the scmIntegration to do url transformations
 * @throws if the entity doesn't specify a `dir` location or is ingested from an unsupported location.
 * @returns the transformed location with an absolute target.
 */
export const transformDirLocation = (
  entity: Entity,
  dirAnnotation: ParsedLocationAnnotation,
  scmIntegrations: ScmIntegrationRegistry,
): { type: 'dir' | 'url'; target: string } => {
  const location = getEntitySourceLocation(entity);

  switch (location.type) {
    case 'url': {
      const target = scmIntegrations.resolveUrl({
        url: dirAnnotation.target,
        base: location.target,
      });

      return {
        type: 'url',
        target,
      };
    }

    case 'file': {
      // only permit targets in the same folder as the target of the `file` location!
      const target = resolveSafeChildPath(
        path.dirname(location.target),
        dirAnnotation.target,
      );

      return {
        type: 'dir',
        target,
      };
    }

    default:
      throw new InputError(`Unable to resolve location type ${location.type}`);
  }
};

/**
 * Returns an entity reference based on the TechDocs annotation type
 * @public
 * @param entity - A TechDocs instance
 * @param scmIntegration - An implementation for  SCM integration API
 */
export const getLocationForEntity = (
  entity: Entity,
  scmIntegration: ScmIntegrationRegistry,
): ParsedLocationAnnotation => {
  const annotation = parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity);

  switch (annotation.type) {
    case 'url':
      return annotation;
    case 'dir':
      return transformDirLocation(entity, annotation, scmIntegration);
    case 'confluence':
      return annotation;
    default:
      throw new Error(`Invalid reference annotation ${annotation.type}`);
  }
};

/**
 * Returns a preparer response {@link PreparerResponse}
 * @public
 * @param reader - Read a tree of files from a repository
 * @param entity - A TechDocs entity instance
 * @param opts - Options for configuring the reader, e.g. logger, etag, etc.
 */
export const getDocFilesFromRepository = async (
  reader: UrlReaderService,
  entity: Entity,
  opts?: { etag?: string; logger?: LoggerService },
): Promise<PreparerResponse> => {
  const { target } = parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity);

  opts?.logger?.debug(`Reading files from ${target}`);
  // readTree will throw NotModifiedError if etag has not changed.
  const readTreeResponse = await reader.readTree(target, { etag: opts?.etag });
  const preparedDir = await readTreeResponse.dir();

  opts?.logger?.debug(`Tree downloaded and stored at ${preparedDir}`);

  return {
    preparedDir,
    etag: readTreeResponse.etag,
  };
};

/**
 * Returns a preparer response {@link PreparerResponse}
 * @public
 * @param config - Backstage config
 * @param entity - A TechDocs entity instance
 * @param opts - Options for configuring the reader, e.g. logger, etag, etc.
 */
export const getDocFilesFromConfluence = async (
  config: Config,
  entity: Entity,
  opts?: { etag?: string; logger?: LoggerService },
): Promise<PreparerResponse> => {
  const { target } = parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity);
  opts?.logger?.debug(`Reading files from ${target}`);

  const reader = ConfluenceReader.factory({
    config,
  });
  const preparedDir = await reader.readPage(target);

  opts?.logger?.debug(`Files downloaded and stored at ${preparedDir}`);

  return {
    preparedDir,
    etag: 'something',
  };
};
