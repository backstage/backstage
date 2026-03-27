/*
 * Copyright 2021 The Backstage Authors
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
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Popover,
  PopoverTrigger,
  ShadcnButton as Button,
  cn,
} from '@backstage/core-components';
import { ChevronsUpDown } from 'lucide-react';
import useAsync from 'react-use/esm/useAsync';
import { EntityPicker } from '../EntityPicker/EntityPicker';

import { OwnedEntityPickerProps } from './schema';
import { EntityPickerProps } from '../EntityPicker/schema';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';

export { OwnedEntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `OwnedEntityPicker`
 * field extension.
 *
 * @public
 */
export const OwnedEntityPicker = (props: OwnedEntityPickerProps) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    schema: {
      title = t('fields.ownedEntityPicker.title'),
      description = t('fields.ownedEntityPicker.description'),
    },
    uiSchema,
    required,
  } = props;

  const identityApi = useApi(identityApiRef);
  const { loading, value: identityRefs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    return identity.ownershipEntityRefs;
  });

  if (loading)
    return (
      <ScaffolderField
        rawDescription={uiSchema['ui:description'] ?? description}
        required={required}
        disabled={uiSchema['ui:disabled']}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled
              className={cn(
                'w-full justify-between font-normal',
                'text-muted-foreground',
              )}
            >
              {title}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        </Popover>
      </ScaffolderField>
    );

  const entityPickerUISchema = buildEntityPickerUISchema(
    uiSchema,
    identityRefs,
  );

  return <EntityPicker {...props} uiSchema={entityPickerUISchema} />;
};

/**
 * Builds a `uiSchema` for an `EntityPicker` from a parent `OwnedEntityPicker`.
 * Migrates deprecated parameters such as `allowedKinds` to `catalogFilter` structure.
 *
 * @param uiSchema The `uiSchema` of an `OwnedEntityPicker` component.
 * @param identityRefs The user and group entities that the user claims ownership through.
 * @returns The `uiSchema` for an `EntityPicker` component.
 */
function buildEntityPickerUISchema(
  uiSchema: OwnedEntityPickerProps['uiSchema'],
  identityRefs: string[] | undefined,
): EntityPickerProps['uiSchema'] {
  // Note: This is typed to avoid es-lint rule TS2698
  const uiOptions: EntityPickerProps['uiSchema']['ui:options'] =
    uiSchema?.['ui:options'] || {};
  const { allowedKinds, ...extraOptions } = uiOptions;

  const catalogFilter = asArray(uiOptions.catalogFilter).map(e => ({
    ...e,
    ...(allowedKinds ? { kind: allowedKinds } : {}),
    [`relations.${RELATION_OWNED_BY}`]: identityRefs || [],
  }));

  return {
    'ui:options': {
      ...extraOptions,
      catalogFilter,
    },
    'ui:disabled': uiSchema['ui:disabled'],
  };
}

function asArray(catalogFilter: any): any[] {
  if (catalogFilter) {
    return Array.isArray(catalogFilter) ? catalogFilter : [catalogFilter];
  }
  return [{}];
}
