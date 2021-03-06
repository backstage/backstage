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
import { AppContextV4I, AppContextV4, AppParamsV4 } from './v4';

export type AppParamsV3 = {
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

export interface AppContextV3I extends Omit<AppContextV4I, 'getComponents'> {
  getComponents: () => Record<string, FunctionComponent>;
}

export class AppContextV3 extends AppContextV4 implements AppContextV3I {
  getComponents() {
    const v3Components: Record<string, FunctionComponent> = {};

    for (const [name, { component }] of Object.entries(this.components)) {
      v3Components[name] = component;
    }

    return v3Components;
  }
}
