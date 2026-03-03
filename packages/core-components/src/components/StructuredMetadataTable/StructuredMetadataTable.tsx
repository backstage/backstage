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

import { ReactNode, isValidElement, Fragment, ReactElement } from 'react';
import startCase from 'lodash/startCase';

import {
  MetadataList,
  MetadataListItem,
  MetadataTable,
  MetadataTableItem,
} from './MetadataTable';
import { CodeSnippet } from '../CodeSnippet';
import jsyaml from 'js-yaml';
import { cn } from '../../lib/utils';

export type StructuredMetadataTableListClassKey = 'root';

export type StructuredMetadataTableNestedListClassKey = 'root';

// Sub Components
const StyledList = ({ children }: { children?: ReactNode }) => (
  <MetadataList className={cn('m-0 list-none')}>{children}</MetadataList>
);

const StyledNestedList = ({ children }: { children?: ReactNode }) => (
  <MetadataList className={cn('m-0 list-none pl-2')}>{children}</MetadataList>
);

function renderList(list: Array<any>, options: Options, nested: boolean) {
  const values = list.map((item: any, index: number) => (
    <MetadataListItem key={index}>
      {toValue(item, options, nested)}
    </MetadataListItem>
  ));
  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function renderMap(
  map: { [key: string]: any },
  options: Options,
  nested: boolean,
) {
  const values = Object.keys(map).map(key => {
    const value = toValue(map[key], options, true);
    return (
      <MetadataListItem key={key}>
        <span className="text-sm">{`${options.titleFormat(key)}: `}</span>
        {value}
      </MetadataListItem>
    );
  });

  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function toValue(
  value: ReactElement | object | Array<any> | boolean,
  options: Options,
  nested: boolean,
) {
  if (isValidElement(value)) {
    return <Fragment>{value}</Fragment>;
  }
  if (value !== null && typeof value === 'object') {
    if (options.nestedValuesAsYaml) {
      return (
        <CodeSnippet
          language="yaml"
          text={jsyaml.dump(value)}
          customStyle={{
            background: 'transparent',
            lineHeight: '1.4',
            padding: '0',
            margin: 0,
          }}
        />
      );
    }
    if (!Array.isArray(value)) {
      return renderMap(value, options, nested);
    }
  }

  if (Array.isArray(value)) {
    return renderList(value, options, nested);
  }

  if (typeof value === 'boolean') {
    return <Fragment>{value ? '✅' : '❌'}</Fragment>;
  }
  return <span className="text-sm">{value}</span>;
}
const ItemValue = ({ value, options }: { value: any; options: Options }) => (
  <Fragment>{toValue(value, options, false)}</Fragment>
);

const TableItem = ({
  title,
  value,
  options,
}: {
  title: string;
  value: any;
  options: Options;
}) => {
  return (
    <MetadataTableItem title={options.titleFormat(title)}>
      <ItemValue value={value} options={options} />
    </MetadataTableItem>
  );
};

function mapToItems(info: { [key: string]: string }, options: Options) {
  return Object.keys(info).map(key => (
    <TableItem key={key} title={key} value={info[key]} options={options} />
  ));
}

/** @public */
export interface StructuredMetadataTableProps {
  metadata: { [key: string]: any };
  dense?: boolean;
  options?: {
    /**
     * Function to format the keys from the `metadata` object. Defaults to
     * startCase from the lodash library.
     * @param key - A key within the `metadata`
     * @returns Formatted key
     */
    titleFormat?: (key: string) => string;
    nestedValuesAsYaml?: boolean;
  };
}

type Options = Required<NonNullable<StructuredMetadataTableProps['options']>>;

/** @public */
export function StructuredMetadataTable(props: StructuredMetadataTableProps) {
  const { metadata, dense = true, options } = props;
  const metadataItems = mapToItems(metadata, {
    titleFormat: startCase,
    nestedValuesAsYaml: options?.nestedValuesAsYaml ?? false,
    ...options,
  });
  return <MetadataTable dense={dense}>{metadataItems}</MetadataTable>;
}
