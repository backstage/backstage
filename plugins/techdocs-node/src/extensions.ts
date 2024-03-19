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
import { TechdocsGenerator } from './stages';

/**
 * Extension point type for configuring Techdocs builds.
 *
 * @public
 */
export interface TechdocsBuildsExtensionPoint {
  setBuildStrategy(buildStrategy: DocsBuildStrategy): void;
}

/**
 * Extension point for configuring Techdocs builds.
 *
 * @public
 */
export const techdocsBuildsExtensionPoint =
  createExtensionPoint<TechdocsBuildsExtensionPoint>({
    id: 'techdocs.builds',
  });

/**
 * Extension point type for configuring a custom Techdocs generator
 *
 * @public
 */
export interface TechdocsGeneratorExtensionPoint {
  setTechdocsGenerator(generator: TechdocsGenerator): void;
}

/**
 * Extension point for configuring a custom Techdocs generator
 *
 * @public
 */
export const techdocsGeneratorExtensionPoint =
  createExtensionPoint<TechdocsGeneratorExtensionPoint>({
    id: 'techdocs.generator',
  });
