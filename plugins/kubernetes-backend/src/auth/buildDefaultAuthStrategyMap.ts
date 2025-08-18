/*
 * Copyright 2025 The Backstage Authors
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
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { AuthenticationStrategy } from '@backstage/plugin-kubernetes-node';
import { AksStrategy } from './AksStrategy';
import { AwsIamStrategy } from './AwsIamStrategy';
import { AzureIdentityStrategy } from './AzureIdentityStrategy';
import { GoogleStrategy } from './GoogleStrategy';
import { GoogleServiceAccountStrategy } from './GoogleServiceAccountStrategy';
import { AnonymousStrategy } from './AnonymousStrategy';
import { OidcStrategy } from './OidcStrategy';
import { ServiceAccountStrategy } from './ServiceAccountStrategy';

export const buildDefaultAuthStrategyMap = ({
  logger,
  config,
}: {
  logger: LoggerService;
  config: RootConfigService;
}): Map<string, AuthenticationStrategy> =>
  new Map([
    ['aks', new AksStrategy()],
    ['aws', new AwsIamStrategy({ config })],
    ['azure', new AzureIdentityStrategy(logger)],
    ['google', new GoogleStrategy()],
    ['googleServiceAccount', new GoogleServiceAccountStrategy({ config })],
    ['localKubectlProxy', new AnonymousStrategy()],
    ['oidc', new OidcStrategy()],
    ['serviceAccount', new ServiceAccountStrategy()],
  ]);
