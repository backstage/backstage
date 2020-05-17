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

import * as yup from 'yup';
import { Validators } from '../../validation';

// The envelope that's common to all versions/kinds
export type DescriptorEnvelope = {
  apiVersion: string;
  kind: string;
  metadata?: {
    name?: string;
    namespace?: string;
    labels?: object;
    annotations?: object;
  };
  spec?: object;
};

// Parses some raw structured data as a descriptor envelope
export class DescriptorEnvelopeParser {
  private schema: yup.Schema<DescriptorEnvelope>;

  constructor(validators: Validators) {
    const apiVersionSchema = yup
      .string()
      .required()
      .test(
        'apiVersion',
        'The apiVersion is not formatted according to schema',
        validators.isValidApiVersion,
      );

    const kindSchema = yup
      .string()
      .required()
      .test(
        'kind',
        'The kind is not formatted according to schema',
        validators.isValidKind,
      );

    const nameSchema = yup
      .string()
      .notRequired()
      .test(
        'metadata.name',
        'The name is not formatted according to schema',
        (value) => value === undefined || validators.isValidEntityName(value),
      );

    const namespaceSchema = yup
      .string()
      .notRequired()
      .test(
        'metadata.namespace',
        'The namespace is malformed',
        (value) => value === undefined || validators.isValidEntityName(value),
      );

    const labelsSchema = yup
      .object()
      .notRequired()
      .test({
        name: 'metadata.labels.keys',
        message: 'Label keys not formatted according to schema',
        test(value: object) {
          return (
            value === undefined ||
            Object.keys(value).every(validators.isValidLabelKey)
          );
        },
      })
      .test({
        name: 'metadata.labels.values',
        message: 'Label values not formatted according to schema',
        test(value: object) {
          return (
            value === undefined ||
            Object.values(value).every(validators.isValidLabelValue)
          );
        },
      });

    const annotationsSchema = yup
      .object()
      .notRequired()
      .test({
        name: 'metadata.annotations.keys',
        message: 'Annotation keys not formatted according to schema',
        test(value: object) {
          return (
            value === undefined ||
            Object.keys(value).every(validators.isValidAnnotationKey)
          );
        },
      })
      .test({
        name: 'metadata.annotations.values',
        message: 'Annotation values not formatted according to schema',
        test(value: object) {
          return (
            value === undefined ||
            Object.values(value).every(validators.isValidAnnotationValue)
          );
        },
      });

    const metadataSchema = yup
      .object({
        name: nameSchema,
        namespace: namespaceSchema,
        labels: labelsSchema,
        annotations: annotationsSchema,
      })
      .notRequired();

    const specSchema = yup.object({}).notRequired();

    this.schema = yup
      .object({
        apiVersion: apiVersionSchema,
        kind: kindSchema,
        metadata: metadataSchema,
        spec: specSchema,
      })
      .noUnknown();
  }

  async parse(data: any): Promise<DescriptorEnvelope> {
    try {
      return await this.schema.validate(data, { strict: true });
    } catch (e) {
      throw new Error(`Malformed envelope, ${e}`);
    }
  }
}
