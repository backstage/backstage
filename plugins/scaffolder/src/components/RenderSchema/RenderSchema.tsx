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
import {
  Button,
  Cell,
  CellText,
  ColumnConfig,
  Flex,
  Table,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@backstage/ui';
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from 'json-schema';
import { FC } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { SchemaRenderContext, SchemaRenderStrategy } from './types';

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

interface SchemaTableItem {
  id: string;
  schema: JSONSchema7Definition;
  propKey?: string;
  required?: boolean;
}

const generateId = (
  item: { propKey?: string },
  context: SchemaRenderContext,
) => {
  return item.propKey
    ? `${context.parentId}.${item.propKey}`
    : context.parentId;
};

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

export const RenderEnum: FC<{
  e: JSONSchema7Type[];
  [key: string]: any;
}> = ({ e, ...props }: { e: JSONSchema7Type[] }) => {
  return (
    <ul {...props} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {e.map((v, i) => {
        const text = JSON.stringify(v);
        const isComplex = v !== null && ['object', 'array'].includes(typeof v);
        return (
          <li key={i} style={{ padding: '2px 0' }}>
            <Flex gap="2" align="center">
              <Text
                as="span"
                variant="body-small"
                data-testid={`enum_el${i}`}
                style={{ fontFamily: 'monospace' }}
              >
                {text}
              </Text>
              {isComplex && (
                <TooltipTrigger>
                  <Button
                    data-testid={`wrap-text_${i}`}
                    variant="tertiary"
                    size="small"
                    aria-label="Show formatted value"
                  >
                    ↵
                  </Button>
                  <Tooltip>
                    <Text
                      as="span"
                      data-testid={`pretty_${i}`}
                      style={{
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {JSON.stringify(v, undefined, 2)}
                    </Text>
                  </Tooltip>
                </TooltipTrigger>
              )}
            </Flex>
          </li>
        );
      })}
    </ul>
  );
};

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

  const columnConfig: ColumnConfig<SchemaTableItem>[] =
    strategy === 'root'
      ? [
          {
            id: 'value',
            label: t('renderSchema.tableCell.value'),
            isRowHeader: true,
            defaultWidth: '3fr',
            cell: item => <ValueCell item={item} context={context} />,
          },
        ]
      : [
          {
            id: 'name',
            label: t('renderSchema.tableCell.name'),
            isRowHeader: true,
            defaultWidth: 300,
            cell: item => {
              const name = item.propKey ?? '';
              return (
                <Cell>
                  <Text
                    as="span"
                    variant="body-medium"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {item.required ? `${name} *` : name}
                  </Text>
                </Cell>
              );
            },
          },
          {
            id: 'value',
            label: t('renderSchema.tableCell.value'),
            defaultWidth: '1fr',
            cell: item => <ValueCell item={item} context={context} />,
          },
        ];

  const result = (() => {
    if (typeof schema === 'object') {
      const subschemas = getSubschemas(schema);
      let data: SchemaTableItem[] | undefined;
      if (strategy === 'root') {
        if ('type' in schema || !Object.keys(subschemas).length) {
          data = [{ id: `root-row_${context.parentId}`, schema }];
        }
      } else if (schema.properties) {
        data = Object.entries(schema.properties).map(([key, v]) => ({
          id: `${strategy}-row_${context.parentId}.${key}`,
          schema: v,
          propKey: key,
          required: schema.required?.includes(key),
        }));
      } else if (!Object.keys(subschemas).length) {
        return undefined;
      }
      const [isExpanded, setIsExpanded] = context.expanded;

      return (
        <Flex direction="column" gap="2">
          {data && (
            <div data-testid={`${strategy}_${context.parentId}`}>
              <Table
                columnConfig={columnConfig}
                data={data}
                pagination={{ type: 'none' }}
              />
            </div>
          )}
          {(Object.keys(subschemas) as Array<keyof subSchemasType>).map(sk => {
            const subId = `${context.parentId}_${sk}`;
            const isSubOpen = isExpanded[subId];
            return (
              <Flex key={sk} direction="column" gap="2">
                <Button
                  data-testid={`expand_${subId}`}
                  variant="tertiary"
                  size="small"
                  onPress={() =>
                    setIsExpanded(prevState => ({
                      ...prevState,
                      [subId]: !prevState[subId],
                    }))
                  }
                  style={{ alignSelf: 'flex-start' }}
                >
                  {isSubOpen ? '▴' : '▾'} {sk}
                </Button>
                {isSubOpen &&
                  subschemas[sk]!.map((sub, index) => (
                    <RenderSchema
                      key={index}
                      strategy={
                        typeof sub !== 'boolean' && 'properties' in sub
                          ? strategy
                          : 'root'
                      }
                      context={{
                        ...context,
                        parentId: `${context.parentId}_${sk}${index}`,
                      }}
                      schema={sub}
                    />
                  ))}
              </Flex>
            );
          })}
        </Flex>
      );
    }
    return undefined;
  })();
  return result ?? <Text as="p">{t('renderSchema.undefined')}</Text>;
};

function RenderExpansion({
  item,
  context,
}: {
  item: SchemaTableItem;
  context: SchemaRenderContext;
}) {
  const id = generateId(item, context);
  const info = inspectSchema(item.schema);
  const hasDetails =
    typeof item.schema !== 'boolean' && (info.canSubschema || info.hasEnum);
  const s =
    typeof item.schema !== 'boolean' ? (item.schema as JSONSchema7) : undefined;
  const [isExpanded] = context.expanded;
  const isOpen = hasDetails && s && (!getTypes(s) || isExpanded[id]);

  if (!isOpen) {
    return null;
  }

  return (
    <div data-testid={`expansion_${id}`} style={{ paddingLeft: 16 }}>
      {info.canSubschema && (
        <RenderSchema
          strategy="properties"
          context={{
            ...context,
            parentId: id,
            parent: context,
          }}
          schema={
            s!.type === 'array' ? (s!.items as JSONSchema7 | undefined) : s
          }
        />
      )}
      {info.hasEnum && (
        <>
          <Text as="h4" variant="title-small" weight="bold">
            Valid values:
          </Text>
          <RenderEnum data-testid={`enum_${id}`} e={enumFrom(s!)!} />
        </>
      )}
    </div>
  );
}

function ValueCell({
  item,
  context,
}: {
  item: SchemaTableItem;
  context: SchemaRenderContext;
}) {
  if (typeof item.schema === 'boolean') {
    return <CellText title={item.schema ? 'any' : 'none'} />;
  }
  const types = getTypes(item.schema);
  const [isExpanded, setIsExpanded] = context.expanded;
  const id = generateId(item, context);
  const info = inspectSchema(item.schema);
  const { title, description } = item.schema;
  return (
    <Cell>
      <Flex direction="column" gap="1">
        <Flex gap="1" align="center">
          {types?.map((type, index) =>
            (info.canSubschema || info.hasEnum) && index === 0 ? (
              <Button
                key={type}
                data-testid={`expand_${id}`}
                variant="tertiary"
                size="small"
                onPress={() =>
                  setIsExpanded(prevState => ({
                    ...prevState,
                    [id]: !prevState[id],
                  }))
                }
              >
                {isExpanded[id] ? '▴' : '▾'} {type}
              </Button>
            ) : (
              <Text
                key={type}
                as="span"
                variant="body-small"
                color="secondary"
                style={{
                  fontFamily: 'monospace',
                  background: 'var(--bui-bg-neutral-2)',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                {type}
              </Text>
            ),
          )}
        </Flex>
        {title && <MarkdownContent content={title} />}
        {description && <MarkdownContent content={description} />}
        <RenderExpansion item={item} context={context} />
      </Flex>
    </Cell>
  );
}
