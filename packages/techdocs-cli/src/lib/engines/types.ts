/*
 * Copyright 2026 The Backstage Authors
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

import http from 'node:http';

export type ServeOptions = {
  configFile?: string;
  clean?: boolean;
  dirtyReload?: boolean;
  strict?: boolean;
  useDocker?: boolean;
};

export type EngineConfig = {
  binary: string;
  defaultImage: string;
  serveCommand: string;
  startupLogPattern: string;
  buildArgs(outputDir: string, configFile: string): string[];
  serveArgs(port: string, options: ServeOptions): string[];
  /** Rewrites the config before serving so preview matches published output. */
  prepareServeConfig?(
    configPath: string,
    logger: { info(message: string): void },
  ): Promise<{ configPath: string; cleanup(): void }>;
  transformHtml(html: string): string;
  handleReloadRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    targetAddress: string,
    onError: (error: Error) => void,
  ): void;
};
