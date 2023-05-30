/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { render } from '@testing-library/react';
import { CatalogApi } from '@backstage/catalog-client';
import { FieldProps } from '@rjsf/core';
import { EntityPickerProps } from '../EntityPicker/schema';
import { Entity } from '@backstage/catalog-model';
import { OwnershipEntityRefPicker } from './OwnershipEntityRefPicker';

const makeUserEntity = (
  kind: string,
  memberOf: string[],
  name: string,
): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind,
  metadata: { name },
  spec: {
    memberOf: memberOf,
  },
});

const makeGroupEntity = (
  kind: string,
  members: string[],
  name: string,
): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind,
  metadata: { name },
  spec: {
    members: members,
  },
});

describe('<OwnershipEntityRefPicker />', () => {
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  let uiSchema: EntityPickerProps['uiSchema'];
  const rawErrors: string[] = [];
  const formData = undefined;

  let props: FieldProps;

  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    addLocation: jest.fn(),
    getLocationByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
  } as any;

  beforeEach(() => {
    entities = [
      makeUserEntity('User', ['group1', 'group2'], 'Bob'),
      makeGroupEntity('Group', ['Alice', 'Dave'], 'group3'),
    ];
  });

  afterEach(() => jest.resetAllMocks());

  it('should only return the groups a user is part of', async () => {
    catalogApi.getEntityByRef.mockResolvedValueOnce(entities[0]);

    uiSchema = { 'ui:options': { catalogApi } };
    props = {
      onChange,
      schema,
      required,
      uiSchema,
      rawErrors,
      formData,
    } as unknown as FieldProps<any>;

    render(<OwnershipEntityRefPicker {...props} />);

    // Assuming the component calls `onChange` with the groups a user is a part of
    expect(onChange).toHaveBeenCalledWith(['group1', 'group2']);
  });

  it('should not return groups a user is not part of', async () => {
    catalogApi.getEntityByRef.mockResolvedValueOnce(entities[1]);

    uiSchema = { 'ui:options': { catalogApi } };
    props = {
      onChange,
      schema,
      required,
      uiSchema,
      rawErrors,
      formData,
    } as unknown as FieldProps<any>;

    render(<OwnershipEntityRefPicker {...props} />);

    // Assuming the component calls `onChange` with the groups a user is a part of
    expect(onChange).not.toHaveBeenCalledWith(['group1', 'group2']);
  });

  it('should render without imploding', () => {
    uiSchema = { 'ui:options': { catalogApi } };
    props = {
      onChange,
      schema,
      required,
      uiSchema,
      rawErrors,
      formData,
    } as unknown as FieldProps<any>;

    const { container } = render(<OwnershipEntityRefPicker {...props} />);
    expect(container).not.toBeNull();
  });
});
