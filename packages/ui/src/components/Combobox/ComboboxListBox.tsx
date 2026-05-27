/*
 * Copyright 2026 The Backstage Authors
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
  ComboboxListBoxDefinition,
  ComboboxListBoxItemDefinition,
  ComboboxSectionDefinition,
} from './definition';
import type { Option, OptionSection, ComboboxListBoxOwnProps } from './types';

const NoResults = () => {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.noResults}>No results found.</div>;
};

function ComboboxItem({ option }: { option: Option }) {
  const { ownProps } = useDefinition(ComboboxListBoxItemDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxItem
      id={option.value}
      textValue={option.label}
      className={classes.root}
      isDisabled={option.disabled}
    >
      <div className={classes.indicator}>
        <RiCheckLine aria-hidden="true" />
      </div>
      <Text slot="label" className={classes.label}>
        {option.label}
      </Text>
    </ListBoxItem>
  );
}

function ComboboxSectionItems({ section }: { section: OptionSection }) {
  const { ownProps } = useDefinition(ComboboxSectionDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxSection className={classes.root}>
      <Header className={classes.header}>{section.title}</Header>
      {section.options.map(option => (
        <ComboboxItem key={option.value} option={option} />
      ))}
    </ListBoxSection>
  );
}

export function ComboboxListBox(props: ComboboxListBoxOwnProps) {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, props);
  const { classes, options } = ownProps;

  return (
    <ListBox className={classes.root} renderEmptyState={() => <NoResults />}>
      {options?.map(item =>
        'options' in item ? (
          <ComboboxSectionItems key={item.title} section={item} />
        ) : (
          <ComboboxItem key={item.value} option={item} />
        ),
      )}
    </ListBox>
  );
}
