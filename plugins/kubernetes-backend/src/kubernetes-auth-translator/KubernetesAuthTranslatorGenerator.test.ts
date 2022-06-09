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

import { KubernetesAuthTranslator } from './types';
import { GoogleKubernetesAuthTranslator } from './GoogleKubernetesAuthTranslator';
import { KubernetesAuthTranslatorGenerator } from './KubernetesAuthTranslatorGenerator';
import { NoopKubernetesAuthTranslator } from './NoopKubernetesAuthTranslator';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';
import { OidcKubernetesAuthTranslator } from './OidcKubernetesAuthTranslator';
import { getVoidLogger } from '@backstage/backend-common';

const logger = getVoidLogger();

describe('getKubernetesAuthTranslatorInstance', () => {
  const sut = KubernetesAuthTranslatorGenerator;

  it('can return an auth translator for google auth', () => {
    const authTranslator: KubernetesAuthTranslator =
      sut.getKubernetesAuthTranslatorInstance('google', { logger });
    expect(authTranslator instanceof GoogleKubernetesAuthTranslator).toBe(true);
  });

  it('can return an auth translator for aws auth', () => {
    const authTranslator: KubernetesAuthTranslator =
      sut.getKubernetesAuthTranslatorInstance('aws', { logger });
    expect(authTranslator instanceof AwsIamKubernetesAuthTranslator).toBe(true);
  });

  it('can return an auth translator for serviceAccount auth', () => {
    const authTranslator: KubernetesAuthTranslator =
      sut.getKubernetesAuthTranslatorInstance('serviceAccount', { logger });
    expect(authTranslator instanceof NoopKubernetesAuthTranslator).toBe(true);
  });

  it('can return an auth translator for oidc auth', () => {
    const authTranslator: KubernetesAuthTranslator =
      sut.getKubernetesAuthTranslatorInstance('oidc', { logger });
    expect(authTranslator instanceof OidcKubernetesAuthTranslator).toBe(true);
  });

  it('throws an error when asked for an auth translator for an unsupported auth type', () => {
    expect(() =>
      sut.getKubernetesAuthTranslatorInstance('linode', { logger }),
    ).toThrow(
      'authProvider "linode" has no KubernetesAuthTranslator associated with it',
    );
  });
});
