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

import React, { Fragment, ReactElement } from 'react';
import startCase from 'lodash/startCase';
import Typography from '@material-ui/core/Typography';

import {
  MetadataList,
  MetadataListItem,
  MetadataTable,
  MetadataTableItem,
} from './MetadataTable';
import { CodeSnippet } from '../CodeSnippet';
import jsyaml from 'js-yaml';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';

export type StructuredMetadataTableListClassKey = 'root';

const listStyle = createStyles({
  root: {
    margin: '0 0',
    listStyleType: 'none',
  },
});

export type StructuredMetadataTableNestedListClassKey = 'root';
const nestedListStyle = (theme: Theme) =>
  createStyles({
    root: {
      ...listStyle.root,
      paddingLeft: theme.spacing(1),
    },
  });

interface StyleProps extends WithStyles {
  children?: React.ReactNode;
}
// Sub Components
const StyledList = withStyles(listStyle, {
  name: 'BackstageStructuredMetadataTableList',
})(({ classes, children }: StyleProps) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));
const StyledNestedList = withStyles(nestedListStyle, {
  name: 'BackstageStructuredMetadataTableNestedList',
})(({ classes, children }: StyleProps) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));

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
        <Typography variant="body2" component="span">
          {`${options.titleFormat(key)}: `}
        </Typography>
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
  if (React.isValidElement(value)) {
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
  return (
    <Typography variant="body2" component="span">
      {value}
    </Typography>
  );
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
