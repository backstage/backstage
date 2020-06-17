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

import {
  Group,
  GroupsJson,
  GroupsResponse,
  IdentityApi,
  GroupsRequest,
} from './types';
import fs from 'fs-extra';
import path from 'path';

const GROUPS_JSON_FILE = path.join(__dirname, 'data', 'userGroups.json');

export class StaticJsonAdapter implements IdentityApi {
  private readonly groups: Group[];

  constructor() {
    const groupsJson: GroupsJson = fs.readJsonSync(GROUPS_JSON_FILE, {
      encoding: 'utf8',
    });
    this.groups = groupsJson.groups;
  }

  getUserGroups(req: GroupsRequest): Promise<GroupsResponse> {
    return new Promise(resolve => {
      const { user, type } = req;
      const userGroups = this._getUserGroups(this.groups, user);
      const groups = this.filterGroupsByType(userGroups, type);
      resolve({ groups });
    });
  }

  _getUserGroups(groups: Group[], user: string) {
    const userGroups: Set<Group> = new Set();
    groups.forEach(group => {
      if (this.isUserInGroup(group, user)) {
        userGroups.add(group);
      }

      if (group.children) {
        const userSubGroups = this._getUserGroups(group.children, user) ?? [];
        const isUserInSubGroup = Boolean(userSubGroups.length);
        if (isUserInSubGroup) {
          userGroups.add(group);
        }
        userSubGroups.forEach(subGroup => userGroups.add(subGroup));
      }
    });
    return Array.from(userGroups);
  }

  private filterGroupsByType = (userGroups: Group[], type: string) => {
    const groups = type
      ? userGroups
          .filter((group: Group) => group.type === type)
          .map(group => ({ name: group.name, type: group.type }))
      : userGroups.map(group => ({
          name: group.name,
          type: group.type,
        }));
    return groups;
  };

  private isUserInGroup = (group: Group, user: string): boolean => {
    if (group.members) {
      const groupMembers = group.members;
      const groupsWithUser = groupMembers.filter(
        member => member.name === user,
      );
      return Boolean(groupsWithUser.length);
    }
    return false;
  };
}
