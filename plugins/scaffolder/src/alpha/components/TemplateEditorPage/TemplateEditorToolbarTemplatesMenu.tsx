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

import { useCallback } from 'react';

import { Entity } from '@backstage/catalog-model';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  ShadcnButton as Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from '@backstage/core-components';
import { scaffolderTranslationRef } from '../../../translation';

export type TemplateOption = {
  label: string;
  value: Entity;
};

export function TemplateEditorToolbarTemplatesMenu(props: {
  options: TemplateOption[];
  selectedOption?: TemplateOption;
  onSelectOption: (option: TemplateOption) => void;
}) {
  const { options, selectedOption, onSelectOption } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const isSelectedOption = useCallback(
    (option: TemplateOption) => {
      return !!selectedOption && selectedOption.value === option.value;
    },
    [selectedOption],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {t('templateEditorToolbarTemplatesMenu.button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-[240px] overflow-y-auto"
      >
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => onSelectOption(option)}
            className={cn(isSelectedOption(option) && 'bg-accent')}
            aria-selected={isSelectedOption(option)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
