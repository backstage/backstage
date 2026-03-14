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

import { ListBox, ListBoxItem } from 'react-aria-components';
import { useDefinition } from '../../hooks/useDefinition';
import { AutocompleteDefinition } from './definition';
import type {
  AutocompleteOption,
  AutocompleteDisplayMode,
  AutocompleteGridConfig,
  AutocompleteTableColumn,
} from './types';
import { ReactNode } from 'react';

interface AutocompleteContentProps {
  options: Array<AutocompleteOption>;
  displayMode?: AutocompleteDisplayMode;
  gridConfig?: AutocompleteGridConfig;
  tableColumns?: AutocompleteTableColumn[];
  renderOption?: (item: AutocompleteOption) => ReactNode;
}

const NoResults = () => {
  return (
    <div style={{ padding: '8px 12px', color: 'var(--bui-fg-secondary)' }}>
      No results found.
    </div>
  );
};

/** ListBox display mode - default simple list */
export function AutocompleteListBox(props: AutocompleteContentProps) {
  const { options, renderOption } = props;
  const { ownProps } = useDefinition(AutocompleteDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBox className={classes.listbox} renderEmptyState={() => <NoResults />}>
      {options.map(option => (
        <ListBoxItem
          key={option.value}
          id={option.value}
          textValue={option.label}
          className={classes.item}
          isDisabled={option.disabled}
        >
          {renderOption ? (
            renderOption(option)
          ) : (
            <span className={classes.itemLabel}>{option.label}</span>
          )}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}

/** Menu display mode - styled as menu items */
export function AutocompleteMenu(props: AutocompleteContentProps) {
  const { options, renderOption } = props;
  const { ownProps } = useDefinition(AutocompleteDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBox className={classes.listbox} renderEmptyState={() => <NoResults />}>
      {options.map(option => (
        <ListBoxItem
          key={option.value}
          id={option.value}
          textValue={option.label}
          className={classes.item}
          isDisabled={option.disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--bui-space-2)',
          }}
        >
          {renderOption ? (
            renderOption(option)
          ) : (
            <>
              {option.icon && (
                <span style={{ flexShrink: 0 }}>{option.icon}</span>
              )}
              <span className={classes.itemLabel} style={{ flex: 1 }}>
                {option.label}
              </span>
              {option.description && (
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--bui-fg-secondary)',
                  }}
                >
                  {option.description}
                </span>
              )}
            </>
          )}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}

/** Grid display mode - options in a grid layout */
export function AutocompleteGrid(props: AutocompleteContentProps) {
  const {
    options,
    renderOption,
    gridConfig = { columns: 'auto', gap: 'var(--bui-space-2)' },
  } = props;
  const { ownProps } = useDefinition(AutocompleteDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBox
      className={classes.listbox}
      renderEmptyState={() => <NoResults />}
      style={{
        display: 'grid',
        gridTemplateColumns:
          typeof gridConfig.columns === 'number'
            ? `repeat(${gridConfig.columns}, 1fr)`
            : 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: gridConfig.gap,
      }}
    >
      {options.map(option => (
        <ListBoxItem
          key={option.value}
          id={option.value}
          textValue={option.label}
          className={classes.item}
          isDisabled={option.disabled}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--bui-space-3)',
            textAlign: 'center',
            minHeight: '80px',
          }}
        >
          {renderOption ? (
            renderOption(option)
          ) : (
            <>
              {option.icon && (
                <div
                  style={{
                    marginBottom: 'var(--bui-space-2)',
                    fontSize: '1.5rem',
                  }}
                >
                  {option.icon}
                </div>
              )}
              <span className={classes.itemLabel}>{option.label}</span>
              {option.description && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--bui-fg-secondary)',
                    marginTop: 'var(--bui-space-1)',
                  }}
                >
                  {option.description}
                </span>
              )}
            </>
          )}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}

/** Tags display mode - options as tag-like items */
export function AutocompleteTags(props: AutocompleteContentProps) {
  const { options, renderOption } = props;
  const { ownProps } = useDefinition(AutocompleteDefinition, {});
  const { classes } = ownProps;

  return (
    <ListBox
      className={classes.listbox}
      renderEmptyState={() => <NoResults />}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--bui-space-2)',
        padding: 'var(--bui-space-2)',
      }}
    >
      {options.map(option => (
        <ListBoxItem
          key={option.value}
          id={option.value}
          textValue={option.label}
          className={classes.item}
          isDisabled={option.disabled}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--bui-space-1)',
            padding: 'var(--bui-space-1) var(--bui-space-2)',
            borderRadius: 'var(--bui-radius-4)',
            backgroundColor: 'var(--bui-bg-neutral-2)',
            fontSize: '0.875rem',
            minHeight: 'auto',
          }}
        >
          {renderOption ? (
            renderOption(option)
          ) : (
            <>
              {option.icon && (
                <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
              )}
              <span className={classes.itemLabel}>{option.label}</span>
            </>
          )}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}

/** Table display mode - options in a table with columns */
export function AutocompleteTable(props: AutocompleteContentProps) {
  const { options, renderOption, tableColumns = [] } = props;
  const { ownProps } = useDefinition(AutocompleteDefinition, {});
  const { classes } = ownProps;

  // Default columns if none provided
  const columns =
    tableColumns.length > 0
      ? tableColumns
      : [
          {
            key: 'label',
            label: 'Name',
            render: (item: AutocompleteOption) => item.label,
          },
        ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Table header - outside ListBox */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
          gap: 'var(--bui-space-2)',
          padding: 'var(--bui-space-2) var(--bui-space-3)',
          borderBottom: '1px solid var(--bui-border-2)',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--bui-fg-secondary)',
          backgroundColor: 'var(--bui-bg-neutral-1)',
        }}
      >
        {columns.map(col => (
          <div key={col.key}>{col.label}</div>
        ))}
      </div>

      {/* Table rows */}
      <ListBox
        className={classes.listbox}
        renderEmptyState={() => <NoResults />}
        style={{ paddingTop: 0 }}
      >
        {options.map(option => (
          <ListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            className={classes.item}
            isDisabled={option.disabled}
          >
            {renderOption ? (
              renderOption(option)
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: columns
                    .map(col => col.width || '1fr')
                    .join(' '),
                  gap: 'var(--bui-space-2)',
                  width: '100%',
                }}
              >
                {columns.map(col => (
                  <div
                    key={col.key}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {col.render ? col.render(option) : option[col.key]}
                  </div>
                ))}
              </div>
            )}
          </ListBoxItem>
        ))}
      </ListBox>
    </div>
  );
}

/** Main content switcher */
export function AutocompleteContent(props: AutocompleteContentProps) {
  const { displayMode = 'listbox' } = props;

  switch (displayMode) {
    case 'menu':
      return <AutocompleteMenu {...props} />;
    case 'grid':
      return <AutocompleteGrid {...props} />;
    case 'tags':
      return <AutocompleteTags {...props} />;
    case 'table':
      return <AutocompleteTable {...props} />;
    case 'listbox':
    default:
      return <AutocompleteListBox {...props} />;
  }
}
