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

import { useContext } from 'react';
import { EntityFilterContext } from './useEntityFilter';
import {
  EntityListContext,
  EntityListContextProps,
} from './useEntityListProvider';
import {
  EntityStreamContext,
  EntityStreamContextProps,
} from './useEntityStreamProvider';

/**
 * Use a list of entities, either loaded all at once or by a stream. For interoperability between both
 *  contexts.
 *
 * @public
 * @returns Hook for interacting with context provided by either {@link EntityListProvider} or {@link EntityStreamProvider}.
 */
export function useEntities():
  | EntityListContextProps
  | EntityStreamContextProps {
  const filterContext = useContext(EntityFilterContext);
  if (!filterContext) {
    throw new Error('useEntities must be used within EntityFilterProvider');
  }
  const listContext = useContext(EntityListContext);
  const streamContext = useContext(EntityStreamContext);
  if (!listContext && !streamContext)
    throw new Error(
      'useEntities must be used within EntityListProvider or EntityStreamProvider',
    );
  if (listContext && streamContext) {
    throw new Error(
      'useEntities must have only one of EntityListProvider or EntityStreamProvider',
    );
  }
  return listContext || streamContext!;
}
