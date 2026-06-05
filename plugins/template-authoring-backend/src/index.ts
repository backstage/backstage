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
 * Backend plugin that generates Backstage scaffolder Template entities
 * from a natural-language description, grounded on optional reference
 * templates and a catalog of well-known scaffolder actions.
 *
 * @packageDocumentation
 */

export { templateAuthoringPlugin as default } from './plugin';
export type { ReferenceTemplateLoader } from './services/ReferenceTemplateLoader';
export type {
  TemplateGenerationService,
  GenerationResult,
} from './services/TemplateGenerationService';
