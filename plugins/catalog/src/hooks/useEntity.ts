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
import { useEffect, createContext, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApi, errorApiRef } from '@backstage/core';
import { catalogApiRef } from '../api/types';
import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';

const REDIRECT_DELAY = 2000;

type EntityLoadingStatus = {
  entity?: Entity;
  loading: boolean;
  error?: Error;
};

export const EntityContext = createContext<EntityLoadingStatus>({
  entity: undefined,
  loading: true,
  error: undefined,
});

export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { optionalNamespaceAndName, kind } = useParams();
  const [name, namespace] = optionalNamespaceAndName.split(':').reverse();
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { value: entity, error, loading } = useAsync(
    () => catalogApi.getEntityByName({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (error || (!loading && !entity)) {
      errorApi.post(new Error('Entity not found!'));
      setTimeout(() => {
        navigate('/');
      }, REDIRECT_DELAY);
    }

    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, error, loading, entity, name]);

  return { entity, loading, error };
};

/**
 * Always going to return an entity, or throw an error if not a descendant of a EntityProvider.
 */
export const useEntity = () => {
  const { entity } = useContext<{ entity: Entity }>(EntityContext as any);
  return { entity };
};
