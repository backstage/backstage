/*
 * Copyright 2024 The Backstage Authors
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

import { UserListFilterKind } from '../../types';
import { EntityKindPicker } from '../EntityKindPicker';
import { EntityLifecyclePicker } from '../EntityLifecyclePicker';
import { EntityNamespacePicker } from '../EntityNamespacePicker';
import {
  EntityOwnerPickerProps,
  EntityOwnerPicker,
} from '../EntityOwnerPicker';
import { EntityProcessingStatusPicker } from '../EntityProcessingStatusPicker';
import { EntityTagPicker } from '../EntityTagPicker';
import { EntityTypePicker } from '../EntityTypePicker';
import { UserListPicker } from '../UserListPicker';

/**
 * Props for default filters.
 *
 * @public
 */
export type DefaultFiltersProps = {
  initialKind?: string;
  initiallySelectedFilter?: UserListFilterKind;
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
  initiallySelectedNamespaces?: string[];
};

/** @public */
export const DefaultFilters = (props: DefaultFiltersProps) => {
  const {
    initialKind,
    initiallySelectedFilter,
    ownerPickerMode,
    initiallySelectedNamespaces,
  } = props;
  return (
    <>
      <EntityKindPicker initialFilter={initialKind} />
      <EntityTypePicker />
      <UserListPicker initialFilter={initiallySelectedFilter} />
      <EntityOwnerPicker mode={ownerPickerMode} />
      <EntityLifecyclePicker />
      <EntityTagPicker />
      <EntityProcessingStatusPicker />
      <EntityNamespacePicker
        initiallySelectedNamespaces={initiallySelectedNamespaces}
      />
    </>
  );
};
