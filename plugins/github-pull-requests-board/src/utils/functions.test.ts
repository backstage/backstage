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
import { filterSameUser } from './functions';

import { Author } from './types';

const users = [
  null,
  {
    login: 'myuserlogin',
    avatarUrl: '',
    id: '',
    email: '',
    name: '',
  },
  {
    login: 'anotheruserlogin',
    avatarUrl: '',
    id: '',
    email: '',
    name: '',
  },
  {
    login: 'myuserlogin',
    avatarUrl: '',
    id: '',
    email: '',
    name: '',
  },
] as Author[];

describe('filterSameUser', () => {
  it('should return distinct users', () => {
    expect(filterSameUser(users).length).toEqual(2);
  });

  // null users a.k.a. Ghost users are accounts that have been deleted
  it('should contain null user', () => {
    expect(filterSameUser(users)).not.toContain(null);
  });
});
