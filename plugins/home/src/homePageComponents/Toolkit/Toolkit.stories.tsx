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

import { InfoCard } from '@backstage/core-components';
import { wrapInTestApp } from '@backstage/test-utils';
import { Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { ComponentAccordion } from '../../componentRenderers';
import { HomePageToolkit } from '../../plugin';
import { TemplateBackstageLogoIcon } from '../../assets';

export default {
  title: 'Plugins/Home/Components/Toolkit',
  decorators: [(Story: ComponentType<{}>) => wrapInTestApp(<Story />)],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageToolkit
        tools={Array(8).fill({
          url: '#',
          label: 'link',
          icon: <TemplateBackstageLogoIcon />,
        })}
      />
    </Grid>
  );
};

export const InAccordian = () => {
  const ExpandedComponentAccordion = (props: any) => (
    <ComponentAccordion expanded {...props} />
  );

  return (
    <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit
          title="Tools 1"
          tools={Array(8).fill({
            url: '#',
            label: 'link',
            icon: <TemplateBackstageLogoIcon />,
          })}
          Renderer={ExpandedComponentAccordion}
        />
        <HomePageToolkit
          title="Tools 2"
          tools={Array(8).fill({
            url: '#',
            label: 'link',
            icon: <TemplateBackstageLogoIcon />,
          })}
          Renderer={ComponentAccordion}
        />
        <HomePageToolkit
          title="Tools 3"
          tools={Array(8).fill({
            url: '#',
            label: 'link',
            icon: <TemplateBackstageLogoIcon />,
          })}
          Renderer={ComponentAccordion}
        />
      </Grid>
    </InfoCard>
  );
};
