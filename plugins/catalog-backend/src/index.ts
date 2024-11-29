/*
 * Copyright 2020 The Backstage Authors
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
 * The Backstage backend plugin that provides the Backstage catalog
 *
 * @packageDocumentation
 */

export { catalogPlugin as default } from './service/CatalogPlugin';
export * from './processors';
export * from './processing';
export * from './search';
export * from './service';
export * from './deprecated';
export * from './constants';
export * from './util';
