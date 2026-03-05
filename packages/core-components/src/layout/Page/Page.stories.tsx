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

import { wrapInTestApp } from '@backstage/test-utils';
import { Badge } from '../../components/ui/badge';
import { useState } from 'react';
import {
  GaugeCard,
  StatusOK,
  SupportButton,
  Table,
  TableColumn,
  TrendLine,
  Link,
} from '../../components';
import { Content } from '../Content';
import { ContentHeader } from '../ContentHeader';
import { Header } from '../Header';
import { HeaderLabel } from '../HeaderLabel';
import { HeaderTabs } from '../HeaderTabs';
import { InfoCard } from '../InfoCard';
import { Page } from '../Page';

export default {
  title: 'Plugins/Examples',
  component: Page,
  tags: ['!manifest'],
};

interface TableData {
  id: number;
  branch: string;
  hash: string;
  status: string;
}

const generateTestData = (rows = 10) => {
  const data: Array<TableData> = [];
  while (data.length <= rows) {
    data.push({
      id: data.length + 18534,
      branch: 'techdocs: modify documentation header',
      hash: 'techdocs/docs-header 5749c98e3f61f8bb116e5cb87b0e4e1 ',
      status: 'Success',
    });
  }
  return data;
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: true,
    type: 'numeric',
    width: '80px',
  },
  {
    title: 'Message/Source',
    highlight: true,
    render: (row: Partial<TableData>) => (
      <>
        <Link to="#message-source">{row.branch}</Link>
        <span className="text-sm text-muted-foreground">{row.hash}</span>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<TableData>) => (
      <div className="flex items-center gap-1">
        <StatusOK />
        <span className="text-sm">{row.status}</span>
      </div>
    ),
  },
  {
    title: 'Tags',
    render: () => <Badge variant="secondary">Tag Name</Badge>,
    width: '10%',
  },
];

const tabs = [
  { label: 'Overview' },
  { label: 'CI/CD' },
  { label: 'Cost Efficiency' },
  { label: 'Code Coverage' },
  { label: 'Test' },
  { label: 'Compliance Advisor' },
];

const DataGrid = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div className="space-y-4">
      <InfoCard title="Trend">
        <TrendLine data={[0.1, 0.5, 0.9, 1.0]} title="Trend over time" />
      </InfoCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GaugeCard
          title="GKE Usage Score"
          subheader="This should be above 75%"
          progress={0.87}
        />
        <GaugeCard
          title="Deployment Score"
          subheader="This should be above 40%"
          progress={0.58}
        />
      </div>
    </div>
    <InfoCard
      title="Additional Information"
      deepLink={{ title: 'Learn more about GKE', link: '' }}
    >
      <h6 className="text-base font-semibold">Rightsize GKE deployment</h6>
      <p className="mb-4">
        Services are considered underutilized in GKE when the average usage of
        requested cores is less than 80%.
      </p>
      <h6 className="text-base font-semibold">What can I do?</h6>
      <p className="mb-4">
        Review requested core and limit settings. Check HPA target scaling
        settings in{' '}
        <code className="font-mono text-sm bg-muted px-1 rounded">
          hpa.yaml
        </code>
        . The recommended value for&nbsp;
        <code className="font-mono text-sm bg-muted px-1 rounded">
          targetCPUUtilizationPercentage
        </code>{' '}
        is <code className="font-mono text-sm bg-muted px-1 rounded">80</code>.
      </p>
      <p className="mb-4">
        For single pods, there is of course no HPA. But it can also be useful to
        think about a single pod out of a larger deployment, then modify based
        on HPA requirements. Within a pod, each container has its own CPU and
        memory requests and limits.
      </p>
      <h6 className="text-base font-semibold">Definitions</h6>
      <p className="mb-4">
        A request is a minimum reserved value; a container will never have less
        than this amount allocated to it, even if it doesn't actually use it.
        Requests are used for determining what nodes to schedule pods on
        (bin-packing). The tension here is between not allocating resources we
        don't need, and having easy-enough access to enough resources to be able
        to function.
      </p>
      <p className="mb-4">
        Contact <Link to="#cost-awareness">#cost-awareness</Link> for
        information and support.
      </p>
    </InfoCard>
  </div>
);

const ExampleHeader = () => (
  <Header title="Example" subtitle="This is an example plugin">
    <HeaderLabel label="Owner" value="Owner" />
    <HeaderLabel label="Lifecycle" value="Lifecycle" />
  </Header>
);

const ExampleContentHeader = ({ selectedTab }: { selectedTab?: number }) => (
  <ContentHeader
    title={selectedTab !== undefined ? tabs[selectedTab].label : 'Header'}
  >
    <SupportButton>
      This Plugin is an example. This text could provide useful information for
      the user.
    </SupportButton>
  </ContentHeader>
);

export const PluginWithData = () => {
  const [selectedTab, setSelectedTab] = useState<number>(2);
  return wrapInTestApp(() => (
    <div className="border border-border">
      <Page themeId="tool">
        <ExampleHeader />
        <HeaderTabs
          selectedIndex={selectedTab}
          onChange={index => setSelectedTab(index)}
          tabs={tabs.map(({ label }, index) => ({
            id: index.toString(),
            label,
          }))}
        />
        <Content>
          <ExampleContentHeader selectedTab={selectedTab} />
          <DataGrid />
        </Content>
      </Page>
    </div>
  ));
};

export const PluginWithTable = () => {
  return wrapInTestApp(() => (
    <div className="border border-border">
      <Page themeId="tool">
        <ExampleHeader />
        <Content>
          <ExampleContentHeader />
          <Table
            options={{ paging: true, padding: 'dense' }}
            data={generateTestData(10)}
            columns={columns}
            title="Example Content"
          />
        </Content>
      </Page>
    </div>
  ));
};
