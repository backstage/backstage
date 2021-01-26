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
import { EntityName } from '@backstage/catalog-model';
/**
 * Using the path of the TechDocs page URL, return a structured EntityName type object with namespace,
 * kind and name of the Entity.
 * @param {string} path Example: default/Component/documented-component
 */
export const getEntityNameFromUrlPath = (path: string): EntityName => {
  const [namespace, kind, name] = path.split('/');

  return {
    namespace,
    kind,
    name,
  };
};
