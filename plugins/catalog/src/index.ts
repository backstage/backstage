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

export * from '@backstage/catalog-client';
export { AboutCard } from './components/AboutCard';
export { EntityPageLayout } from './components/EntityPageLayout';
export { EntityLayout } from './components/EntityLayout';
export { EntityProvider } from './components/EntityProvider';
export * from './components/EntitySwitch';
export { Router } from './components/Router';
export { useEntityCompoundName } from './components/useEntityCompoundName';
export { EntityContext, useEntity } from './hooks/useEntity';
export { catalogApiRef, plugin } from './plugin';
export * from './routes';
export * from './extensions';
