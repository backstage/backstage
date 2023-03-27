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
import React from 'react';

type IOnboardingContext = {
  groups: string[];
  subGroups: string[];
  modal: boolean;
  selectedGroup: string;
  selectedSubGroup: string;
  checklists: any[];
  toggleModal: () => void;
  updateSelectedSubGroup: (val: string) => void;
  updateSelectedGroup: (val: string) => void;
  updateDataList: (id: string, status: boolean) => void;
  syncChecklistStatus: () => void;
};
export const OnboardingContext = React.createContext<IOnboardingContext>({
  groups: [],
  subGroups: [],
  checklists: [],
  modal: false,
  selectedGroup: '',
  selectedSubGroup: '',
  toggleModal: () => {},
  updateSelectedSubGroup: () => {},
  updateSelectedGroup: () => {},
  updateDataList: () => {},
  syncChecklistStatus: () => {},
});
