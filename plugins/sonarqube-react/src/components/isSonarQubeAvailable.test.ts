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

import { Entity } from '@backstage/catalog-model';
import {
  isSonarQubeAvailable,
  SONARQUBE_PROJECT_KEY_ANNOTATION,
} from './isSonarQubeAvailable';

const createDummyEntity = (sonarqubeAnnotationValue: string): Entity => {
  return {
    apiVersion: '',
    kind: '',
    metadata: {
      name: 'dummy',
      annotations: {
        [SONARQUBE_PROJECT_KEY_ANNOTATION]: sonarqubeAnnotationValue,
      },
    },
  };
};

describe('isSonarQubeAvailable', () => {
  it('returns true if sonarqube annotation defined', () => {
    const entity = createDummyEntity('dummy');
    expect(isSonarQubeAvailable(entity)).toBe(true);
  });

  it('returns false if sonarqube annotation empty', () => {
    const entity = createDummyEntity('');
    expect(isSonarQubeAvailable(entity)).toBe(false);
  });

  it('returns false if sonarqube annotation not defined', () => {
    const entity = {
      apiVersion: '',
      kind: '',
      metadata: {
        name: 'dummy',
        annotations: {},
      },
    };
    expect(isSonarQubeAvailable(entity)).toBe(false);
  });
});
