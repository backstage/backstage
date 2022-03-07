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

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
  Reducer,
} from 'react';
import useAsync from 'react-use/lib/useAsync';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';

import { techdocsStorageApiRef } from '../../../api';
import { EntityDocs, useEntityDocs } from '../TechDocsEntityDocs';

const UNEXPECTED_RESULT_MESSAGE = 'Unexpected return state';

export enum EntityDocsSyncStatus {
  CHECKING = 'CHECKING',
  BUILDING = 'BUILDING',
  BUILD_READY = 'BUILD_READY',
  UP_TO_DATE = 'UP_TO_DATE',
  ERROR = 'ERROR',
}

export enum EntityDocsSyncTypes {
  LOG = 'LOG',
  FINISH = 'FINISH',
  ERROR = 'ERROR',
}

type Action =
  | {
      type: EntityDocsSyncTypes.LOG;
      line?: string;
    }
  | {
      type: EntityDocsSyncTypes.FINISH;
      result: string;
    }
  | {
      type: EntityDocsSyncTypes.ERROR;
      error: Error;
    };

enum Result {
  CACHED = 'cached',
  UPDATED = 'updated',
}

const isValidResult = (result: string): result is Result => {
  const values = Object.values<string>(Result);
  return values.includes(result);
};

export type EntityDocsSync = {
  status: EntityDocsSyncStatus;
  log: string[];
  error?: Error;
};

export const reducer: Reducer<EntityDocsSync, Action> = (state, action) => {
  switch (action.type) {
    case EntityDocsSyncTypes.LOG:
      return {
        ...state,
        status: !state.log.length
          ? EntityDocsSyncStatus.BUILDING
          : state.status,
        log: action.line ? state.log.concat(action.line) : state.log,
      };
    case EntityDocsSyncTypes.FINISH:
      return {
        ...state,
        log: [],
        error: undefined,
        status:
          action.result === Result.CACHED
            ? EntityDocsSyncStatus.UP_TO_DATE
            : EntityDocsSyncStatus.BUILD_READY,
      };
    case EntityDocsSyncTypes.ERROR:
      return {
        ...state,
        status: EntityDocsSyncStatus.ERROR,
        error: action.error,
      };
    default:
      return state;
  }
};

const isInitialBuild = (result: Result, entityDocs: EntityDocs) => {
  return !entityDocs.value && result === Result.UPDATED;
};

const EntityDocsSyncContext = createContext<EntityDocsSync>({
  status: EntityDocsSyncStatus.CHECKING,
  log: [],
});

type EntityDocsSyncProviderProps = PropsWithChildren<{
  entityRef: CompoundEntityRef;
}>;

export const EntityDocsSyncProvider = ({
  entityRef,
  children,
}: EntityDocsSyncProviderProps) => {
  const entityDocs = useEntityDocs();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const [value, dispatch] = useReducer(reducer, {
    status: EntityDocsSyncStatus.CHECKING,
    log: [],
  });

  useAsync(async () => {
    if (entityDocs.loading) return;

    if (value.status === EntityDocsSyncStatus.BUILD_READY) {
      dispatch({
        type: EntityDocsSyncTypes.FINISH,
        result: Result.CACHED,
      });
    }

    if (value.status === EntityDocsSyncStatus.CHECKING) {
      try {
        const result = await techdocsStorageApi.syncEntityDocs(
          entityRef,
          (line: string) => {
            dispatch({ type: EntityDocsSyncTypes.LOG, line });
          },
        );
        if (!isValidResult(result)) {
          throw new Error(UNEXPECTED_RESULT_MESSAGE);
        }
        if (isInitialBuild(result, entityDocs)) {
          entityDocs.retry();
        }
        dispatch({ type: EntityDocsSyncTypes.FINISH, result });
      } catch (error) {
        dispatch({ type: EntityDocsSyncTypes.ERROR, error });
      }
    }
  }, [entityRef, entityDocs, dispatch, techdocsStorageApi]);

  return (
    <EntityDocsSyncContext.Provider value={value}>
      {children}
    </EntityDocsSyncContext.Provider>
  );
};

export const useEntityDocsSync = () => useContext(EntityDocsSyncContext);
