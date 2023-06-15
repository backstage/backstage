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

import { type EntityFilterQuery } from '@backstage/catalog-client';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { FieldProps } from '@rjsf/core';
import React from 'react';
import { OwnedEntityPicker } from './OwnedEntityPicker';
import {
  BackstageUserIdentity,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

const makeEntity = (kind: string, namespace: string, name: string): Entity => ({
  apiVersion: 'backstage.io/v1beta1',
  kind,
  metadata: { namespace, name },
});

const makeIdentity = (
  userEntityRef: string,
  ownershipEntityRefs: string[],
  type: 'user',
) => ({
  type,
  userEntityRef,
  ownershipEntityRefs,
});

describe('<OwnedEntityPicker />', () => {
  let entities: Entity[];
  let identity: BackstageUserIdentity;
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  let uiSchema: {
    'ui:options': {
      allowedKinds?: string[];
      defaultKind?: string;
      allowArbitraryValues?: boolean;
      defaultNamespace?: string | false;
      catalogFilter?: EntityFilterQuery;
    };
  };
  const rawErrors: string[] = [];
  const formData = undefined;

  let props: FieldProps;

  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(async () => ({ items: entities })),
    addLocation: jest.fn(),
    getLocationByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
  } as any;
  const identityApi: jest.Mocked<IdentityApi> = {
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(async () => ({ items: entities })),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    entities = [
      makeEntity('Group', 'default', 'team-a'),
      makeEntity('Group', 'default', 'squad-b'),
    ];
    identity = makeIdentity('', [''], 'user');

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider
        apis={[
          [identityApiRef, identityApi],
          [catalogApiRef, catalogApi],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  describe('without catalogFilter and allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps<any>;

      catalogApi.getEntities.mockResolvedValue({ items: entities });
      identityApi.getBackstageIdentity.mockResolvedValue(identity);
    });

    it('searches for users and groups', async () => {
      await renderInTestApp(
        <Wrapper>
          <OwnedEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: {
          [`relations.${RELATION_OWNED_BY}`]: identity.ownershipEntityRefs,
        },
      });
    });
  });
});
