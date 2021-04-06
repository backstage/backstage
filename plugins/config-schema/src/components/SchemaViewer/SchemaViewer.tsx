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
import React, { ReactNode, useMemo } from 'react';
import { Schema } from 'jsonschema';
import {
  Box,
  Chip,
  createStyles,
  Divider,
  fade,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { JsonValue } from '@backstage/config';
import { TreeItem, TreeItemProps, TreeView } from '@material-ui/lab';

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
      <TableCell style={{ width: 160 }}>
        <Typography variant="body1" noWrap style={{ fontWeight: 900 }}>
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
          {schema.additionalProperties === true && (
            <MetadataViewRow label="Additional Properties" text="true" />
          )}
          {schema.additionalItems === true && (
            <MetadataViewRow label="Additional Items" text="true" />
          )}
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

const useChildViewStyles = makeStyles(theme => ({
  title: {
    marginBottom: 0,
  },
  chip: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
}));

export function ChildView({
  path,
  depth,
  schema,
  required,
  lastChild,
}: {
  path: string;
  depth: number;
  schema?: Schema;
  required?: boolean;
  lastChild?: boolean;
}) {
  const classes = useChildViewStyles();
  const chips = new Array<JSX.Element>();
  const chipProps = { size: 'small' as const, classes: { root: classes.chip } };

  if (required) {
    chips.push(
      <Chip label="required" color="default" key="required" {...chipProps} />,
    );
  }

  const visibility = (schema as { visibility?: string })?.visibility;
  if (visibility === 'frontend') {
    chips.push(
      <Chip label="frontend" color="primary" key="visibility" {...chipProps} />,
    );
  } else if (visibility === 'secret') {
    chips.push(
      <Chip label="secret" color="secondary" key="visibility" {...chipProps} />,
    );
  }

  return (
    <Box paddingBottom={lastChild ? 4 : 8} display="flex" flexDirection="row">
      <Divider orientation="vertical" flexItem />
      <Box paddingLeft={2} flex={1}>
        <Box
          display="flex"
          flexDirection="row"
          marginBottom={2}
          alignItems="center"
        >
          <Typography
            variant={titleVariant(depth)}
            classes={{ root: classes.title }}
          >
            {path}
          </Typography>
          {chips.length > 0 && <Box marginLeft={1} />}
          {chips}
        </Box>
        {schema && (
          <SchemaView path={path} depth={depth} schema={schema as Schema} />
        )}
      </Box>
    </Box>
  );
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
      <ChildView
        lastChild
        path={itemPath}
        depth={itemDepth}
        schema={itemSchema as Schema | undefined}
      />
      {schema.additionalItems && schema.additionalItems !== true && (
        <>
          <Typography variant="overline">Additional Items</Typography>
          <ChildView
            path={itemPath}
            depth={itemDepth}
            schema={schema.additionalItems}
            lastChild
          />
        </>
      )}
    </>
  );
}

export function ObjectView({ path, depth, schema }: SchemaViewProps) {
  const properties = Object.entries(schema.properties ?? {});
  const patternProperties = Object.entries(schema.patternProperties ?? {});

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
          {properties.map(([name, propSchema], index) => (
            <ChildView
              path={path ? `${path}.${name}` : name}
              depth={depth + 1}
              schema={propSchema}
              lastChild={index === properties.length - 1}
              required={isRequired(name, schema.required)}
            />
          ))}
        </>
      )}
      {patternProperties.length > 0 && (
        <>
          {depth > 0 && (
            <Typography variant="overline">Pattern Properties</Typography>
          )}
          {patternProperties.map(([name, propSchema], index) => (
            <ChildView
              path={path ? `${path}.<${name}>` : name}
              depth={depth + 1}
              schema={propSchema}
              lastChild={index === patternProperties.length - 1}
              required={isRequired(name, schema.required)}
            />
          ))}
        </>
      )}
      {schema.additionalProperties && schema.additionalProperties !== true && (
        <>
          <Typography variant="overline">Additional Properties</Typography>
          <ChildView
            path={`${path}.*`}
            depth={depth + 1}
            schema={schema.additionalProperties}
            lastChild
          />
        </>
      )}
    </>
  );
}

export function MatchView({
  path,
  depth,
  schema,
  label,
}: {
  path: string;
  depth: number;
  schema: Schema[];
  label: string;
}) {
  return (
    <>
      <Typography variant="overline">{label}</Typography>
      {schema.map((optionSchema, index) => (
        <ChildView
          path={`${path}/${index}`}
          depth={depth + 1}
          schema={optionSchema}
          lastChild={index === schema.length - 1}
        />
      ))}
    </>
  );
}

export function SchemaView(props: SchemaViewProps) {
  const { schema } = props;
  if (schema.anyOf) {
    return (
      <MatchView
        {...props}
        schema={schema.anyOf}
        label="Any of the following"
      />
    );
  }
  if (schema.oneOf) {
    return (
      <MatchView
        {...props}
        schema={schema.oneOf}
        label="One of the following"
      />
    );
  }
  if (schema.allOf) {
    return (
      <MatchView
        {...props}
        schema={schema.allOf}
        label="All of the following"
      />
    );
  }
  switch (schema.type) {
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

const StyledTreeItem = withStyles(theme =>
  createStyles({
    label: {
      userSelect: 'none',
    },
    group: {
      marginLeft: 7,
      paddingLeft: theme.spacing(1),
      borderLeft: `1px solid ${fade(theme.palette.text.primary, 0.15)}`,
    },
  }),
)((props: TreeItemProps) => <TreeItem {...props} />);

export function createSchemaBrowserItems(
  expanded: string[],
  schema: Schema,
  path: string = '',
  depth: number = 0,
): ReactNode {
  let matchArr;
  if (schema.anyOf) {
    matchArr = schema.anyOf;
  } else if (schema.oneOf) {
    matchArr = schema.oneOf;
  } else if (schema.allOf) {
    matchArr = schema.allOf;
  }
  if (matchArr) {
    return matchArr.map((childSchema, index) => {
      const childPath = `${path}/${index}`;
      if (depth > 0) expanded.push(childPath);
      return (
        <StyledTreeItem
          key={childPath}
          nodeId={childPath}
          label={`<Option ${index + 1}>`}
        >
          {createSchemaBrowserItems(
            expanded,
            childSchema,
            childPath,
            depth + 1,
          )}
        </StyledTreeItem>
      );
    });
  }

  switch (schema.type) {
    case 'array': {
      const childPath = `${path}[]`;
      if (depth > 0) expanded.push(childPath);
      return (
        <StyledTreeItem nodeId={childPath} label="[]">
          {schema.items &&
            createSchemaBrowserItems(
              expanded,
              schema.items as Schema,
              childPath,
              depth + 1,
            )}
        </StyledTreeItem>
      );
    }
    case 'object':
    case undefined: {
      const children = [];

      if (schema.properties) {
        children.push(
          ...Object.entries(schema.properties).map(([name, childSchema]) => {
            const childPath = path ? `${path}/${name}` : name;
            if (depth > 0) expanded.push(childPath);
            return (
              <StyledTreeItem key={childPath} nodeId={childPath} label={name}>
                {createSchemaBrowserItems(
                  expanded,
                  childSchema,
                  childPath,
                  depth + 1,
                )}
              </StyledTreeItem>
            );
          }),
        );
      }

      if (schema.patternProperties) {
        children.push(
          ...Object.entries(schema.patternProperties).map(
            ([name, childSchema]) => {
              const childPath = `${path}/<${name}>`;
              if (depth > 0) expanded.push(childPath);
              return (
                <StyledTreeItem
                  key={childPath}
                  nodeId={childPath}
                  label={`<${name}>`}
                >
                  {createSchemaBrowserItems(
                    expanded,
                    childSchema,
                    childPath,
                    depth + 1,
                  )}
                </StyledTreeItem>
              );
            },
          ),
        );
      }

      if (schema.additionalProperties && schema.additionalProperties !== true) {
        const childPath = `${path}/*`;
        if (depth > 0) expanded.push(childPath);
        children.push(
          <StyledTreeItem key={childPath} nodeId={childPath} label="*">
            {createSchemaBrowserItems(
              expanded,
              schema.additionalProperties,
              childPath,
              depth + 1,
            )}
          </StyledTreeItem>,
        );
      }

      return <>{children}</>;
    }

    default:
      return null;
  }
}

export function SchemaBrowser({ schema }: { schema: Schema }) {
  const data = useMemo(() => {
    const expanded = new Array<string>();

    const items = createSchemaBrowserItems(expanded, schema);

    return { items, expanded };
  }, [schema]);

  return (
    <TreeView
      defaultExpanded={data.expanded}
      disableSelection
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {data.items}
    </TreeView>
  );
}

export const SchemaViewer = ({ schema }: SchemaViewerProps) => {
  return (
    <Box flex="1" position="relative">
      <Box
        clone
        position="absolute"
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        maxHeight="100%"
      >
        <Paper elevation={3}>
          <Box padding={1} overflow="auto" width={300}>
            <SchemaBrowser schema={schema} />
          </Box>

          <Box flex="1" overflow="auto">
            <SchemaView schema={schema} path="" depth={0} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
