/*
 * Copyright 2021 The Backstage Authors
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
import { Tabs, Tab } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';

type TabType = {
  label: string;
  Component: () => JSX.Element;
};

export const ComponentTabs = ({
  title,
  tabs,
}: {
  title: string;
  tabs: TabType[];
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <InfoCard title={title}>
      <Tabs value={value} onChange={handleChange}>
        {tabs.map(t => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      {tabs.map(({ Component }, idx) => (
        <div {...(idx === value ? { style: { display: 'none' } } : {})}>
          <Component />
        </div>
      ))}
    </InfoCard>
  );
};
