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

import React, { FC, useEffect, useState } from 'react';
import {
  Content,
  Header,
  Page,
  pageTheme,
  Table,
  Progress,
  HeaderLabel,
  useApi,
} from '@backstage/core';

import { Link } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { gitOpsApiRef, Status } from '../../api';
import { transformRunStatus } from '../ProfileCatalog';

const ClusterPage: FC<{}> = () => {
  const params = useParams() as { owner: string; repo: string };
  const [loginInfo] = useLocalStorage<{
    token: string;
    username: string;
    name: string;
  }>('githubLoginDetails');

  const [pollingLog, setPollingLog] = useState(true);
  const [runStatus, setRunStatus] = useState<Status[]>([]);
  const [runLink, setRunLink] = useState<string>('');
  const [showProgress, setShowProgress] = useState(true);

  const api = useApi(gitOpsApiRef);

  const columns = [
    { field: 'status', title: 'Status' },
    { field: 'message', title: 'Message' },
  ];

  useEffect(() => {
    if (pollingLog) {
      const interval = setInterval(async () => {
        const resp = await api.fetchLog({
          gitHubToken: loginInfo.token,
          gitHubUser: loginInfo.username,
          targetOrg: params.owner,
          targetRepo: params.repo,
        });

        setRunStatus(resp.result);
        setRunLink(resp.link);
        if (resp.status === 'completed') {
          setPollingLog(false);
          setShowProgress(false);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [pollingLog, api, loginInfo, params]);

  return (
    <Page theme={pageTheme.home}>
      <Header title={`Cluster ${params.owner}/${params.repo}`}>
        <HeaderLabel label="Welcome" value={loginInfo.name} />
      </Header>
      <Content>
        <Progress hidden={!showProgress} />
        <Table
          options={{ search: false, paging: false, toolbar: false }}
          data={transformRunStatus(runStatus)}
          columns={columns}
        />
        <Link
          hidden={runLink === ''}
          rel="noopener noreferrer"
          href={`${runLink}?check_suite_focus=true`}
          target="_blank"
        >
          Details
        </Link>
      </Content>
    </Page>
  );
};

export default ClusterPage;
