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
import React from 'react';
import { Page, Content } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { IncidentsReportsTable, AlertsReportsTable } from './ReportsTables';
import { CORTEX_XDR_ANNOTATION } from '../../constants';

/**
 * Component to display Cortex incidents.
 *
 * @public
 */
export const IncidentsReportsPage = () => {
  const { entity } = useEntity();
  const ip = entity?.metadata?.annotations?.[CORTEX_XDR_ANNOTATION] ?? '';
  return (
    <Page themeId="tool">
      <Content>
        <IncidentsReportsTable ip={ip} />
      </Content>
    </Page>
  );
};

/**
 * Component to display Cortex Alerts.
 *
 * @public
 */
export const AlertsReportsPage = () => {
  const { entity } = useEntity();
  const ip = entity?.metadata?.annotations?.[CORTEX_XDR_ANNOTATION] ?? '';
  return (
    <Page themeId="tool">
      <Content>
        <AlertsReportsTable ip={ip} />
      </Content>
    </Page>
  );
};
