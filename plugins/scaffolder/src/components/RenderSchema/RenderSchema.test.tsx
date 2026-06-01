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
import { renderInTestApp } from '@backstage/test-utils';
import {
  BoundFunction,
  queries,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from 'json-schema';
import { useState } from 'react';
import { Expanded, SchemaRenderStrategy } from '.';
import { RenderEnum, RenderSchema } from './RenderSchema';

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "assert*"] }] */

const LocalRenderEnum = ({ e }: { e: JSONSchema7Type[] }) => {
  return <RenderEnum {...{ e }} />;
};

const LocalRenderSchema = ({
  strategy,
  schema,
}: {
  strategy: SchemaRenderStrategy;
  schema?: JSONSchema7Definition;
}) => {
  const expanded = useState<Expanded>({});
  return (
    <RenderSchema
      {...{
        strategy,
        schema,
        context: {
          parentId: 'test',
          expanded,
        },
      }}
    />
  );
};

it('enum rendering', async () => {
  const enums = [
    'foo',
    123,
    null,
    ['bar', 'baz'],
    { what: 'ever' },
    [{ fo: 'real?' }],
  ];
  const rendered = await renderInTestApp(<LocalRenderEnum {...{ e: enums }} />);
  const { getByTestId, findByTestId, queryByTestId } = rendered;

  const elements = enums.map((value, index) => ({
    index,
    value,
    complex: value !== null && ['array', 'object'].includes(typeof value),
  }));
  for (const each of elements.filter(e => !e.complex)) {
    const el = getByTestId(`enum_el${each.index}`);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent(JSON.stringify(each.value));
    expect(queryByTestId(`wrap-text_${each.index}`)).toBeNull();
  }
  for (const each of elements.filter(e => e.complex)) {
    const el = getByTestId(`enum_el${each.index}`);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent(JSON.stringify(each.value));

    const wrapTextButton = getByTestId(`wrap-text_${each.index}`);
    expect(wrapTextButton).toBeInTheDocument();

    expect(queryByTestId(`pretty_${each.index}`)).toBeNull();

    wrapTextButton.focus();

    const pretty = await findByTestId(`pretty_${each.index}`);
    expect(pretty).toBeInTheDocument();
    expect(pretty.textContent).toBe(JSON.stringify(each.value, null, 2));

    wrapTextButton.blur();

    await waitFor(() =>
      expect(queryByTestId(`pretty_${each.index}`)).toBeNull(),
    );
  }
});

describe('JSON schema UI rendering', () => {
  const basic: JSONSchema7 = {
    type: 'object',
    required: ['a'],
    properties: {
      a: {
        title: 'A',
        description: 'the string',
        type: 'string',
      },
      b: {
        title: 'B',
        description: 'the number',
        type: 'number',
      },
      c: {
        title: 'C',
        description: 'the boolean',
        type: 'boolean',
      },
    },
  };
  type qt = typeof queries;

  const getRowById = (container: HTMLElement, rowId: string): HTMLElement => {
    const el = container.querySelector(`[data-key="${rowId}"]`);
    if (!el) {
      throw new Error(`Could not find row with data-key="${rowId}"`);
    }
    return el as HTMLElement;
  };

  const queryRowById = (
    container: HTMLElement,
    rowId: string,
  ): HTMLElement | null => {
    return container.querySelector(`[data-key="${rowId}"]`);
  };

  const findRowById = (
    container: HTMLElement,
    rowId: string,
  ): Promise<HTMLElement> => {
    return waitFor(() => getRowById(container, rowId));
  };

  const assertBasicSchemaProperties = (
    q: {
      [P in keyof qt]: BoundFunction<qt[P]>;
    } & { container: HTMLElement },
    id: string,
  ) => {
    const { container, queryByTestId } = q;

    for (const p of Object.keys(basic.properties!)) {
      const tr = getRowById(container, `properties-row_${id}.${p}`);
      expect(tr).toBeInTheDocument();

      const pt = (basic.properties![p] as JSONSchema7).type;
      const headerCells = within(tr).queryAllByRole('rowheader');
      const dataCells = within(tr).getAllByRole('gridcell');
      const allCells = [...headerCells, ...dataCells];
      const cellTexts = allCells.map(c => c.textContent);

      expect(cellTexts[0]).toContain(p);
      const valueCell = cellTexts[1];
      expect(valueCell).toContain(String(pt));
      expect(valueCell).toContain(`the ${pt}`);

      if (basic.required?.includes(p)) {
        expect(cellTexts[0]).toContain('*');
      }

      expect(queryByTestId(`expand_${id}.${p}`)).not.toBeInTheDocument();
    }
  };

  const msv: JSONSchema7 = {
    title: 'MSV',
    description: 'metasyntactic variable',
    type: 'string',
    enum: ['foo', 'bar', 'baz'],
  };

  const assertMsv = (
    q: {
      [P in keyof qt]: BoundFunction<qt[P]>;
    },
    id: string,
  ) => {
    const { getByTestId } = q;
    const e = getByTestId(`enum_${id}`);
    expect(e).toBeInTheDocument();
    expect(e.tagName).toBe('UL');
    expect(e.querySelectorAll('li')).toHaveLength(msv.enum!.length);
  };

  const deep: JSONSchema7 = {
    title: 'Deep',
    description: 'object with deeply nested properties',
    type: 'object',
    properties: {
      basic,
      msvs: {
        title: 'MSVs',
        description: 'metasyntactic variable array',
        type: 'array',
        items: msv,
      },
    },
  };

  const assertDeepSchemaProperties = async (
    q: {
      [P in keyof qt]: BoundFunction<qt[P]>;
    } & { container: HTMLElement },
    id: string,
  ) => {
    const { container, findByTestId, getByTestId, queryByTestId } = q;

    const xp: (k: string) => Promise<{
      expander: HTMLElement;
      expansionId: string;
      expansion: HTMLElement;
    }> = async (k: string) => {
      const r = getRowById(container, `properties-row_${id}.${k}`);
      expect(r).toBeInTheDocument();

      const expansionId = `expansion_${id}.${k}`;

      expect(queryByTestId(expansionId)).not.toBeInTheDocument();

      const expander = getByTestId(`expand_${id}.${k}`);
      expect(expander).toBeInTheDocument();

      await userEvent.click(expander);

      const expansion = await findByTestId(expansionId);
      expect(expansion).toBeInTheDocument();
      return { expander, expansionId, expansion };
    };
    const b = await xp('basic');
    const m = await xp('msvs');

    assertBasicSchemaProperties(
      { ...within(b.expansion), container: b.expansion },
      `${id}.basic`,
    );
    assertMsv(within(m.expansion), `${id}.msvs`);

    await userEvent.click(b.expander);
    await userEvent.click(m.expander);

    await waitFor(() => {
      expect(queryByTestId(b.expansionId)).toBeNull();
      expect(queryByTestId(m.expansionId)).toBeNull();
    });
  };

  describe('root strategy', () => {
    it('undefined', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema={undefined} />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('true', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('false', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema={false} />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('basic', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema={basic} />,
      );
      const { findByTestId, getByTestId, queryByTestId } = rendered;

      const t = getByTestId('root_test');
      expect(t).toBeInTheDocument();

      expect(queryByTestId('expansion_test')).not.toBeInTheDocument();

      const expand = getByTestId('expand_test');
      expect(expand).toBeInTheDocument();

      await userEvent.click(expand);

      const expanded = await findByTestId('expansion_test');
      expect(expanded).toBeInTheDocument();

      assertBasicSchemaProperties(
        { ...within(expanded), container: expanded },
        'test',
      );

      await userEvent.click(expand);

      await waitFor(() => expect(queryByTestId('expansion_test')).toBeNull());
    });
    it('enum', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema={msv} />,
      );
      const { findByTestId, getByTestId, queryByTestId } = rendered;

      const t = getByTestId('root_test');
      expect(t).toBeInTheDocument();

      expect(queryByTestId('expansion_test')).not.toBeInTheDocument();

      const expand = getByTestId('expand_test');
      expect(expand).toBeInTheDocument();

      await userEvent.click(expand);

      const expansion = await findByTestId('expansion_test');
      expect(expansion).toBeInTheDocument();
      assertMsv(within(expansion), 'test');

      await userEvent.click(expand);

      await waitFor(() => expect(queryByTestId('expansion_test')).toBeNull());
    });
    it('deep', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="root" schema={deep} />,
      );
      const { findByTestId, getByTestId, queryByTestId } = rendered;

      const t = getByTestId('root_test');
      expect(t).toBeInTheDocument();

      expect(queryByTestId('expansion_test')).not.toBeInTheDocument();

      const expand = getByTestId('expand_test');
      expect(expand).toBeInTheDocument();

      await userEvent.click(expand);

      const expansion = await findByTestId('expansion_test');
      expect(expansion).toBeInTheDocument();

      await assertDeepSchemaProperties(
        { ...within(expansion), container: expansion },
        'test',
      );

      await userEvent.click(expand);

      await waitFor(() => expect(queryByTestId('expansion_test')).toBeNull());
    });
  });
  describe('properties strategy', () => {
    it('undefined', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema={undefined} />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('true', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('false', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema={false} />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('basic', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema={basic} />,
      );
      assertBasicSchemaProperties(rendered, 'test');
    });
    it('enum', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema={msv} />,
      );
      expect(rendered.getByText('No schema defined')).toBeInTheDocument();
    });
    it('deep', async () => {
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" schema={deep} />,
      );
      assertDeepSchemaProperties(rendered, 'test');
    });
    it('require oneOf', async () => {
      const schema: JSONSchema7 = {
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
          },
        },
        oneOf: [
          { required: ['foo'], properties: { fooFlag: { type: 'boolean' } } },
          { required: ['bar'], properties: { barFlag: { type: 'boolean' } } },
        ],
      };
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" {...{ schema }} />,
      );
      const { container, getByTestId } = rendered;

      for (const k of Object.keys(schema.properties!)) {
        const tr = getRowById(container, `properties-row_test.${k}`);
        expect(tr).toBeInTheDocument();
      }

      expect(
        queryRowById(container, 'properties-row_test_oneOf0.foo'),
      ).not.toBeInTheDocument();

      const expandOneOf = getByTestId('expand_test_oneOf');
      await userEvent.click(expandOneOf);

      for (const [i, k] of Object.keys(schema.properties!).entries()) {
        const sub = await findRowById(
          container,
          `properties-row_test_oneOf${i}.${k}`,
        );
        expect(sub).toBeInTheDocument();

        const nameCell =
          within(sub).queryAllByRole('rowheader')[0] ??
          within(sub).getAllByRole('gridcell')[0];
        expect(nameCell.textContent).toContain('*');

        expect(
          getRowById(container, `properties-row_test_oneOf${i}.${k}Flag`),
        ).toBeInTheDocument();
      }

      await userEvent.click(expandOneOf);

      await waitFor(() => {
        expect(
          queryRowById(container, 'properties-row_test_oneOf0.foo'),
        ).not.toBeInTheDocument();
      });
    });
    it('full oneOf', async () => {
      const schema: JSONSchema7 = {
        oneOf: [
          {
            properties: {
              guitar: {
                type: 'boolean',
              },
              string_gauge: {
                oneOf: [
                  {
                    type: 'number',
                  },
                  {
                    type: 'string',
                  },
                ],
              },
            },
          },
          {
            properties: {
              drum: {
                type: 'boolean',
              },
              stick_size: {
                type: 'string',
              },
            },
          },
        ],
      };
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" {...{ schema }} />,
      );

      const expandOneOf = rendered.getByTestId('expand_test_oneOf');
      await userEvent.click(expandOneOf);

      const subs = schema.oneOf as JSONSchema7[];
      for (const i of subs.keys()) {
        for (const k of Object.keys(subs[i].properties!)) {
          expect(
            await findRowById(
              rendered.container,
              `properties-row_test_oneOf${i}.${k}`,
            ),
          ).toBeInTheDocument();
        }
      }
    });
    it('property alternatives', async () => {
      const schema: JSONSchema7 = {
        properties: {
          bs: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'string',
              },
            ],
          },
        },
      };
      const rendered = await renderInTestApp(
        <LocalRenderSchema strategy="properties" {...{ schema }} />,
      );

      expect(
        queryRowById(rendered.container, 'root-row_test.bs_anyOf0'),
      ).not.toBeInTheDocument();

      const expandAnyOf = rendered.getByTestId('expand_test.bs_anyOf');
      await userEvent.click(expandAnyOf);

      expect(
        await findRowById(rendered.container, 'root-row_test.bs_anyOf0'),
      ).toBeInTheDocument();
      expect(
        getRowById(rendered.container, 'root-row_test.bs_anyOf1'),
      ).toBeInTheDocument();
    });
  });
});
