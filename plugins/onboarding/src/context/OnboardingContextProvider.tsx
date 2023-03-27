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

import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { onboardingApiRef } from '../api';

import { OnboardingContext } from './OnboardingContext';
import { useAsyncRetry } from 'react-use';

export const OnboardingContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [modal, setModal] = useState<boolean>(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [subGroups, setSubGroups] = useState<string[]>([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('');
  const [dataList, setDataList] = useState<any[]>([]);

  const onboardingApi = useApi(onboardingApiRef);

  const {
    value: list,
    loading,
    retry,
  } = useAsyncRetry(async () => {
    const response = await onboardingApi.getChecklist();
    const result = await response.json();
    return { ...result };
  }, [onboardingApi]);

  /**
   * updating the groups and default selected group based on api data and
   */
  useEffect(() => {
    if (!loading && list?.data) {
      setModal(list.showModal);

      if (list?.showModal && Object.keys(list.data).length) {
        setGroups(Object.keys(list.data));
        setSelectedGroup(Object.keys(list.data)[0]);
      }
    }
  }, [list, loading]);

  /**
   * updating sub groups and default selected sub group based on the selected group
   */
  useEffect(() => {
    if (list?.data && list.data[selectedGroup]) {
      setSubGroups(Object.keys(list.data[selectedGroup]));
      if (Object.keys(list.data[selectedGroup]).length) {
        setSelectedSubGroup(Object.keys(list.data[selectedGroup])[0]);
      }
    }
  }, [selectedGroup, list, loading]);

  /**
   * update data list base on the selected group and sub group
   */
  useEffect(() => {
    if (
      list?.data &&
      list.data[selectedGroup] &&
      list.data[selectedGroup][selectedSubGroup]
    ) {
      setDataList(list.data[selectedGroup][selectedSubGroup]);
    }
  }, [list, selectedGroup, selectedSubGroup]);

  /**
   * toggle Onboarding modal
   */
  const toggleModal = () => {
    setModal(!modal);
  };

  /**
   * This method is used to set the selected group
   * @param {string} val selected sub group value
   */
  const updateSelectedSubGroup = (val: string) => {
    setSelectedSubGroup(val);
  };

  /**
   * This method is used to set the selected sub group
   * @param {string} val
   */
  const updateSelectedGroup = (val: string) => {
    setSelectedGroup(val);
  };
  const updateDataList = (id: string, status: boolean) => {
    setDataList([
      ...dataList.map(val => {
        if (val.id === id) {
          val.isDone = status;
        }
        return val;
      }),
    ]);
  };

  const syncChecklistStatus = async () => {
    const body: any = {
      userResponse: {},
      checklistHash: '',
      isDone: true,
      progressStatus: 0,
      checklist_uid: '',
    };
    let completedChecklists = 0;

    dataList.forEach(val => {
      body.userResponse[val.id] = val.isDone;
      body.checklistHash = val.checklistHash;
      body.isDone = body.isDone && val.isDone;
      body.checklist_uid = val.checklist_uid;
      if (val.isDone) {
        completedChecklists += 1;
      }
    });
    body.progressStatus = (completedChecklists * 100) / dataList.length;

    const response = await onboardingApi.updateChecklistStatus(body);
    if (response.status === 200) {
      retry();
    }
  };

  const value = {
    groups,
    selectedGroup,
    selectedSubGroup,
    subGroups,
    modal,
    checklists: dataList,
    toggleModal,
    updateSelectedSubGroup,
    updateSelectedGroup,
    updateDataList,
    syncChecklistStatus,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
