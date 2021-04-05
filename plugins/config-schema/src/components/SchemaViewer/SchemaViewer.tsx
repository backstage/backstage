/*
 * Copyright 2021 Spotify AB
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
import React from 'react';
import { Schema } from 'jsonschema';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { JsonValue } from '@backstage/config';

interface SchemaViewProps {
  path: string;
  depth: number;
  schema: Schema;
}

export interface MetadataViewRowProps {
  label: string;
  text?: string;
  data?: JsonValue;
}

export function MetadataViewRow({ label, text, data }: MetadataViewRowProps) {
  if (text === undefined && data === undefined) {
    return null;
  }
  return (
    <TableRow>
      <TableCell variant="head" style={{ width: 160 }}>
        <Typography variant="body1" noWrap>
          {label}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">
          {data ? JSON.stringify(data) : text}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function MetadataView({ schema }: { schema: Schema }) {
  return (
    <Paper variant="outlined" square style={{ width: '100%' }}>
      <Table size="small">
        <TableBody>
          <MetadataViewRow label="Type" data={schema.type} />
          <MetadataViewRow label="Allowed values" data={schema.enum} />
          <MetadataViewRow label="Format" text={schema.format} />
          <MetadataViewRow
            label="Pattern"
            text={schema.pattern && String(schema.pattern)}
          />
          <MetadataViewRow label="Minimum" data={schema.minimum} />
          <MetadataViewRow label="Maximum" data={schema.maximum} />
          <MetadataViewRow
            label="Exclusive minimum"
            data={schema.exclusiveMinimum}
          />
          <MetadataViewRow
            label="Exclusive maximum"
            data={schema.exclusiveMaximum}
          />
          <MetadataViewRow label="Multiple of" data={schema.multipleOf} />
          <MetadataViewRow
            label="Maximum number of items"
            data={schema.maxItems}
          />
          <MetadataViewRow
            label="Minimum number of items"
            data={schema.minItems}
          />
          <MetadataViewRow
            label="Maximum number of properties"
            data={schema.maxProperties}
          />
          <MetadataViewRow
            label="Minimum number of properties"
            data={schema.minProperties}
          />
          <MetadataViewRow label="Maximum Length" data={schema.maxLength} />
          <MetadataViewRow label="Minimum Length" data={schema.minLength} />
          <MetadataViewRow
            label="Items must be unique"
            data={schema.uniqueItems}
          />
        </TableBody>
      </Table>
    </Paper>
  );
}

export function ScalarView({ schema }: SchemaViewProps) {
  return (
    <>
      {schema.description && (
        <Box marginBottom={4}>
          <Typography variant="body1">{schema.description}</Typography>
        </Box>
      )}
      <MetadataView schema={schema} />
    </>
  );
}

function isRequired(name: string, required?: boolean | string[]) {
  if (required === true) {
    return true;
  }
  if (Array.isArray(required)) {
    return required.includes(name);
  }
  return false;
}

function titleVariant(depth: number) {
  if (depth <= 1) {
    return 'h2';
  } else if (depth === 2) {
    return 'h3';
  } else if (depth === 3) {
    return 'h4';
  } else if (depth === 4) {
    return 'h5';
  }
  return 'h6';
}

export function VisibilityView({ schema }: { schema: Schema }) {
  const { visibility } = schema as { visibility?: string };
  if (visibility === 'frontend') {
    return (
      <Box
        marginLeft={1}
        children={<Chip label="frontend" color="primary" size="small" />}
      />
    );
  } else if (visibility === 'secret') {
    return (
      <Box
        marginLeft={1}
        children={<Chip label="secret" color="secondary" size="small" />}
      />
    );
  }
  return null;
}

export function ArrayView({ path, depth, schema }: SchemaViewProps) {
  const itemDepth = depth + 1;
  const itemPath = path ? `${path}[]` : '[]';
  const itemSchema = schema.items;

  return (
    <>
      <Box marginBottom={4}>
        {schema.description && (
          <Box marginBottom={4}>
            <Typography variant="body1">{schema.description}</Typography>
          </Box>
        )}
        <MetadataView schema={schema} />
      </Box>
      <Typography variant="overline">Items</Typography>
      <Box paddingBottom={2} display="flex" flexDirection="row">
        <Divider orientation="vertical" flexItem />
        <Box paddingLeft={2} flex={1}>
          <Box marginBottom={2}>
            <Typography variant={titleVariant(itemDepth)}>
              {itemPath}
            </Typography>
          </Box>
          {itemSchema && (
            <SchemaView
              path={itemPath}
              depth={itemDepth}
              schema={itemSchema as Schema}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export function ObjectView({ path, depth, schema }: SchemaViewProps) {
  const properties = Object.entries(schema.properties ?? {});
  return (
    <>
      {depth > 0 && (
        <Box marginBottom={4}>
          {schema.description && (
            <Box marginBottom={4}>
              <Typography variant="body1">{schema.description}</Typography>
            </Box>
          )}
          <MetadataView schema={schema} />
        </Box>
      )}
      {properties.length > 0 && (
        <>
          {depth > 0 && <Typography variant="overline">Properties</Typography>}
          {properties.map(([name, propSchema], index) => {
            const propDepth = depth + 1;
            const propPath = path ? `${path}.${name}` : name;

            return (
              <Box
                paddingBottom={index < properties.length - 1 ? 6 : 2}
                display="flex"
                flexDirection="row"
              >
                <Divider orientation="vertical" flexItem />
                <Box paddingLeft={2} flex={1}>
                  <Box display="flex" flexDirection="row" marginBottom={2}>
                    <Typography variant={titleVariant(propDepth)}>
                      {propPath}
                    </Typography>
                    {isRequired(name, schema.required) && (
                      <Box marginLeft={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                          required
                        </Typography>
                      </Box>
                    )}
                    <VisibilityView schema={propSchema} />
                  </Box>
                  <SchemaView
                    path={propPath}
                    depth={propDepth}
                    schema={propSchema}
                  />
                </Box>
              </Box>
            );
          })}
        </>
      )}
    </>
  );
}

export function SchemaView(props: SchemaViewProps) {
  // TODO(Rugvip): allOf, anyOf, oneOf
  switch (props.schema.type) {
    case 'array':
      return <ArrayView {...props} />;
    case 'object':
    case undefined:
      return <ObjectView {...props} />;
    default:
      return <ScalarView {...props} />;
  }
}

export interface SchemaViewerProps {
  schema: Schema;
}

export const SchemaViewer = ({ schema }: SchemaViewerProps) => {
  return <SchemaView schema={schema} path="" depth={0} />;
};
