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

import {
  ComponentEntity,
  Entity,
  LocationSpec,
} from '@backstage/catalog-model';
import { LocationProcessor, LocationProcessorEmit } from './types';

const API_DEFINITION_TYPE_ANNOTATION = /^backstage.io\/api-definition-(.+)$/;

export function extractApiDefinitionTypeAnnotations(entity: Entity): string[] {
  if (!entity.metadata.annotations) {
    return [];
  }

  return Object.keys(entity.metadata.annotations).filter(a =>
    a.match(API_DEFINITION_TYPE_ANNOTATION),
  );
}

export function extractApiDefinitionType(annotationName: string): string {
  return annotationName.match(API_DEFINITION_TYPE_ANNOTATION)![1];
}

export class ApiDefinitionAnnotationProcessor implements LocationProcessor {
  async processEntity(
    entity: Entity,
    location: LocationSpec,
    emit: LocationProcessorEmit,
  ): Promise<Entity> {
    // TODO: Case insensitive?
    if (entity.kind !== 'Component') {
      return entity;
    }

    const apiDefinitionAnnotations = extractApiDefinitionTypeAnnotations(
      entity,
    );

    let componentEntity = entity as ComponentEntity;

    for (let i = 0; i < apiDefinitionAnnotations.length; ++i) {
      const annotation = apiDefinitionAnnotations[i];
      componentEntity = await this.processApiDefinitionAnnotation(
        componentEntity,
        annotation,
        location,
        emit,
      );
    }

    return componentEntity;
  }

  async processApiDefinitionAnnotation(
    entity: ComponentEntity,
    annotation: string,
    location: LocationSpec,
    emit: LocationProcessorEmit,
  ): Promise<ComponentEntity> {
    const url = entity.metadata.annotations![annotation];
    const type = extractApiDefinitionType(annotation);
    const name = `${entity.metadata.name}-${type}-api`;
    const apiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name,
        description: entity.metadata.description,
        tags: entity.metadata.tags,
        namespace: entity.metadata.namespace,
      },
      spec: {
        type,
        lifecycle: entity.spec?.lifecycle,
        owner: entity.spec?.owner,
        definition: { $text: url },
      },
    };

    emit({
      type: 'entity',
      entity: apiEntity,
      location,
    });

    if (!entity.spec.implementsApis) {
      entity.spec.implementsApis = [name];
    } else {
      entity.spec.implementsApis.push(name);
    }

    return entity;
  }
}
