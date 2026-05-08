/*
 * Copyright 2024 The Backstage Authors
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
import { useEntityOptional } from '@backstage/plugin-catalog-react';
import { KubernetesContent } from '../KubernetesContent';

export function KubernetesContentPage() {
  // useEntityOptional is used instead of useEntity to avoid the
  // "Entity context is not available" error in the new frontend system,
  // where the EntityContentBlueprint loader is evaluated outside of
  // EntityProvider when building the sidebar/nav items.
  // In the legacy plugin system this is a no-op: the component is always
  // mounted inside EntityLayout so the entity is always available.
  const entity = useEntityOptional();

  if (!entity) return null;

  return <KubernetesContent entity={entity} />;
}
