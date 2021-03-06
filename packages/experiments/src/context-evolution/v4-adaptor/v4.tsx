/*
 * Copyright 2021 Spotify AB
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
import { FunctionComponent } from 'react';

type Metadata = { remoteRender: boolean };

export type AppParamsV4 = {
  icons: Record<string, FunctionComponent>;
  components: Record<
    string,
    { component: FunctionComponent; metadata: Metadata }
  >;
};

export interface AppContextV4I {
  getComponents: () => Record<
    string,
    { component: FunctionComponent; metadata: Metadata }
  >;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV4 implements AppContextV4I {
  icons: AppParamsV4['icons'];
  components: AppParamsV4['components'];

  constructor(params: AppParamsV4) {
    this.icons = params.icons;
    this.components = params.components;
  }

  getComponents() {
    return this.components;
  }

  getIcon(icon: string) {
    return this.icons[icon];
  }
}
