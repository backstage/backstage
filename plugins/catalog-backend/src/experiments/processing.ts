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

import { Entity, LocationEntity } from '@backstage/catalog-model';

export type LocationReader = {
  read(location: string): Buffer;
};

export type Relation = {
  type: string;
  source: string;
  target: string;
};

export type ProcessingResult =
  | {
      type: 'error';
      error: {
        name: string;
        message: string;
      };
    }
  | {
      type: 'entity';
      entity: Entity;
    }
  | {
      type: 'relation';
      relation: Relation;
    };

export type ProcessingContext = LocationReader & {
  emit(result: ProcessingResult): void;
};

export type EntityProcessor = {
  process(entity: Entity, context: ProcessingContext): Entity;
};

export class StaticLocationProcessor implements EntityProcessor {
  constructor(private readonly locations: LocationEntity[]) {}

  process(entity: Entity, context: ProcessingContext): Entity {
    if (entity.kind.toLowerCase() === 'root') {
      for (const location of this.locations) {
        context.emit({ type: 'entity', entity: location });
      }
    }

    return entity;
  }
}

export class DummyLabelProcessor implements EntityProcessor {
  process(entity: Entity): Entity {
    return {
      ...entity,
      metadata: {
        ...entity.metadata,
        labels: { ...entity.metadata.labels, 'backstage.io/dummy': 'dummy' },
      },
    };
  }
}

export class LocationProcessor implements EntityProcessor {
  process(entity: Entity, context: ProcessingContext): Entity {
    if (entity.kind.toLowerCase() !== 'location') {
      return entity;
    }
    const target = (entity as LocationEntity).spec.target;
    if (!target) {
      return entity;
    }

    try {
      const data = context.read(target);
      // TODO: some verification here
      const child = JSON.parse(data.toString());
      context.emit({ type: 'entity', entity: child });
    } catch (error) {
      context.emit({ type: 'error', error });
    }

    return entity;
  }
}
