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

type Plugin = { name: string };

type AppParams = {
  plugins: Plugin[];
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

interface AppContextV1I {
  getPlugins: () => Plugin[];
  getComponents: () => Record<string, FunctionComponent>;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV1 implements AppContextV1I {
  plugins: AppParams['plugins'];
  icons: AppParams['icons'];
  components: AppParams['components'];

  constructor(params: AppParams) {
    this.plugins = params.plugins;
    this.icons = params.icons;
    this.components = params.components;
  }

  getPlugins() {
    return this.plugins;
  }

  getComponents() {
    return this.components;
  }

  getIcon(icon: string) {
    return this.icons[icon];
  }
}
