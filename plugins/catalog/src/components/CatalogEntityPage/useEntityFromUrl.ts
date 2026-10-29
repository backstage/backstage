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
import {
  errorApiRef,
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  EntityLoadingStatus,
  entityRouteParams,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const navigate = useNavigate();
  const location = useLocation();
  const entityRoute = useRouteRef(entityRouteRef);
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const {
    value,
    error,
    loading,
    retry: refresh,
  } = useAsyncRetry(async () => {
    const entity = await catalogApi.getEntityByRef({ kind, namespace, name });
    if (entity || !catalogApi.getEntityByFormerRef) {
      return { entity, renamedTo: undefined, formerRef: undefined };
    }
    const formerRef = { kind, namespace, name };
    let renamedTo: Entity | undefined;
    try {
      renamedTo = await catalogApi.getEntityByFormerRef(formerRef);
    } catch {
      renamedTo = undefined;
    }
    return { entity: undefined, renamedTo, formerRef };
  }, [catalogApi, kind, namespace, name]);

  useEffect(() => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, error, loading, value, name]);

  const renamedTo = value?.renamedTo;
  const formerRef = value?.formerRef;
  const handledValue = useRef<typeof value>();
  useEffect(() => {
    if (!renamedTo || !formerRef) {
      return;
    }
    const formerKey = stringifyEntityRef(formerRef);
    if (
      handledValue.current === value ||
      stringifyEntityRef(renamedTo) ===
        stringifyEntityRef({ kind, namespace, name })
    ) {
      return;
    }
    handledValue.current = value;
    const oldBase = entityRoute(formerRef);
    const newBase = entityRoute(entityRouteParams(renamedTo));
    const rest = location.pathname.startsWith(oldBase)
      ? location.pathname.slice(oldBase.length)
      : '';
    navigate(`${newBase}${rest}${location.search}${location.hash}`, {
      replace: true,
      state: { formerEntityRef: formerKey },
    });
  }, [
    value,
    renamedTo,
    formerRef,
    entityRoute,
    kind,
    namespace,
    name,
    location,
    navigate,
  ]);

  return {
    entity: value?.entity,
    loading: loading || Boolean(renamedTo),
    error,
    refresh,
  };
};
