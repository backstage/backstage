/*
 * Copyright 2022 The Backstage Authors
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
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';

/**
 * Parameters passed to the usePublishStrategy method on the DocsPublishStrategy interface
 *
 * @public
 */
export type UsePublishStrategyParameters = {
  entity: Entity;
};

/**
 * Parameters passed to the resolveEntityName method on the DOcsPublishStrategy interface
 *
 * @public
 */
export type EntityNameParameters = {
  entity: Entity;
  alternateName?: string;
};

/**
 * A strategy for how to resolve the techdocs publishing path.
 * Implment an override when a non-standard path is required for storage.
 *
 * @public
 */
export interface DocsPublishStrategy {
  usePublishStrategy(param: UsePublishStrategyParameters): Promise<boolean>;
  resolveEntityName(params: EntityNameParameters): Promise<CompoundEntityRef>;
}

export class DefaultDocsPublishStrategy {
  private readonly config: Config;

  private constructor(config: Config) {
    this.config = config;
  }

  static fromConfig(config: Config): DefaultDocsPublishStrategy {
    return new DefaultDocsPublishStrategy(config);
  }

  async usePublishStrategy(_: UsePublishStrategyParameters): Promise<boolean> {
    return Boolean(this.config.getOptionalString('techdocs.alternateName'));
  }

  async resolveEntityName(
    params: EntityNameParameters,
  ): Promise<CompoundEntityRef> {
    return {
      name: params.entity.metadata.name,
      namespace: params.entity.metadata.namespace || 'default',
      kind: params.entity.kind,
    };
  }
}
