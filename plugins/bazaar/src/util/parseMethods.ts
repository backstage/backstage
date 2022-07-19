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

export const parseBazaarProject = (metadata: any): BazaarProject => {
  return {
    id: metadata.id,
    entityRef: metadata.entity_ref,
    name: metadata.name,
    community: metadata.community,
    description: metadata.description,
    status: metadata.status,
    updatedAt: metadata.updated_at,
    membersCount: metadata.members_count,
    size: metadata.size,
    startDate: metadata.start_date,
    endDate: metadata.end_date,
    responsible: metadata.responsible,
  } as BazaarProject;
};

export const parseMember = (member: any): Member => {
  return {
    itemId: member.item_id,
    userId: member.user_id,
    joinDate: member.join_date,
    picture: member.picture,
  } as Member;
};

export const parseBazaarResponse = async (response: any) => {
  if (response) {
    const metadata = await response.json().then((resp: any) => resp.data[0]);

    if (metadata) {
      return parseBazaarProject(metadata);
    }
  }
  return null;
};
