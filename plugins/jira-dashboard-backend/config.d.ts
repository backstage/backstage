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
export interface Config {
  /** Configuration options for the Jira Dashboard plugin */
  jira: {
    /**
     * The API token to authenticate towards Jira. It can be found by visiting Atlassians page at https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
     */
    token: string;

    /**
     * The base url for Jira in your company, including the API version. For instance: https://jira.se.your-company.com/rest/api/2/'
     */
    baseUrl: string;
  };
}
