/*
 * Copyright 2022 The Backstage Authors
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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { linguistApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

import { Languages } from '@backstage/plugin-linguist-common';

export function useLanguages(entity: Entity): {
  items?: Languages;
  loading: boolean;
  error?: Error;
} {
  const entityRef = stringifyEntityRef(entity);

  const api = useApi(linguistApiRef);
  const { value, loading, error } = useAsync(() => {
    return api.getLanguages(entityRef);
  }, [api, entityRef]);

  return {
    items: value,
    loading,
    error,
  };
}
