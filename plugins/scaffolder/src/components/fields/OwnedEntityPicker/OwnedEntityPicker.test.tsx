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

import { Entity } from '@backstage/catalog-model';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  BackstageUserIdentity,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { FieldProps } from '@rjsf/core';
import React from 'react';
import { OwnedEntityPicker } from './OwnedEntityPicker';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import { OwnedEntityPickerUiOptions } from './schema';

const makeEntity = (kind: string, namespace: string, name: string): Entity => ({
  apiVersion: 'backstage.io/v1beta1',
  kind,
  metadata: { namespace, name },
});

describe('<OwnedEntityPicker />', () => {
  let identity: BackstageUserIdentity;
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  let uiSchema: {
    'ui:options': OwnedEntityPickerUiOptions;
  };
  const rawErrors: string[] = [];
  const formData = undefined;

  let props: FieldProps;

  const identityApi = {
    getBackstageIdentity: jest.fn(async () => identity),
  } as Partial<IdentityApi> as jest.Mocked<IdentityApi>;

  const catalogApi = {
    getEntities: jest.fn(async () => ({ items: entities })),
  } as Partial<CatalogApi> as jest.Mocked<CatalogApi>;

  let Wrapper: React.ComponentType;

  beforeEach(() => {
    identity = {
      type: 'user',
      userEntityRef: 'User:default/max',
      ownershipEntityRefs: ['User:default/max'],
    };
    entities = [
      makeEntity('Group', 'default', 'team-a'),
      makeEntity('Group', 'default', 'squad-b'),
    ];

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

  describe('without allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps;

      identityApi.getBackstageIdentity.mockResolvedValue(identity);
      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for users and groups', async () => {
      await renderInTestApp(
        <Wrapper>
          <OwnedEntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: {
          'relations.ownedBy': ['User:default/max'],
        },
      });
    });
  });

  describe('with allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': { allowedKinds: ['User'] } };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps;

      identityApi.getBackstageIdentity.mockResolvedValue(identity);
      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for users', async () => {
      await renderInTestApp(
        <Wrapper>
          <OwnedEntityPicker {...props} />
        </Wrapper>,
      );
      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: {
          kind: ['User'],
          'relations.ownedBy': ['User:default/max'],
        },
      });
    });
  });

  describe('with nameTemplate', () => {
    beforeEach(() => {
      uiSchema = {
        'ui:options': {
          allowArbitraryValues: false,
          nameTemplate: 'XXX ${{entity.metadata.name}}',
        },
      };
      props = {
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown as FieldProps;

      identityApi.getBackstageIdentity.mockResolvedValue(identity);
      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('names should be resolved', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <OwnedEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');
      await userEvent.click(input);

      expect(screen.getByText('XXX team-a')).toBeInTheDocument();

      await userEvent.click(screen.getByText('XXX squad-b'));
      expect(onChange).toHaveBeenCalledWith('group:default/squad-b');
    });

    it('do not update if there is not an exact match', async () => {
      const { getByRole } = await renderInTestApp(
        <Wrapper>
          <OwnedEntityPicker {...props} />
        </Wrapper>,
      );

      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'squ' } });
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalledWith();
    });
  });
});
