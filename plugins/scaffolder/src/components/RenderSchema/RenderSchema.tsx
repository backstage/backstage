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
  MarkdownContent,
  ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  ShadcnButton,
  Card,
  cn,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ChevronUp, ChevronDown, WrapText } from 'lucide-react';
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from 'json-schema';
import { FC, JSX, cloneElement, Fragment, ReactElement, useState } from 'react';
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

/** Tailwind class strings replacing MUI makeStyles for table column widths */
const columnStyles = {
  description: 'w-[40%] whitespace-normal break-words',
  standard: 'whitespace-normal',
} as const;

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
  className?: keyof typeof columnStyles;
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
        className={cn(
          context.classes.code,
          element.required && context.classes.codeRequired,
        )}
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
      return <span className="text-sm">{element.schema ? 'any' : 'none'}</span>;
    }
    const types = getTypes(element.schema);
    const [isExpanded, setIsExpanded] = context.expanded;
    const id = generateId(element, context);
    const info = inspectSchema(element.schema);
    return (
      <>
        {types?.map((type, index) =>
          info.canSubschema || (info.hasEnum && index === 0) ? (
            <Badge
              data-testid={`expand_${id}`}
              key={type}
              variant="outline"
              className="cursor-pointer gap-1"
              onClick={() =>
                setIsExpanded(prevState => ({
                  ...prevState,
                  [id]: !prevState[id],
                }))
              }
            >
              {isExpanded[id] ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {type}
            </Badge>
          ) : (
            <Badge key={type} variant="outline">
              {type}
            </Badge>
          ),
        )}
      </>
    );
  },
} as Column;

/**
 * Inline tooltip for complex enum values — renders pretty-printed JSON on hover.
 * Uses shadcn/ui Button styling for the trigger and Tailwind classes for the
 * tooltip content, avoiding Radix Tooltip's animation-based mount/unmount
 * lifecycle which is incompatible with JSDOM test environments.
 */
const EnumValueTooltip = ({
  value,
  index,
  classes,
}: {
  value: JSONSchema7Type;
  index: number;
  classes: Record<string, string>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ShadcnButton
        variant="ghost"
        size="icon"
        data-testid={`wrap-text_${index}`}
        className="h-8 w-8"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <WrapText className="h-4 w-4" />
      </ShadcnButton>
      {open && (
        <span
          data-testid={`pretty_${index}`}
          className={cn(
            classes.code,
            'whitespace-pre-wrap absolute z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground',
          )}
        >
          {JSON.stringify(value, undefined, 2)}
        </span>
      )}
    </>
  );
};

export const RenderEnum: FC<{
  e: JSONSchema7Type[];
  classes: Record<string, string>;
  [key: string]: any;
}> = ({
  e,
  classes,
  ...props
}: {
  e: JSONSchema7Type[];
  classes: Record<string, string>;
}) => {
  return (
    <ul className="list-none p-0 m-0" {...props}>
      {e.map((v, i) => {
        let inner: JSX.Element = (
          <span data-testid={`enum_el${i}`} className={cn(classes.code)}>
            {JSON.stringify(v)}
          </span>
        );
        if (v !== null && ['object', 'array'].includes(typeof v)) {
          inner = (
            <>
              {inner}
              <EnumValueTooltip value={v} index={i} classes={classes} />
            </>
          );
        }
        return (
          <li key={i} className="py-1">
            {inner}
          </li>
        );
      })}
    </ul>
  );
};

/** Tailwind class string replacing MUI makeStyles for the schema table container */
const tableSchemaClass =
  'w-full overflow-x-hidden [&_table]:w-full [&_table]:table-fixed';

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
            <Card className={tableSchemaClass}>
              <ShadcnTable data-testid={`${strategy}_${context.parentId}`}>
                <TableHeader>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableHead
                        key={index}
                        className={columnStyles[col.className ?? 'standard']}
                      >
                        {col.title(t)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elements.map(el => {
                    const id = generateId(el, context);
                    const info = inspectSchema(el.schema);
                    const rows = [
                      <TableRow
                        key={`${id}-main`}
                        data-testid={`${strategy}-row_${id}`}
                      >
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
                        <div data-testid={`expansion_${id}`} className="m-2">
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
                        </div>
                      );
                      if (getTypes(el.schema)) {
                        details = isExpanded[id] ? details : null!;
                      }
                      rows.push(
                        <TableRow key={`${id}-details`}>
                          <TableCell className="p-0" colSpan={columns!.length}>
                            {details}
                          </TableCell>
                        </TableRow>,
                      );
                    }
                    return <Fragment key={id}>{rows}</Fragment>;
                  })}
                </TableBody>
              </ShadcnTable>
            </Card>
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
  return (
    result ?? <p className="text-sm text-muted-foreground">No schema defined</p>
  );
};
