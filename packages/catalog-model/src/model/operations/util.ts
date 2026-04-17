/*
 * Copyright 2026 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { isJsonObject } from '../jsonSchema/util';
import { opDeclareAnnotationV1Schema } from './declareAnnotation';
import { opDeclareKindV1Schema } from './declareKind';
import { opDeclareKindVersionV1Schema } from './declareKindVersion';
import { opDeclareLabelV1Schema } from './declareLabel';
import { opDeclareRelationV1Schema } from './declareRelation';
import { opDeclareTagV1Schema } from './declareTag';
import { CatalogModelOp } from './index';
import { opRemoveAnnotationV1Schema } from './removeAnnotation';
import { opRemoveKindV1Schema } from './removeKind';
import { opRemoveLabelV1Schema } from './removeLabel';
import { opRemoveTagV1Schema } from './removeTag';
import { opUpdateAnnotationV1Schema } from './updateAnnotation';
import { opUpdateKindV1Schema } from './updateKind';
import { opUpdateKindVersionV1Schema } from './updateKindVersion';
import { opUpdateLabelV1Schema } from './updateLabel';
import { opUpdateRelationV1Schema } from './updateRelation';
import { opUpdateTagV1Schema } from './updateTag';

/**
 * Descriptor for a catalog model operation, mapping it to its parser.
 */
export interface CatalogModelOpDescriptor<T extends CatalogModelOp> {
  op: T['op'];
  order: number;
  parse: (data: unknown) => T;
}

/**
 * A mapping from each operation's `op` string to its descriptor, containing
 * the `op` literal and a `parse` function that validates unknown data into the
 * corresponding operation type.
 */
export const ops: {
  [K in CatalogModelOp['op']]: CatalogModelOpDescriptor<
    Extract<CatalogModelOp, { op: K }>
  >;
} = {
  'declareAnnotation.v1': {
    op: 'declareAnnotation.v1',
    order: 0,
    parse: data => opDeclareAnnotationV1Schema.parse(data),
  },
  'declareLabel.v1': {
    op: 'declareLabel.v1',
    order: 1,
    parse: data => opDeclareLabelV1Schema.parse(data),
  },
  'declareTag.v1': {
    op: 'declareTag.v1',
    order: 2,
    parse: data => opDeclareTagV1Schema.parse(data),
  },
  'declareKind.v1': {
    op: 'declareKind.v1',
    order: 3,
    parse: data => opDeclareKindV1Schema.parse(data),
  },
  'declareKindVersion.v1': {
    op: 'declareKindVersion.v1',
    order: 4,
    parse: data => opDeclareKindVersionV1Schema.parse(data),
  },
  'declareRelation.v1': {
    op: 'declareRelation.v1',
    order: 5,
    parse: data => opDeclareRelationV1Schema.parse(data),
  },
  'updateAnnotation.v1': {
    op: 'updateAnnotation.v1',
    order: 6,
    parse: data => opUpdateAnnotationV1Schema.parse(data),
  },
  'updateLabel.v1': {
    op: 'updateLabel.v1',
    order: 7,
    parse: data => opUpdateLabelV1Schema.parse(data),
  },
  'updateTag.v1': {
    op: 'updateTag.v1',
    order: 8,
    parse: data => opUpdateTagV1Schema.parse(data),
  },
  'updateKind.v1': {
    op: 'updateKind.v1',
    order: 9,
    parse: data => opUpdateKindV1Schema.parse(data),
  },
  'updateKindVersion.v1': {
    op: 'updateKindVersion.v1',
    order: 10,
    parse: data => opUpdateKindVersionV1Schema.parse(data),
  },
  'updateRelation.v1': {
    op: 'updateRelation.v1',
    order: 11,
    parse: data => opUpdateRelationV1Schema.parse(data),
  },
  'removeAnnotation.v1': {
    op: 'removeAnnotation.v1',
    order: 12,
    parse: data => opRemoveAnnotationV1Schema.parse(data),
  },
  'removeLabel.v1': {
    op: 'removeLabel.v1',
    order: 13,
    parse: data => opRemoveLabelV1Schema.parse(data),
  },
  'removeTag.v1': {
    op: 'removeTag.v1',
    order: 14,
    parse: data => opRemoveTagV1Schema.parse(data),
  },
  'removeKind.v1': {
    op: 'removeKind.v1',
    order: 15,
    parse: data => opRemoveKindV1Schema.parse(data),
  },
};

/**
 * Parses and validates a catalog model operation, as received for example from
 * a REST endpoint.
 */
export function parseOp(data: unknown): { op: CatalogModelOp; order: number } {
  if (!isJsonObject(data)) {
    throw new InputError('Invalid op: expected a JSON object');
  }

  const opOp = data.op;
  if (typeof opOp !== 'string') {
    throw new InputError(`Unknown op type ${opOp}`);
  }

  const op = ops[opOp as keyof typeof ops];
  if (!op) {
    throw new InputError(`Unknown op ${opOp}`);
  }

  try {
    return { op: op.parse(data), order: op.order };
  } catch (error) {
    throw new InputError(`Invalid op ${opOp}: ${error}`);
  }
}
