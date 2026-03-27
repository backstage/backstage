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
import { IconComponent } from '@backstage/core-plugin-api';
import { cn } from '@backstage/core-components';
import { Settings, Type } from 'lucide-react';
import { type ComponentType, Fragment } from 'react';
import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(
  t: TranslationFunction<typeof scaffolderTranslationRef.T>,
): ButtonGroup[] {
  return [
    {
      name: t('ownerListPicker.title'),
      items: [
        {
          id: 'owned',
          label: t('ownerListPicker.options.owned'),
          icon: Settings as unknown as IconComponent,
        },
        {
          id: 'all',
          label: t('ownerListPicker.options.all'),
          icon: Type as unknown as IconComponent,
        },
      ],
    },
  ];
}

export const OwnerListPicker = (props: {
  filter: string;
  onSelectOwner: (id: 'owned' | 'all') => void;
}) => {
  const { filter, onSelectOwner } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const filterGroups = getFilterGroups(t);
  return (
    <div className="bg-black/[.11] shadow-none my-2 rounded-md">
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <span className="text-xs font-bold uppercase ml-2 mt-2 block text-muted-foreground">
            {group.name}
          </span>
          <div className="mx-2 mt-2 mb-4 rounded-md border bg-card">
            <ul className="m-0 p-0 list-none" role="menu">
              {group.items.map((item, index) => {
                /* Lucide icons use className for sizing instead of MUI's fontSize prop */
                const Icon = item.icon as unknown as ComponentType<{
                  className?: string;
                }>;
                return (
                  <li key={item.id} role="menuitem">
                    <button
                      type="button"
                      onClick={() => onSelectOwner(item.id as 'owned' | 'all')}
                      className={cn(
                        'flex w-full items-center min-h-[48px] px-4 py-2 text-sm cursor-pointer bg-transparent hover:bg-accent',
                        item.id === filter && 'bg-accent',
                        index !== group.items.length - 1 &&
                          'border-b border-border',
                      )}
                      data-testid={`owner-picker-${item.id}`}
                    >
                      {item.icon && (
                        <span className="min-w-[30px] text-foreground flex items-center">
                          <Icon className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
