/*
 * Copyright 2020 The Backstage Authors
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
import React, { ReactNode } from 'react';
import { AuditListTable } from './AuditListTable';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import { LIGHTHOUSE_WEBSITE_URL_ANNOTATION } from '../../../constants';
import {
  Content,
  ContentHeader,
  InfoCard,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { Button } from '@material-ui/core';
import { resolvePath, useNavigate } from 'react-router-dom';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../plugin';
import LighthouseSupportButton from '../SupportButton';

export const AuditListForEntity = () => {
  const { value, loading, error } = useWebsiteForEntity();
  const { entity } = useEntity();
  const navigate = useNavigate();
  const fromPath = useRouteRef(rootRouteRef)?.() ?? '../';

  let createAuditButtonUrl = 'create-audit';
  const websiteUrl =
    entity.metadata.annotations?.[LIGHTHOUSE_WEBSITE_URL_ANNOTATION] ?? '';
  if (websiteUrl) {
    createAuditButtonUrl += `?url=${encodeURIComponent(websiteUrl)}`;
  }

  let content: ReactNode = null;
  content = (
    <Content>
      <ContentHeader title="Latest Audit">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(resolvePath(createAuditButtonUrl, fromPath))}
        >
          Create New Audit
        </Button>
        <LighthouseSupportButton />
      </ContentHeader>
      <AuditListTable items={value ? [value] : []} />
    </Content>
  );

  if (loading) {
    content = <Progress />;
  }
  if (error && !error.message.includes('no audited website found for url')) {
    // We only want to display this warning panel when its caused by an error other than no audits for the website
    content = (
      <WarningPanel severity="error" title="Could not load audit list.">
        {error.message}
      </WarningPanel>
    );
  }

  return <InfoCard noPadding>{content}</InfoCard>;
};
