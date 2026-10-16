/*
 * Copyright 2026 The Backstage Authors
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
import { act, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { ReviewState } from './ReviewState';
import {
  ReviewStateContent,
  ReviewStateContentProps,
} from './ReviewStateContent';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

const schema = {
  title: 'Example',
  mergedSchema: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        title: 'Responsible',
        'ui:field': 'EntityPicker',
      },
      hidden: { type: 'string', 'ui:backstage': { review: { show: false } } },
      secret: { type: 'string', 'ui:field': 'Secret' },
      password: { type: 'string', 'ui:widget': 'password' },
      masked: {
        type: 'string',
        'ui:backstage': { review: { mask: 'MASKED' } },
      },
      nested: {
        type: 'object',
        properties: { repo: { type: 'string', title: 'Repository' } },
      },
      list: { type: 'array', items: { type: 'string' } },
      environment: {
        type: 'string',
        enum: ['development'],
        enumNames: ['Development'],
      },
    },
  },
} as unknown as ParsedTemplateSchema;
const state = {
  owner: 'user:default/alice',
  hidden: 'hidden-original',
  secret: 'secret-original',
  password: 'password-original',
  masked: 'masked-original',
  nested: { repo: 'gitlab.example.com?owner=org%2Fteam&repo=example' },
  list: ['user:default/alice'],
  environment: 'development',
};

it('preserves native default presentation', async () => {
  renderInTestApp(<ReviewState schemas={[schema]} formState={state} />);
  expect(await screen.findByText('Responsible')).toBeInTheDocument();
  expect(
    screen.getAllByText('user:default/alice', { exact: true }),
  ).toHaveLength(2);
  expect(screen.getByText('Development')).toBeInTheDocument();
  expect(screen.queryByText('hidden-original')).not.toBeInTheDocument();
  expect(screen.queryByText('secret-original')).not.toBeInTheDocument();
});

it('loads a real NFS swap after masking and detaches values from submission state', async () => {
  let captured: ReviewStateContentProps | undefined;
  const replacement = (props: ReviewStateContentProps) => {
    captured = props;
    return <div>Readable review</div>;
  };
  const module = createFrontendModule({
    pluginId: 'app',
    extensions: [
      SwappableComponentBlueprint.make({
        name: 'review-presentation',
        params: defineParams =>
          defineParams({
            component: ReviewStateContent,
            loader: () => replacement,
          }),
      }),
    ],
  });
  const before = JSON.stringify(state);
  renderInTestApp(<ReviewState schemas={[schema]} formState={state} />, {
    features: [module],
  });
  expect(await screen.findByText('Readable review')).toBeInTheDocument();
  expect(JSON.stringify(captured)).not.toMatch(
    /hidden-original|secret-original|password-original|masked-original/,
  );
  expect(captured?.items.find(x => x.path === '/owner')?.fieldType).toBe(
    'EntityPicker',
  );
  expect(captured?.items.find(x => x.path === '/nested/repo')?.label).toBe(
    'Repository',
  );
  const list = captured?.items.find(x => x.path === '/list')
    ?.displayValue as string[];
  list.push('presentation-only');
  expect(JSON.stringify(state)).toBe(before);
  expect(
    captured?.items.find(x => x.path === '/environment')?.displayValue,
  ).toBe('Development');
});

it('distinguishes literal separators from nested field paths', async () => {
  let captured: ReviewStateContentProps | undefined;
  const replacement = (props: ReviewStateContentProps) => {
    captured = props;
    return <div>Escaped review</div>;
  };
  const module = createFrontendModule({
    pluginId: 'app',
    extensions: [
      SwappableComponentBlueprint.make({
        name: 'escaped-review',
        params: defineParams =>
          defineParams({
            component: ReviewStateContent,
            loader: () => replacement,
          }),
      }),
    ],
  });
  const escapedSchema = {
    title: 'Escaped fields',
    mergedSchema: {
      type: 'object',
      properties: {
        'a/b': { type: 'string', title: 'Literal slash' },
        a: {
          type: 'object',
          properties: { b: { type: 'string', title: 'Nested' } },
        },
        'a~b': { type: 'string', title: 'Literal tilde' },
      },
    },
  } as unknown as ParsedTemplateSchema;
  renderInTestApp(
    <ReviewState
      schemas={[escapedSchema]}
      formState={{
        'a/b': 'literal',
        a: { b: 'nested' },
        'a~b': 'tilde',
        'unknown/~': 'fallback',
      }}
    />,
    { features: [module] },
  );
  expect(await screen.findByText('Escaped review')).toBeInTheDocument();
  expect(
    captured?.items.map(item => [item.path, item.label, item.displayValue]),
  ).toEqual([
    ['/a~1b', 'Literal slash', 'literal'],
    ['/a/b', 'Nested', 'nested'],
    ['/a~0b', 'Literal tilde', 'tilde'],
    ['/unknown~1~0', 'Unknown > ', 'fallback'],
  ]);
});

it('keeps native metadata visible until a deferred replacement resolves', async () => {
  const replacement = () => <div>Deferred review</div>;
  let resolveLoader!: (component: typeof replacement) => void;
  const pending = new Promise<typeof replacement>(resolve => {
    resolveLoader = resolve;
  });
  const loader = jest.fn(() => pending);
  const module = createFrontendModule({
    pluginId: 'app',
    extensions: [
      SwappableComponentBlueprint.make({
        name: 'deferred-review',
        params: defineParams =>
          defineParams({ component: ReviewStateContent, loader }),
      }),
    ],
  });
  renderInTestApp(<ReviewState schemas={[schema]} formState={state} />, {
    features: [module],
  });
  expect(await screen.findByText('Responsible')).toBeInTheDocument();
  expect(loader).toHaveBeenCalled();
  expect(screen.getByText('Development')).toBeInTheDocument();
  expect(screen.queryByText('Deferred review')).not.toBeInTheDocument();
  expect(screen.queryByText('secret-original')).not.toBeInTheDocument();
  await act(async () => {
    resolveLoader(replacement);
  });
  expect(await screen.findByText('Deferred review')).toBeInTheDocument();
  expect(screen.queryByText('Responsible')).not.toBeInTheDocument();
});
