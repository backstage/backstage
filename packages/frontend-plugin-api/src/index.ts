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

/**
 * Core API used by Backstage frontend plugins.
 *
 * @packageDocumentation
 */

export * from './analytics';
export * from './apis';
export * from './blueprints';
export * from './components';
export * from './extensions';
export * from './icons';
export * from './routing';
export * from './schema';
export * from './apis/system';
export * from './translation';
export * from './wiring';

export type {
  CoreProgressProps,
  CoreNotFoundErrorPageProps,
  CoreErrorBoundaryFallbackProps,
} from './types';
