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

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useApi, identityApiRef } from '@backstage/core';
import { costInsightsApiRef } from '../api';
import { MapLoadingToProps, useLoading } from './useLoading';
import { DefaultLoadingAction, Group } from '../types';

type GroupsProviderLoadingProps = {
  dispatchLoadingGroups: (isLoading: boolean) => void;
};

export const mapLoadingToProps: MapLoadingToProps<GroupsProviderLoadingProps> = ({
  dispatch,
}) => ({
  dispatchLoadingGroups: (isLoading: boolean) =>
    dispatch({ [DefaultLoadingAction.UserGroups]: isLoading }),
});

type GroupsContextProps = {
  groups: Group[];
};

export type GroupsProviderProps = {
  children: ReactNode;
};

export const GroupsContext = React.createContext<GroupsContextProps>({
  groups: [],
});

export const GroupsProvider = ({ children }: GroupsProviderProps) => {
  const userId = useApi(identityApiRef).getUserId();
  const client = useApi(costInsightsApiRef);
  const { dispatchLoadingGroups } = useLoading(mapLoadingToProps);

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    dispatchLoadingGroups(true);

    async function getUserGroups() {
      const g = await client.getUserGroups(userId);
      setGroups(g);
      dispatchLoadingGroups(false);
    }

    getUserGroups();
  }, [userId, client]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GroupsContext.Provider value={{ groups: groups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export function useGroups(): Group[] {
  const { groups } = useContext(GroupsContext);

  if (!groups) {
    assertNever();
  }

  return groups;
}

function assertNever(): never {
  throw Error('Cannot use useGroups outside of GroupsProvider');
}
