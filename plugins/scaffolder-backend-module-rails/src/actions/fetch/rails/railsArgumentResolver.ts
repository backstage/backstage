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
import { sep as separatorPath } from 'path';

enum Webpacker {
  react = 'react',
  vue = 'vue',
  angular = 'angular',
  elm = 'elm',
  stimulus = 'stimulus',
}

enum Database {
  mysql = 'mysql',
  postgresql = 'postgresql',
  sqlite3 = 'sqlite3',
  oracle = 'oracle',
  sqlserver = 'sqlserver',
  jdbcmysql = 'jdbcmysql',
  jdbcsqlite3 = 'jdbcsqlite3',
  jdbcpostgresql = 'jdbcpostgresql',
  jdbc = 'jdbc',
}

enum RailsVersion {
  dev = 'dev',
  edge = 'edge',
  master = 'master',
  fromImage = 'fromImage',
}

export type RailsRunOptions = {
  minimal?: boolean;
  api?: boolean;
  template?: string;
  webpacker?: Webpacker;
  database?: Database;
  railsVersion?: RailsVersion;
  skipBundle?: boolean;
  skipWebpackInstall?: boolean;
};

export const railsArgumentResolver = (
  projectRoot: string,
  options: RailsRunOptions,
  executionOnContainer = false,
): string[] => {
  const argumentsToRun: string[] = [];

  if (options?.minimal) {
    argumentsToRun.push('--minimal');
  }

  if (options?.api) {
    argumentsToRun.push('--api');
  }

  if (options?.skipBundle) {
    argumentsToRun.push('--skip-bundle');
  }

  if (options?.skipWebpackInstall) {
    argumentsToRun.push('--skip-webpack-install');
  }

  if (
    options?.webpacker &&
    Object.values(Webpacker).includes(options?.webpacker as Webpacker)
  ) {
    argumentsToRun.push('--webpack');
    argumentsToRun.push(options.webpacker);
  }

  if (
    options?.database &&
    Object.values(Database).includes(options?.database as Database)
  ) {
    argumentsToRun.push('--database');
    argumentsToRun.push(options.database);
  }

  if (
    options?.railsVersion !== RailsVersion.fromImage &&
    Object.values(RailsVersion).includes(options?.railsVersion as RailsVersion)
  ) {
    argumentsToRun.push(`--${options.railsVersion}`);
  }

  if (options?.template) {
    argumentsToRun.push('--template');
    argumentsToRun.push(
      options.template.replace(
        `.${separatorPath}`,
        `${projectRoot}${executionOnContainer ? '/' : separatorPath}`,
      ),
    );
  }

  return argumentsToRun;
};
