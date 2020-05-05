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
import React, { FC, useState } from 'react';
import { Table, TableColumn } from '@backstage/core';
import { Website, lighthouseApiRef } from '../../api';
import { useInterval } from 'react-use';
import {
  formatTime,
  CATEGORIES,
  CATEGORY_LABELS,
  buildSparklinesDataForItem,
} from '../../utils';
import { TrendLine, useApi } from '@backstage/core';
import { Link } from '@material-ui/core';
import AuditStatusIcon from '../AuditStatusIcon';

export const AuditListTable: FC<{ items: Website[] }> = ({ items }) => {
  const [websiteState, setWebsiteState] = useState(items);
  const lighthouseApi = useApi(lighthouseApiRef);

  const runRefresh = async (website: Website) => {
    const response = await lighthouseApi.getWebsiteForAuditId(
      website.lastAudit.id,
    );
    const auditStatus = response.lastAudit.status;
    if (auditStatus === 'COMPLETED' || auditStatus === 'FAILED') {
      const newWebsiteData = websiteState.slice(0);
      newWebsiteData[
        newWebsiteData.findIndex((w) => w.url === response.url)
      ] = response;
      setWebsiteState(newWebsiteData);
    }
  };

  websiteState.forEach((website) => {
    useInterval(
      () => runRefresh(website),
      website?.lastAudit.status === 'RUNNING' ? 5000 : null,
    );
  });

  const columns: TableColumn[] = [
    {
      title: 'Website URL',
      field: 'websiteUrl',
    },
    ...CATEGORIES.map((category) => ({
      title: CATEGORY_LABELS[category],
      field: category,
    })),
    {
      title: 'Last Report',
      field: 'lastReport',
      cellStyle: {
        whiteSpace: 'nowrap',
      },
    },
    {
      title: 'Last Audit Triggered',
      field: 'lastAuditTriggered',
      cellStyle: {
        minWidth: 120,
      },
    },
  ];

  const data = websiteState.map((website) => {
    const trendlineData = buildSparklinesDataForItem(website);
    const trendlines: any = {};
    CATEGORIES.forEach((category) => {
      trendlines[category] = (
        <TrendLine
          title={`trendline for ${CATEGORY_LABELS[category]} category of ${website.url}`}
          data={trendlineData[category] || []}
        />
      );
    });

    return {
      websiteUrl: (
        <Link href={`/lighthouse/audit/${website.lastAudit.id}`}>
          {website.url}
        </Link>
      ),
      ...trendlines,
      lastReport: (
        <>
          <AuditStatusIcon audit={website.lastAudit} />{' '}
          <span>{website.lastAudit.status.toUpperCase()}</span>
        </>
      ),
      lastAuditTriggered: formatTime(website.lastAudit.timeCreated),
    };
  });

  return <Table columns={columns} data={data} />;
};

export default AuditListTable;
