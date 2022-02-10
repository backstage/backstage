/*
 * Copyright 2022 The Backstage Authors
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
import { Logger } from 'winston';
import { CustomErrorBase } from '@backstage/errors';
import { AnyDependencyConfig } from '@backstage/app-context-common';

export type AppContextFactoryOptions = {
  logger: Logger;
  rootDependencies: AnyDependencyConfig[];
};

export class DependencyNotBoundError extends CustomErrorBase {}
