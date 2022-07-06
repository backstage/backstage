/*
 * Copyright 2020 The Backstage Authors
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
import { KubernetesAuthTranslator } from './types';
import { GoogleKubernetesAuthTranslator } from './GoogleKubernetesAuthTranslator';
import { NoopKubernetesAuthTranslator } from './NoopKubernetesAuthTranslator';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';
import { GoogleServiceAccountAuthTranslator } from './GoogleServiceAccountAuthProvider';
import { AzureIdentityKubernetesAuthTranslator } from './AzureIdentityKubernetesAuthTranslator';
import { OidcKubernetesAuthTranslator } from './OidcKubernetesAuthTranslator';

export class KubernetesAuthTranslatorGenerator {
  static getKubernetesAuthTranslatorInstance(
    authProvider: string,
    options: {
      logger: Logger;
    },
  ): KubernetesAuthTranslator {
    switch (authProvider) {
      case 'google': {
        return new GoogleKubernetesAuthTranslator();
      }
      case 'aws': {
        return new AwsIamKubernetesAuthTranslator();
      }
      case 'azure': {
        return new AzureIdentityKubernetesAuthTranslator(options.logger);
      }
      case 'serviceAccount': {
        return new NoopKubernetesAuthTranslator();
      }
      case 'googleServiceAccount': {
        return new GoogleServiceAccountAuthTranslator();
      }
      case 'oidc': {
        return new OidcKubernetesAuthTranslator();
      }
      default: {
        throw new Error(
          `authProvider "${authProvider}" has no KubernetesAuthTranslator associated with it`,
        );
      }
    }
  }
}
