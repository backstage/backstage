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
import { useMemo } from 'react';
import {
  useApi,
  useRouteRefParams,
  errorApiRef,
} from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  EntityLoadingStatus,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import { useNavigate } from 'react-router-dom';

type Opts = { name?: string; namespace?: string };

export const useGoldenPathFromUrl = (opts: Opts = {}): EntityLoadingStatus => {
  const { name: routeName, namespace: routeNs } =
    useRouteRefParams(entityRouteRef);
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();

  const name = opts.name ?? routeName;
  const namespace = (
    opts.namespace ??
    routeNs ??
    DEFAULT_NAMESPACE
  ).toLowerCase();

  const entityRef = useMemo(() => {
    return name
      ? stringifyEntityRef({ kind: 'GoldenPath', namespace, name })
      : undefined;
  }, [name, namespace]);

  const {
    value: entity,
    error,
    loading,
    retry: refresh,
  } = useAsyncRetry(async () => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
    return catalogApi.getEntityByRef(entityRef!);
  }, [catalogApi, entityRef]);

  return { entity, loading, error, refresh };
};
