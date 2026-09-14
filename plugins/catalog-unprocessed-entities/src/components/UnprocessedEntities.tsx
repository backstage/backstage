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
import { Page, Header, Content } from '@backstage/core-components';
import {
  Header as UiHeader,
  Tabs,
  Tab,
  TabList,
  TabPanel,
} from '@backstage/ui';

import { FailedEntities } from './FailedEntities';
import { PendingEntities } from './PendingEntities';

/** @public */
export const UnprocessedEntitiesContent = () => {
  return (
    <Tabs defaultSelectedKey="failed">
      <TabList>
        <Tab id="failed">Failed</Tab>
        <Tab id="pending">Pending</Tab>
      </TabList>
      <TabPanel id="failed">
        <FailedEntities />
      </TabPanel>
      <TabPanel id="pending">
        <PendingEntities />
      </TabPanel>
    </Tabs>
  );
};

export const UnprocessedEntities = () => {
  return (
    <Page themeId="tool">
      <Header title="Unprocessed Entities" />
      <Content>
        <UnprocessedEntitiesContent />
      </Content>
    </Page>
  );
};

export const NfsUnprocessedEntities = () => {
  return (
    <>
      <UiHeader title="Unprocessed Entities" />
      <Content>
        <UnprocessedEntitiesContent />
      </Content>
    </>
  );
};
