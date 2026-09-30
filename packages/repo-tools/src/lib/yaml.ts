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

import { CORE_SCHEMA, load, mergeTag } from 'js-yaml';

// js-yaml v4 resolved merge keys by default; v5 requires this tag explicitly.
const YAML_SCHEMA = CORE_SCHEMA.withTags(mergeTag);

export function loadYaml(source: string): unknown {
  return load(source, { schema: YAML_SCHEMA });
}
