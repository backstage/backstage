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
/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable no-unused-vars*/
import React, { FC, useState, useEffect } from 'react';
import { useInterval, useBoolean } from 'react-use';
import { Website, lighthouseApiRef } from '../../api';
import { useApi } from '@backstage/core';
import {
  SparklinesDataByCategory,
  buildSparklinesDataForItem,
} from '../../utils';
import { AuditListRow } from './AuditListRow';
export const LIMIT = 10;

export const Audit: FC<{
  website: Website;
  categorySparkline: SparklinesDataByCategory;
}> = ({ website, categorySparkline }) => {
  const lighthouseApi = useApi(lighthouseApiRef);
  const fetchWebsite = async (auditId: string) => {
    const response = await lighthouseApi.getWebsiteForAuditId(auditId);
    console.log(`Real response: ${response.lastAudit.status}`);
    return response;
  };
  const [delay] = useState(5000);
  const [isIntervalRunning, toggleInterval] = useBoolean(false);
  const [websiteState, setWebsiteState] = useState(website);
  const [counter, setCounter] = useState(1);
  const [audit, setAudit] = useState(
    <AuditListRow website={website} categorySparkline={categorySparkline} />,
  );


  useEffect(() => {
    if (websiteState.lastAudit.status === 'RUNNING') {
      toggleInterval(true);
    } else toggleInterval(false);
  });

  useInterval(
    async () => {
      const resWebsite = await fetchWebsite(website.lastAudit.id);
      const auditStatus = resWebsite.lastAudit.status;
      console.log(
        `Website ${website.url} is running. Response: ${auditStatus}, intervalRunning: ${isIntervalRunning}, count" ${counter} `,
      );
      setCounter(counter + 1);
      if (auditStatus === 'COMPLETED' || auditStatus === 'FAILED') {
        toggleInterval(false);
        const rebuiltCategorySparkline = buildSparklinesDataForItem(resWebsite);
        setWebsiteState(resWebsite);
        setAudit(
          <Audit website={resWebsite} categorySparkline={rebuiltCategorySparkline} />
        );
      }
    },
    isIntervalRunning ? delay : null,
  );
  return audit;
};

export default Audit;
