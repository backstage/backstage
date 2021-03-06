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
import { AppParamsV2 } from './v2';

export type AppParamsV3 = {
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
  plugins: Plugin[]; // for backward compat reasons
};

export interface AppContextV3I {
  getComponents: () => Record<string, FunctionComponent>;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV3 implements AppContextV3I {
  icons: AppParamsV3['icons'];
  components: AppParamsV3['components'];
  plugins: AppParamsV2['plugins']; // for backward compat reasons

  constructor(params: AppParamsV3) {
    this.icons = params.icons;
    this.components = params.components;
    this.plugins = params.plugins; // not used, but is still here
  }

  getComponents() {
    return this.components;
  }

  getIcon(icon: string) {
    return this.icons[icon];
  }
}
