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
import { TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY } from '@backstage/plugin-techdocs-node';
import type { EngineSource } from './catalogEntity';
import {
  injectLivereloadParameters,
  proxyMkdocsLivereload,
} from './livereload';

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
  transformHtml(html: string): string;
  handleReloadRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    targetAddress: string,
    onError: (error: Error) => void,
  ): void;
};

const mkdocsConfig: EngineConfig = {
  binary: 'mkdocs',
  defaultImage: 'spotify/techdocs',
  serveCommand: 'serve',
  startupLogPattern: 'Serving on',
  buildArgs(outputDir: string, configFile: string): string[] {
    return ['build', '-f', configFile, '-d', outputDir, '-v'];
  },
  serveArgs(port: string, options: ServeOptions): string[] {
    const addr = options.useDocker ? `0.0.0.0:${port}` : `127.0.0.1:${port}`;
    return [
      'serve',
      '--dev-addr',
      addr,
      '--livereload',
      ...(options.configFile ? ['--config-file', options.configFile] : []),
      ...(options.clean ? ['--clean'] : []),
      ...(options.dirtyReload ? ['--dirtyreload'] : []),
      ...(options.strict ? ['--strict'] : []),
    ];
  },
  transformHtml(html: string): string {
    return injectLivereloadParameters(html);
  },
  handleReloadRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    targetAddress: string,
    onError: (error: Error) => void,
  ): void {
    proxyMkdocsLivereload({
      request: req,
      response: res,
      mkdocsTargetAddress: targetAddress,
      onError,
    });
  },
};

const engineConfigs: Record<string, EngineConfig> = {
  mkdocs: mkdocsConfig,
};

export function getEngineConfig(
  engine: string,
  source: EngineSource = 'default',
): EngineConfig {
  const config = engineConfigs[engine];
  if (!config) {
    const supported = Object.keys(engineConfigs).join(', ');
    const origin = {
      flag: 'from --engine',
      annotation: `from the ${TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY} annotation in catalog-info.yaml`,
      default: 'default',
    }[source];
    const hint = source === 'annotation' ? ' Pass --engine to override.' : '';
    throw new Error(
      `Engine "${engine}" (${origin}) is not supported by techdocs-cli. Supported engines: ${supported}.${hint}`,
    );
  }
  return config;
}
