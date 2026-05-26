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
import type { ComboboxListBoxOwnProps } from './types';
import type { OptionWithId, OptionSectionWithId } from '../Select/types';

const LoadingState = () => {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.loadingState}>Searching...</div>;
};

const NoResults = () => {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, {});
  const { classes } = ownProps;

  return <div className={classes.noResults}>No results found.</div>;
};

function ComboboxItem({ option }: { option: OptionWithId }) {
  const { ownProps } = useDefinition(ComboboxListBoxItemDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxItem
      id={option.id}
      textValue={option.label}
      className={classes.root}
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

function ComboboxSectionItems({ section }: { section: OptionSectionWithId }) {
  const { ownProps } = useDefinition(ComboboxSectionDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBoxSection className={classes.root}>
      <Header className={classes.header}>{section.title}</Header>
      {section.options.map(option => (
        <ComboboxItem option={option} />
      ))}
    </ListBoxSection>
  );
}

export function ComboboxListBox(props: ComboboxListBoxOwnProps) {
  const { ownProps } = useDefinition(ComboboxListBoxDefinition, props);
  const { classes, isLoading } = ownProps;

  return (
    <ListBox<OptionWithId | OptionSectionWithId>
      className={classes.root}
      aria-busy={isLoading || undefined}
      data-stale={isLoading || undefined}
      renderEmptyState={() => (isLoading ? <LoadingState /> : <NoResults />)}
    >
      {item =>
        'options' in item ? (
          <ComboboxSectionItems key={item.id} section={item} />
        ) : (
          <ComboboxItem key={item.id} option={item} />
        )
      }
    </ListBox>
  );
}
