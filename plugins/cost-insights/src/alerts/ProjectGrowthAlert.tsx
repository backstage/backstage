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

import React from 'react';
import { ProjectGrowthAlertCard } from '../components/ProjectGrowthAlertCard';
import { Alert, AlertOptions, ProjectGrowthData } from '../types';

// Override abstract classes defaults via options
interface ProjectGrowthAlertOptions {
  data: ProjectGrowthData; // abstract class requires data to render default UI
  title?: string;
  subtitle?: string;
}

// Convert ProjectGrowthAlert to an abstract class
abstract class AbstractProjectGrowthAlert implements Alert {
  data: ProjectGrowthData;
  title: string;
  subtitle: string;

  constructor(options: ProjectGrowthAlertOptions) {
    this.data = options.data;
    this.title =
      options.title ??
      `Investigate project cost growth in ${options.data.project}`;
    this.subtitle =
      options.subtitle ??
      'Cost growth outpacing business growth is unsustainable long-term.';
  }

  get element() {
    return <ProjectGrowthAlertCard alert={this.data} />;
  }
}

// Hmm. Losing type safety here since the class doesn't directly extend Alert :(
export class ProjectGrowthAlert extends AbstractProjectGrowthAlert {
  async onDismissed(options: AlertOptions): Promise<Alert[]> {
    return Promise.resolve([]);
  }
}
