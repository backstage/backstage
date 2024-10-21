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
import { MarkdownContent } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WrapText from '@material-ui/icons/WrapText';
import classNames from 'classnames';
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from 'json-schema';
import {
  entries,
  filter,
  first,
  get,
  map,
  mapValues,
  omit,
  pick,
  pickBy,
} from 'lodash';
import React from 'react';
import { SchemaRenderContext, SchemaRenderStrategy } from './types';
import {
  TranslationFunction,
  TranslationRef,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';
import { makeStyles } from '@material-ui/core/styles';

const getTypes = (properties: JSONSchema7) => {
  if (!properties.type) {
    return ['unknown'];
  }
  if (properties.type !== 'array') {
    return [properties.type].flat();
  }
  return [
    `${properties.type}(${
      (properties.items as JSONSchema7 | undefined)?.type ?? 'unknown'
    })`,
  ];
};

const getSubschemas = (
  schema: JSONSchema7Definition,
): Record<string, JSONSchema7Definition[]> => {
  if (typeof schema === 'boolean') {
    return {};
  }
  const compositeSchemaProperties = ['allOf', 'anyOf', 'not', 'oneOf'] as const;
  const base = omit(schema, compositeSchemaProperties);

  const subschemas = pickBy(
    mapValues(pickBy(pick(schema, compositeSchemaProperties)), v =>
      Array.isArray(v) ? v : [v],
    ),
    a => a.length,
  );
  return mapValues(subschemas, v =>
    v.map((sub: JSONSchema7Definition): JSONSchema7Definition => {
      if (typeof sub !== 'boolean' && Object.hasOwn(sub, 'required')) {
        return {
          ...base,
          ...sub,
          properties: {
            ...pickBy(schema.properties, (_, k) => sub.required?.includes(k)),
            ...sub.properties,
          },
        };
      }
      return sub;
    }),
  );
};

const useColumnStyles = makeStyles({
  description: {
    width: '40%',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    '&.MuiTableCell-root': {
      whiteSpace: 'normal',
    },
  },
  standard: {
    whiteSpace: 'normal',
  },
});

type SchemaRenderElement = {
  schema: JSONSchema7Definition;
  key?: string;
  required?: boolean;
};

type RenderColumn = (
  element: SchemaRenderElement,
  context: SchemaRenderContext,
) => JSX.Element;

type Xlate<R> = R extends TranslationRef<any, infer M>
  ? TranslationFunction<M>
  : never;

type Column = {
  key: string;
  title: (t: Xlate<typeof scaffolderTranslationRef>) => string;
  render: RenderColumn;
  className?: keyof ReturnType<typeof useColumnStyles>;
};

const generateId = (
  element: SchemaRenderElement,
  context: SchemaRenderContext,
) => {
  return element.key ? `${context.parentId}.${element.key}` : context.parentId;
};

const nameColumn = {
  key: 'name',
  title: t => t('renderSchema.tableCell.name'),
  render: (element: SchemaRenderElement, context: SchemaRenderContext) => {
    return (
      <div
        className={classNames(context.classes.code, {
          [context.classes.codeRequired]: element.required,
        })}
      >
        {element.key}
      </div>
    );
  },
} as Column;

const titleColumn = {
  key: 'title',
  title: t => t('renderSchema.tableCell.title'),
  render: (element: SchemaRenderElement) => (
    <MarkdownContent
      content={get(element.schema as JSONSchema7, 'title') ?? ''}
    />
  ),
} as Column;

const descriptionColumn = {
  key: 'description',
  title: t => t('renderSchema.tableCell.description'),
  render: (element: SchemaRenderElement) => (
    <MarkdownContent
      content={get(element.schema as JSONSchema7, 'description') ?? ''}
    />
  ),
  className: 'description',
} as Column;

const enumFrom = (schema: JSONSchema7) => {
  if (schema.type === 'array') {
    if (schema.items && typeof schema.items !== 'boolean') {
      return Array.isArray(schema.items)
        ? first(filter(map(schema.items, 'enum')))
        : schema.items.enum;
    }
    return undefined;
  }
  return schema.enum;
};

const inspectSchema = (
  schema: JSONSchema7Definition,
): {
  canSubschema: boolean;
  hasEnum: boolean;
} => {
  if (typeof schema === 'boolean') {
    return { canSubschema: false, hasEnum: false };
  }
  return {
    canSubschema: getTypes(schema).some(t => t.includes('object')),
    hasEnum: !!enumFrom(schema),
  };
};

const typeColumn = {
  key: 'type',
  title: t => t('renderSchema.tableCell.type'),
  render: (element: SchemaRenderElement, context: SchemaRenderContext) => {
    if (typeof element.schema === 'boolean') {
      return <Typography>{element.schema ? 'any' : 'none'}</Typography>;
    }
    const types = getTypes(element.schema);
    const [isExpanded, setIsExpanded] = context.expanded;
    const id = generateId(element, context);
    const info = inspectSchema(element.schema);
    return (
      <>
        {types.map((type, index) =>
          type.includes('object') || (info.hasEnum && index === 0) ? (
            <Chip
              data-testid={`expand_${id}`}
              label={type}
              key={type}
              icon={isExpanded[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              variant="outlined"
              onClick={() =>
                setIsExpanded(prevState => {
                  return {
                    ...prevState,
                    [id]: !!!prevState[id],
                  };
                })
              }
            />
          ) : (
            <Chip label={type} key={type} variant="outlined" />
          ),
        )}
      </>
    );
  },
} as Column;

export const RenderEnum: React.FC<{
  e: JSONSchema7Type[];
  classes: ClassNameMap;
  [key: string]: any;
}> = ({
  e,
  classes,
  ...props
}: {
  e: JSONSchema7Type[];
  classes: ClassNameMap;
}) => {
  return (
    <List {...props}>
      {e.map((v, i) => {
        let inner: React.JSX.Element = (
          <Typography
            data-testid={`enum_el${i}`}
            className={classNames(classes.code)}
          >
            {JSON.stringify(v)}
          </Typography>
        );
        if (v !== null && ['object', 'array'].includes(typeof v)) {
          inner = (
            <>
              {inner}
              <Tooltip
                title={
                  <Typography
                    data-testid={`pretty_${i}`}
                    className={classNames(classes.code)}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {JSON.stringify(v, undefined, 2)}
                  </Typography>
                }
              >
                <IconButton data-testid={`wrap-text_${i}`}>
                  <WrapText />
                </IconButton>
              </Tooltip>
            </>
          );
        }
        return <ListItem key={i}>{inner}</ListItem>;
      })}
    </List>
  );
};

const useTableStyles = makeStyles({
  schema: {
    width: '100%',
    overflowX: 'hidden',
    '& table': {
      width: '100%',
      tableLayout: 'fixed',
    },
  },
});

export const RenderSchema = ({
  strategy,
  context,
  schema,
}: {
  strategy: SchemaRenderStrategy;
  context: SchemaRenderContext;
  schema?: JSONSchema7Definition;
}) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const tableStyles = useTableStyles();
  const columnStyles = useColumnStyles();
  const result = (() => {
    if (typeof schema === 'object') {
      const subschemas =
        strategy === 'root' || !context.parent ? getSubschemas(schema) : {};
      let columns: Column[] | undefined;
      let elements: SchemaRenderElement[] | undefined;
      if (strategy === 'root') {
        elements = [{ schema }];
        columns = [typeColumn];
        if (schema.description) {
          columns.unshift(descriptionColumn);
        }
        if (schema.title) {
          columns.unshift(titleColumn);
        }
      } else if (entries(schema.properties).length) {
        columns = [nameColumn, titleColumn, descriptionColumn, typeColumn];
        elements = Object.entries(schema.properties!).map(([key, v]) => ({
          schema: v,
          key,
          required: schema.required?.includes(key),
        }));
      } else if (!Object.keys(subschemas).length) {
        return undefined;
      }
      const [isExpanded] = context.expanded;

      return (
        <>
          {columns && elements && (
            <TableContainer component={Paper} className={tableStyles.schema}>
              <Table
                data-testid={`${strategy}_${context.parentId}`}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell
                        key={index}
                        className={columnStyles[col.className ?? 'standard']}
                      >
                        {col.title(t)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {elements.map(el => {
                    const id = generateId(el, context);
                    const info = inspectSchema(el.schema);
                    return (
                      <React.Fragment key={id}>
                        <TableRow data-testid={`${strategy}-row_${id}`}>
                          {columns!.map(col => (
                            <TableCell
                              key={col.key}
                              className={
                                columnStyles[col.className ?? 'standard']
                              }
                            >
                              {col.render(el, context)}
                            </TableCell>
                          ))}
                        </TableRow>
                        {typeof el.schema !== 'boolean' &&
                          (info.canSubschema || info.hasEnum) && (
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={columns!.length}
                              >
                                <Collapse
                                  in={isExpanded[id]}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box
                                    data-testid={`expansion_${id}`}
                                    sx={{ margin: 1 }}
                                  >
                                    {info.canSubschema && (
                                      <RenderSchema
                                        strategy="properties"
                                        context={{
                                          ...context,
                                          parentId: id,
                                          parent: context,
                                        }}
                                        schema={
                                          el.schema.type === 'array'
                                            ? (el.schema.items as
                                                | JSONSchema7
                                                | undefined)
                                            : el.schema
                                        }
                                      />
                                    )}
                                    {info.hasEnum && (
                                      <>
                                        {React.cloneElement(
                                          context.headings[0],
                                          {},
                                          'Valid values:',
                                        )}
                                        <RenderEnum
                                          data-testid={`enum_${id}`}
                                          e={enumFrom(el.schema)!}
                                          classes={context.classes}
                                        />
                                      </>
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {Object.keys(subschemas).map(sk => (
            <React.Fragment key={sk}>
              {React.cloneElement(context.headings[0], {}, sk)}
              {subschemas[sk].map((sub, index) => (
                <RenderSchema
                  key={index}
                  {...{
                    strategy,
                    context: {
                      ...context,
                      parentId: `${context.parentId}_sub${index}`,
                    },
                    schema: sub,
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      );
    }
    return undefined;
  })();
  return result ?? <Typography>No schema defined</Typography>;
};
