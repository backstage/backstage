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
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';

/**
 * Parameters passed to the shouldBuild method on the DocsBuildStrategy interface
 *
 * @public
 */
export type ShouldBuildParameters = {
  entity: Entity;
};

/**
 * A strategy for when to build TechDocs locally, and when to skip building TechDocs (allowing for an external build)
 *
 * @public
 */
export interface DocsBuildStrategy {
  shouldBuild(params: ShouldBuildParameters): Promise<boolean>;
}

export class DefaultDocsBuildStrategy {
  private readonly config: Config;

  private constructor(config: Config) {
    this.config = config;
  }

  static fromConfig(config: Config): DefaultDocsBuildStrategy {
    return new DefaultDocsBuildStrategy(config);
  }

  async shouldBuild(_: ShouldBuildParameters): Promise<boolean> {
    return this.config.getString('techdocs.builder') === 'local';
  }
}
