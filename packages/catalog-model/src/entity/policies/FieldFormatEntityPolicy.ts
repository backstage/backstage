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

import { EntityPolicy } from '../../types';
import { makeValidator, Validators } from '../../validation';
import { Entity } from '../Entity';

/**
 * Ensures that the format of individual fields of the entity envelope
 * is valid.
 *
 * This does not take into account machine generated fields such as uid, etag
 * and generation.
 */
export class FieldFormatEntityPolicy implements EntityPolicy {
  private readonly validators: Validators;

  constructor(validators: Validators = makeValidator()) {
    this.validators = validators;
  }

  async enforce(entity: Entity): Promise<Entity> {
    function require(
      field: string,
      value: any,
      validator: (value: any) => boolean,
    ) {
      if (value === undefined || value === null) {
        throw new Error(`${field} must have a value`);
      }

      let isValid: boolean;
      try {
        isValid = validator(value);
      } catch (e) {
        throw new Error(`${field} could not be validated, ${e}`);
      }

      if (!isValid) {
        throw new Error(`${field} "${value}" is not valid`);
      }
    }

    function optional(
      field: string,
      value: any,
      validator: (value: any) => boolean,
    ) {
      return value === undefined || require(field, value, validator);
    }

    require('apiVersion', entity.apiVersion, this.validators.isValidApiVersion);
    require('kind', entity.kind, this.validators.isValidKind);

    require('metadata.name', entity.metadata.name, this.validators
      .isValidEntityName);
    optional(
      'metadata.namespace',
      entity.metadata.namespace,
      this.validators.isValidNamespace,
    );

    for (const [k, v] of Object.entries(entity.metadata.labels ?? [])) {
      require(`labels.${k}`, k, this.validators.isValidLabelKey);
      require(`labels.${k}`, v, this.validators.isValidLabelValue);
    }

    for (const [k, v] of Object.entries(entity.metadata.annotations ?? [])) {
      require(`annotations.${k}`, k, this.validators.isValidAnnotationKey);
      require(`annotations.${k}`, v, this.validators.isValidAnnotationValue);
    }

    const tags = entity.metadata.tags ?? [];

    for (let i = 0; i < tags.length; ++i) {
      require(`tags.${i}`, tags[i], this.validators.isValidTag);
    }

    return entity;
  }
}
