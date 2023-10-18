/*
 * Copyright 2021 The Backstage Authors
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

import { BazaarProject, Member } from '../types';

export const sortMembers = (m1: Member, m2: Member) => {
  return new Date(m2.joinDate!).getTime() - new Date(m1.joinDate!).getTime();
};

export const sortByDate = (a: BazaarProject, b: BazaarProject): number => {
  const dateA = new Date(a.updatedAt!).getTime();
  const dateB = new Date(b.updatedAt!).getTime();
  return dateB - dateA;
};

export const sortByTitle = (a: BazaarProject, b: BazaarProject) => {
  if (a.title < b.title) {
    return -1;
  } else if (a.title > b.title) {
    return 1;
  }
  return 0;
};

export const sortByMembers = (a: BazaarProject, b: BazaarProject) => {
  return b.membersCount - a.membersCount;
};
