/*
 * Copyright 2025 The Backstage Authors
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

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Header,
  Text,
} from 'react-aria-components';
import { RiCheckLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SelectListBoxDefinition,
  SelectListBoxItemDefinition,
  SelectSectionDefinition,
} from './definition';
import type { Option, OptionSection, SelectOwnProps } from './types';

interface SelectListBoxProps {
  options?: SelectOwnProps['options'];
}

const NoResults = () => {
  const { ownProps } = useDefinition(SelectListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.noResults}>No results found.</div>;
};

function SelectItem({ option }: { option: Option }) {
  const { ownProps } = useDefinition(SelectListBoxItemDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxItem
      id={option.value}
      textValue={option.label}
      className={classes.root}
      isDisabled={option.disabled}
    >
      <div className={classes.indicator}>
        <RiCheckLine />
      </div>
      <Text slot="label" className={classes.label}>
        {option.label}
      </Text>
    </ListBoxItem>
  );
}

function SelectSectionItems({ section }: { section: OptionSection }) {
  const { ownProps } = useDefinition(SelectSectionDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxSection className={classes.root}>
      <Header className={classes.header}>{section.title}</Header>
      {section.options.map(option => (
        <SelectItem key={option.value} option={option} />
      ))}
    </ListBoxSection>
  );
}

export function SelectListBox(props: SelectListBoxProps) {
  const { ownProps } = useDefinition(SelectListBoxDefinition, props);
  const { classes, options } = ownProps;

  return (
    <ListBox className={classes.root} renderEmptyState={() => <NoResults />}>
      {options?.map(item =>
        'options' in item ? (
          <SelectSectionItems key={item.title} section={item} />
        ) : (
          <SelectItem key={item.value} option={item} />
        ),
      )}
    </ListBox>
  );
}
