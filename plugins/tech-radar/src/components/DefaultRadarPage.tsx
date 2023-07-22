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
import { RadarComponent } from './RadarComponent';
import { RadarLayout } from './RadarLayout/RadarLayout';
import { RadarTablePage } from './RadarTable';
import { TechRadarPageProps } from './types';

/**
 * Main Page of Tech Radar
 *
 * @public
 */
export function DefaultRadarPage(props: TechRadarPageProps) {
  const {
    title = 'Tech Radar',
    subtitle = 'Pick the recommended technologies for your projects',
  } = props;
  return (
    <RadarLayout title={title} subtitle={subtitle}>
      <RadarLayout.Route path="/" title="Radar">
        <RadarComponent {...props} />
      </RadarLayout.Route>
      <RadarLayout.Route path="search" title="Search">
        <RadarTablePage />
      </RadarLayout.Route>
    </RadarLayout>
  );
}
