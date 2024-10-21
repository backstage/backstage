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
import { renderInTestApp } from '@backstage/test-utils';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
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
import { capitalize, entries, filter, get, keys, map } from 'lodash';
import React, { useState } from 'react';
import { Expanded, SchemaRenderStrategy } from '.';
import { RenderEnum, RenderSchema } from './RenderSchema';

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "assert*"] }] */

const useStyles = makeStyles(theme => ({
  code: {
    fontFamily: 'Menlo, monospace',
    padding: theme.spacing(1),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    display: 'inline-block',
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: 'relative',
  },

  codeRequired: {
    '&::after': {
      position: 'absolute',
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: 'bolder',
      color: theme.palette.error.light,
    },
  },
}));

const LocalRenderEnum = ({ e }: { e: JSONSchema7Type[] }) => {
  const classes = useStyles();
  return <RenderEnum {...{ classes, e }} />;
};

const LocalRenderSchema = ({
  strategy,
  schema,
}: {
  strategy: SchemaRenderStrategy;
  schema?: JSONSchema7Definition;
}) => {
  const classes = useStyles();
  const expanded = useState<Expanded>({});
  return (
    <RenderSchema
      {...{
        strategy,
        schema,
        context: {
          parentId: 'test',
          classes,
          expanded,
          headings: [<Typography component="h1" />],
        },
      }}
    />
  );
};

it('enum rendering', async () => {
  const e = [
    'foo',
    123,
    null,
    ['bar', 'baz'],
    { what: 'ever' },
    [{ fo: 'real?' }],
  ];
  const rendered = await renderInTestApp(<LocalRenderEnum {...{ e }} />);
  const { getByTestId, findByTestId, queryByTestId } = rendered;

  const elements = e.map((value, index) => ({
    index,
    value,
    complex: value !== null && ['array', 'object'].includes(typeof value),
  }));
  for (const each of filter(elements, ['complex', false])) {
    const el = getByTestId(`enum_el${each.index}`);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent(JSON.stringify(each.value));
    expect(queryByTestId(`wrap-text_${each.index}`)).toBeNull();
  }
  for (const each of filter(elements, 'complete')) {
    const el = getByTestId(`enum_el${each.index}`);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent(JSON.stringify(each.value));

    const wrapTextIcon = getByTestId(`wrap-text_${each.index}`);
    expect(wrapTextIcon).toBeInTheDocument();

    expect(queryByTestId(`pretty_${each.index}`)).toBeNull();

    await userEvent.hover(wrapTextIcon);

    const pretty = await findByTestId(`pretty_${each.index}`);
    expect(pretty).toBeInTheDocument();
    expect(pretty).toHaveTextContent(JSON.stringify(each.value, null, 2));

    await userEvent.unhover(wrapTextIcon);

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
  const assertBasicSchemaProperties = (
    q: {
      [P in keyof qt]: BoundFunction<qt[P]>;
    },
    id: string,
  ) => {
    const { getByTestId, queryByTestId } = q;
    const t = getByTestId(`properties_${id}`);
    expect(t).toBeInTheDocument();
    expect(t.tagName).toBe('TABLE');

    expect(map(t.querySelectorAll('thead > tr > th'), 'textContent')).toEqual([
      'Name',
      'Title',
      'Description',
      'Type',
    ]);

    for (const p of keys(basic.properties)) {
      const tr = getByTestId(`properties-row_${id}.${p}`);
      expect(tr).toBeInTheDocument();
      expect(tr.tagName).toBe('TR');

      const pt = get(basic.properties, `${p}.type`);
      expect(map(tr.querySelectorAll('td'), 'textContent')).toEqual([
        p,
        capitalize(p),
        `the ${pt}`,
        pt,
      ]);
      expect(
        Array.from(within(tr).getByText(p).classList).some(c =>
          c.includes('codeRequired'),
        ),
      ).toBe(basic.required?.includes(p));

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
    },
    id: string,
  ) => {
    const { findByTestId, getByTestId, queryByTestId } = q;
    const t = getByTestId(`properties_${id}`);
    expect(t).toBeInTheDocument();
    expect(t.tagName).toBe('TABLE');

    expect(map(t.querySelectorAll('thead > tr > th'), 'textContent')).toEqual([
      'Name',
      'Title',
      'Description',
      'Type',
    ]);
    const xp: (k: string) => Promise<{
      expander: HTMLElement;
      expansionId: string;
      expansion: HTMLElement;
    }> = async (k: string) => {
      const r = getByTestId(`properties-row_${id}.${k}`);
      expect(r).toBeInTheDocument();
      expect(r.tagName).toBe('TR');

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

    assertBasicSchemaProperties(within(b.expansion), `${id}.basic`);
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
      expect(t.tagName).toBe('TABLE');

      expect(map(t.querySelectorAll('thead > tr > th'), 'textContent')).toEqual(
        ['Type'],
      );
      const tr = getByTestId('root-row_test');
      expect(tr).toBeInTheDocument();
      expect(tr.tagName).toBe('TR');

      expect(map(tr.querySelectorAll('td'), 'textContent')).toEqual(['object']);

      expect(queryByTestId('expansion_test')).not.toBeInTheDocument();

      const expand = getByTestId('expand_test');
      expect(expand).toBeInTheDocument();

      await userEvent.click(expand);

      const expanded = await findByTestId('expansion_test');
      expect(expanded).toBeInTheDocument();

      assertBasicSchemaProperties(within(expanded), 'test');

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
      expect(t.tagName).toBe('TABLE');

      expect(map(t.querySelectorAll('thead > tr > th'), 'textContent')).toEqual(
        ['Title', 'Description', 'Type'],
      );
      const tr = getByTestId('root-row_test');
      expect(tr).toBeInTheDocument();
      expect(tr.tagName).toBe('TR');

      expect(map(tr.querySelectorAll('td'), 'textContent')).toEqual([
        msv.title,
        msv.description,
        'string',
      ]);

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
      expect(t.tagName).toBe('TABLE');

      expect(map(t.querySelectorAll('thead > tr > th'), 'textContent')).toEqual(
        ['Title', 'Description', 'Type'],
      );
      const tr = getByTestId('root-row_test');
      expect(tr).toBeInTheDocument();
      expect(tr.tagName).toBe('TR');

      expect(map(tr.querySelectorAll('td'), 'textContent')).toEqual([
        deep.title,
        deep.description,
        'object',
      ]);
      expect(queryByTestId('expansion_test')).not.toBeInTheDocument();

      const expand = getByTestId('expand_test');
      expect(expand).toBeInTheDocument();

      await userEvent.click(expand);

      const expansion = await findByTestId('expansion_test');
      expect(expansion).toBeInTheDocument();

      await assertDeepSchemaProperties(within(expansion), 'test');

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
      const { getByTestId } = rendered;

      for (const [i, k] of entries(keys(schema.properties))) {
        const tr = getByTestId(`properties-row_test.${k}`);
        expect(tr).toBeInTheDocument();

        const sub = getByTestId(`properties-row_test_sub${i}.${k}`);
        expect(sub).toBeInTheDocument();

        expect(
          Array.from(within(sub).getByText(k).classList).some(c =>
            c.includes('codeRequired'),
          ),
        ).toBe(true);

        expect(
          getByTestId(`properties-row_test_sub${i}.${k}Flag`),
        ).toBeInTheDocument();
      }
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
      const subs = schema.oneOf as JSONSchema7[];
      for (const i of subs.keys()) {
        for (const k of keys(subs[i].properties!)) {
          expect(
            rendered.getByTestId(`properties-row_test_sub${i}.${k}`),
          ).toBeInTheDocument();
        }
      }
    });
  });
});
