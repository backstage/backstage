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
import { faker } from '@faker-js/faker';
import { Issue } from '../api';

export const generateTestIssue = (
  overwrites: Partial<Issue> = {},
): { node: Issue } => ({
  node: {
    ...{
      assignees: {
        edges: [
          {
            node: {
              avatarUrl: faker.internet.avatar(),
              login: `${faker.word.adjective()}-${faker.animal.type()}`,
            },
          },
        ],
      },
      author: {
        login: `${faker.word.adjective()}-${faker.animal.type()}`,
      },
      repository: {
        nameWithOwner: `${faker.animal.type()}/${faker.animal.type()}`,
      },
      title: faker.lorem.words(3),
      url: faker.internet.url(),
      participants: {
        totalCount: +faker.random.numeric(),
      },
      updatedAt: faker.date.past().toISOString(),
      createdAt: faker.date.past().toISOString(),
      comments: {
        totalCount: +faker.random.numeric(),
      },
    },
    ...overwrites,
  },
});
