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
import { MarkdownContent } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
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
import { makeStyles } from '@material-ui/core/styles';
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
import { FC, JSX, cloneElement, Fragment, ReactElement } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { SchemaRenderContext, SchemaRenderStrategy } from './types';
import { TranslationMessages } from '../TemplatingExtensionsPage/types';

const compositeSchemaProperties = ['allOf', 'anyOf', 'not', 'oneOf'] as const;

type subSchemasType = {
  [K in (typeof compositeSchemaProperties)[number]]?: JSONSchema7Definition[];
};

const getTypes = (schema: JSONSchema7) => {
  if (!schema.type) {
    if (
      Object.getOwnPropertyNames(schema).some(p =>
        compositeSchemaProperties.includes(p as any),
      )
    ) {
      return undefined;
    }
    return ['unknown'];
  }
  if (schema.type !== 'array') {
    return [schema.type].flat();
  }
  return [
    `${schema.type}(${
      (schema.items as JSONSchema7 | undefined)?.type ?? 'unknown'
    })`,
  ];
};

const getSubschemas = (schema: JSONSchema7Definition): subSchemasType => {
  if (typeof schema === 'boolean') {
    return {};
  }
  const base: Omit<JSONSchema7, keyof subSchemasType> = {};

  const subschemas: subSchemasType = {};

  for (const [key, value] of Object.entries(schema) as [
    keyof JSONSchema7,
    any,
  ][]) {
    if (compositeSchemaProperties.includes(key as keyof subSchemasType)) {
      let v;
      if (Array.isArray(value)) {
        if (!value.length) {
          continue;
        }
        v = value;
      } else if (value) {
        v = [value];
      } else {
        continue;
      }
      subschemas[key as keyof subSchemasType] = v as any;
    } else {
      base[key as Exclude<keyof JSONSchema7, keyof subSchemasType>] = value;
    }
  }
  if (!(base?.type === 'object' || 'properties' in base)) {
    return subschemas;
  }
  return Object.fromEntries(
    Object.entries(subschemas).map(([key, sub]) => {
      const mergedSubschema = sub.map(alt => {
        if (typeof alt !== 'boolean' && alt.required) {
          const properties: JSONSchema7['properties'] = {};
          if (schema.properties) {
            for (const k of alt.required) {
              if (k in schema.properties) {
                properties[k] = schema.properties[k];
              }
            }
          }
          Object.assign(properties, alt.properties);
          return {
            ...base,
            ...alt,
            properties,
          };
        }
        return alt;
      });
      return [key, mergedSubschema];
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

type Column = {
  key: string;
  title: (t: TranslationMessages<typeof scaffolderTranslationRef>) => string;
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
    <MarkdownContent content={(element.schema as JSONSchema7).title ?? ''} />
  ),
} as Column;

const descriptionColumn = {
  key: 'description',
  title: t => t('renderSchema.tableCell.description'),
  render: (element: SchemaRenderElement) => (
    <MarkdownContent
      content={(element.schema as JSONSchema7).description ?? ''}
    />
  ),
  className: 'description',
} as Column;

const enumFrom = (schema: JSONSchema7) => {
  if (schema.type === 'array') {
    if (schema.items && typeof schema.items !== 'boolean') {
      if (Array.isArray(schema.items)) {
        const itemsWithEnum = schema.items
          .filter(e => typeof e === 'object' && 'enum' in e)
          .map(e => e as JSONSchema7);
        if (itemsWithEnum.length) {
          return itemsWithEnum[0].enum;
        }
      } else {
        return schema.items?.enum;
      }
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
    canSubschema:
      Object.getOwnPropertyNames(schema).some(p =>
        compositeSchemaProperties.includes(p as any),
      ) || getTypes(schema)!.some(t => t.includes('object')),
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
        {types?.map((type, index) =>
          info.canSubschema || (info.hasEnum && index === 0) ? (
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

export const RenderEnum: FC<{
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
        let inner: JSX.Element = (
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
      const subschemas = getSubschemas(schema);
      let columns: Column[] | undefined;
      let elements: SchemaRenderElement[] | undefined;
      if (strategy === 'root') {
        if ('type' in schema || !Object.keys(subschemas).length) {
          elements = [{ schema }];
          columns = [typeColumn];
          if (schema.description) {
            columns.unshift(descriptionColumn);
          }
          if (schema.title) {
            columns.unshift(titleColumn);
          }
        }
      } else if (schema.properties) {
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
                    const rows = [
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
                      </TableRow>,
                    ];
                    if (
                      typeof el.schema !== 'boolean' &&
                      (info.canSubschema || info.hasEnum)
                    ) {
                      let details: ReactElement = (
                        <Box data-testid={`expansion_${id}`} sx={{ margin: 1 }}>
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
                                  ? (el.schema.items as JSONSchema7 | undefined)
                                  : el.schema
                              }
                            />
                          )}
                          {info.hasEnum && (
                            <>
                              {cloneElement(
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
                      );
                      if (getTypes(el.schema)) {
                        details = (
                          <Collapse
                            in={isExpanded[id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            {details}
                          </Collapse>
                        );
                      }
                      rows.push(
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={columns!.length}
                          >
                            {details}
                          </TableCell>
                        </TableRow>,
                      );
                    }
                    return <Fragment key={id}>{rows}</Fragment>;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {(Object.keys(subschemas) as Array<keyof subSchemasType>).map(sk => (
            <Fragment key={sk}>
              {cloneElement(context.headings[0], {}, sk)}
              {subschemas[sk]!.map((sub, index) => (
                <RenderSchema
                  key={index}
                  strategy={
                    typeof sub !== 'boolean' && 'properties' in sub
                      ? strategy
                      : 'root'
                  }
                  {...{
                    context: {
                      ...context,
                      parentId: `${context.parentId}_${sk}${index}`,
                    },
                    schema: sub,
                  }}
                />
              ))}
            </Fragment>
          ))}
        </>
      );
    }
    return undefined;
  })();
  return result ?? <Typography>No schema defined</Typography>;
};
