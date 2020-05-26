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
import { DescriptorEnvelope, KindParser, ParserError } from '../types';

export interface ComponentDescriptorV1beta1 extends DescriptorEnvelope {
  spec: {
    type: string;
  };
}

export class ComponentDescriptorV1beta1Parser implements KindParser {
  private schema: yup.Schema<any>;

  constructor() {
    this.schema = yup.object<Partial<ComponentDescriptorV1beta1>>({
      metadata: yup
        .object({
          name: yup.string().required(),
        })
        .required(),
      spec: yup
        .object({
          type: yup.string().required(),
        })
        .required(),
    });
  }

  async tryParse(
    envelope: DescriptorEnvelope,
  ): Promise<DescriptorEnvelope | undefined> {
    if (
      envelope.apiVersion !== 'backstage.io/v1beta1' ||
      envelope.kind !== 'Component'
    ) {
      return undefined;
    }

    try {
      return await this.schema.validate(envelope, { strict: true });
    } catch (e) {
      throw new ParserError(
        `Malformed component, ${e}`,
        envelope.metadata?.name,
      );
    }
  }
}
