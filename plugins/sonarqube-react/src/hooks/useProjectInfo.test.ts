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
import { SONARQUBE_PROJECT_KEY_ANNOTATION } from '../components';
import { useProjectInfo } from './useProjectInfo';
import { SONARQUBE_PROJECT_INSTANCE_SEPARATOR } from './useProjectInfo';

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

describe('useProjectInfo', () => {
  const DUMMY_INSTANCE = 'dummyInstance';
  const DUMMY_KEY = 'dummyKey';

  it('parse annotation with key and instance', () => {
    const entity = createDummyEntity(
      DUMMY_INSTANCE + SONARQUBE_PROJECT_INSTANCE_SEPARATOR + DUMMY_KEY,
    );
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: DUMMY_INSTANCE,
      projectKey: DUMMY_KEY,
    });
  });

  it('parse annotation with instance, tenant/project-key', () => {
    const DUMMY_KEY_WITH_TENANT = 'dummy-tenant/dummyKey';
    const entity = createDummyEntity(
      DUMMY_INSTANCE +
        SONARQUBE_PROJECT_INSTANCE_SEPARATOR +
        DUMMY_KEY_WITH_TENANT,
    );
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: DUMMY_INSTANCE,
      projectKey: DUMMY_KEY_WITH_TENANT,
    });
  });

  it('parse annotation with instance, tenant:project-key', () => {
    const DUMMY_KEY_WITH_TENANT = 'dummy-tenant:dummyKey';
    const entity = createDummyEntity(
      DUMMY_INSTANCE +
        SONARQUBE_PROJECT_INSTANCE_SEPARATOR +
        DUMMY_KEY_WITH_TENANT,
    );
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: DUMMY_INSTANCE,
      projectKey: DUMMY_KEY_WITH_TENANT,
    });
  });

  // compatibility with previous mono-instance sonarqube config
  it('parse annotation with only key', () => {
    const entity = createDummyEntity(DUMMY_KEY);
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: undefined,
      projectKey: DUMMY_KEY,
    });
  });

  it('handle empty annotation', () => {
    const entity = createDummyEntity('');
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: undefined,
      projectKey: undefined,
    });
  });

  it('handle non-existent annotation', () => {
    const entity = {
      apiVersion: '',
      kind: '',
      metadata: {
        name: 'dummy',
        annotations: {},
      },
    };
    expect(useProjectInfo(entity)).toEqual({
      projectInstance: undefined,
      projectKey: undefined,
    });
  });
});
