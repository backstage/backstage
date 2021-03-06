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
import { AppContextV3, AppContextV3I, AppParamsV3 } from './v3';

type Plugin = { name: string };
type AppParamsV2 = AppParamsV3 & { plugins: Plugin[] };

export interface AppContextV2I extends AppContextV3I {
  getPlugins: () => Plugin[];
}

export class AppContextV2 extends AppContextV3 implements AppContextV2I {
  plugins: Plugin[];

  constructor(params: AppParamsV2) {
    super(params);

    this.plugins = params.plugins;
  }

  /** @deprecated */
  getPlugins() {
    return this.plugins;
  }
}
