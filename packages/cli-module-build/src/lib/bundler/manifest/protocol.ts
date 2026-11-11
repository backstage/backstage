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

/**
 * The marker that prefixes every result line written to stdout by the
 * extraction worker, since plugin code is free to log anything else.
 */
export const MANIFEST_RESULT_MARKER = '__backstage_manifest__ ';

/**
 * The input passed to the extraction worker as JSON in the
 * BACKSTAGE_MANIFEST_INPUT environment variable.
 */
export interface ManifestWorkerInput {
  appDir: string;
  transformDir: string;
  packages: Array<{ key: string; import: string; syncImport?: string }>;
  timeoutMs: number;
}
