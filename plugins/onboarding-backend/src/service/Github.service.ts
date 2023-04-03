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

import axios from 'axios';
import { base64YamlToJSON } from './util';

export class GithubService {
  baseRepo = '';
  constructor(props: { baseRepo: string }) {
    this.baseRepo = props.baseRepo;
  }
  async getGithubData() {
    try {
      const response = await axios(this.baseRepo, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (response.status === 200) {
        return await response.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  }
  async GetUserAndChecklistBlob() {
    try {
      const response = await this.getGithubData();
      const finalResponse: {
        group: string;
        title: string;
        checklist_uid: string;
        formSchema: string;
        forRoles: string;
        checklistHash: string;
      }[] = [];
      const checklistBlobUrl: string[] = [];
      if (response?.tree?.length) {
        response.tree.forEach(({ path, url }: any) => {
          if (path) {
            const checklist = path.split('/')[1];
            if (checklist === 'checklist.yaml') {
              checklistBlobUrl.push(url);
            }
          }
        });
      }
      if (checklistBlobUrl?.length) {
        const resData = await Promise.all(
          checklistBlobUrl.map(async (url: string) => {
            const resApi = await axios(url, {
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28',
              },
            });
            return await resApi.data;
          }),
        );
        resData.forEach(({ sha: groupHash, content, encoding }) => {
          const checklists = base64YamlToJSON(content, encoding);
          checklists.forEach(
            (val: {
              metadata: { group: string };
              checklists: {
                title: string;
                id: string;
                checklistItems: any[];
                forRoles: string[];
              }[];
            }) => {
              let finalGroup: string = '';
              finalGroup = val.metadata.group;
              val.checklists.forEach(
                (res_data: {
                  title: string;
                  id: string;
                  checklistItems: any[];
                  forRoles: string[];
                }) => {
                  const finalRes: any = {
                    group: finalGroup,
                    title: res_data.title,
                    checklist_uid: res_data.id,
                    formSchema: JSON.stringify(res_data.checklistItems),
                    forRoles: res_data.forRoles.join(','),
                    groupHash,
                  };
                  finalResponse.push(finalRes);
                },
              );
            },
          );
        });
      }
      return finalResponse;
    } catch (error) {
      return [];
    }
  }
}
