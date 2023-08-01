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
export type GerritChange = {
  subject: string;
  owner: {
    _account_id: string;
    name: string;
  };
  reviewers: {
    REVIEWER: [];
  };
  project: string;
  branch: string;
  created: string;
  updated: string;
  status: string;
  change_id: string;
  _number: string;
  total_comment_count: string;
  unresolved_comment_count: string;
  insertions: 0;
  deletions: 0;
  labels: {
    'Code-Review': { approved: string };
    'Commit-Message': { approved: string };
    Verified: { approved: string };
  };
};

export type DenseTableProps = {
  gerritChangesList: GerritChange[];
  tableTitle: any;
  repoView?: boolean;
};

export type GerritReviewProps = {
  request: string;
  tableTitle: string;
};
