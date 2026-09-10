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

import {
  ComponentProps,
  RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { identityApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, mockApis } from '@backstage/test-utils';
import { Box, Button, Checkbox, Select, Text } from '@backstage/ui';
import { EntitySelectionPicker } from '../src/components/fields/EntitySelectionPicker/EntitySelectionPicker';
import { OwnerPicker } from '../src/components/fields/OwnerPicker/OwnerPicker';
import { MultiEntityPicker } from '../src/components/fields/MultiEntityPicker/MultiEntityPicker';
import { MyGroupsPicker } from '../src/components/fields/MyGroupsPicker/MyGroupsPicker';

const ownerFilter = { kind: ['User', 'Group'] };
const ComparisonOwnerPicker = memo(OwnerPicker);
const ComparisonMultiEntityPicker = memo(MultiEntityPicker);
const ComparisonMyGroupsPicker = memo(MyGroupsPicker);
const groupsFilter = {
  kind: 'Group',
  'relations.hasMember': 'user:default/demo',
};

export function EntitySelectionPickerPlayground() {
  const [mode, setMode] = useState('owner');
  const [count, setCount] = useState(100);
  const [delay, setDelay] = useState(300);
  const [failure, setFailure] = useState('none');
  const [frebenExists, setFrebenExists] = useState(false);
  const [allowMissing, setAllowMissing] = useState(true);
  const [itemLayout, setItemLayout] = useState<'inline' | 'list'>('inline');
  const [value, setValue] = useState<string[]>([]);
  const [legacyValue, setLegacyValue] = useState<string[]>([]);
  const calls = useRef<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const multiple = mode === 'multiple';
  const filter = mode === 'groups' ? groupsFilter : ownerFilter;

  const apis = useMemo(() => {
    const entities: Entity[] = Array.from({ length: count }, (_, index) => {
      const group = index % 2 === 0;
      const name = `${group ? 'team' : 'person'}-${String(index).padStart(
        5,
        '0',
      )}`;
      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: group ? 'Group' : 'User',
        metadata: {
          name,
          title: group ? `Engineering team ${index}` : `Developer ${index}`,
        },
        relations:
          group && index % 4 === 0
            ? [{ type: 'hasMember', targetRef: 'user:default/demo' }]
            : [],
      };
    });
    if (frebenExists)
      entities.push({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: 'freben', title: 'Fredrik Adelöw' },
      });
    const catalogApi = catalogApiMock({ entities });
    const query = catalogApi.queryEntities.bind(catalogApi);
    const refs = catalogApi.getEntitiesByRefs.bind(catalogApi);
    const wait = () => new Promise(resolve => setTimeout(resolve, delay));
    catalogApi.queryEntities = async (
      request: Parameters<CatalogApi['queryEntities']>[0],
    ) => {
      const page = request && 'cursor' in request;
      calls.current = [
        `query ${JSON.stringify(request)}`,
        ...calls.current,
      ].slice(0, 12);
      await wait();
      if (failure === 'catalog' || (failure === 'page' && page))
        throw new Error('Simulated catalog failure');
      return query(request);
    };
    catalogApi.getEntitiesByRefs = async request => {
      calls.current = [
        `refs ${JSON.stringify(request.entityRefs)}`,
        ...calls.current,
      ].slice(0, 12);
      await wait();
      if (failure === 'references')
        throw new Error('Simulated reference lookup failure');
      return refs(request);
    };
    return [
      [catalogApiRef, catalogApi],
      [
        entityPresentationApiRef,
        DefaultEntityPresentationApi.create({ catalogApi }),
      ],
      [
        identityApiRef,
        mockApis.identity({ userEntityRef: 'user:default/demo' }),
      ],
    ] as const;
  }, [count, delay, failure, frebenExists]);

  const oldProps = useMemo(
    () => ({
      schema: { title: 'Current picker', type: multiple ? 'array' : 'string' },
      uiSchema: {
        'ui:options': {
          catalogFilter: filter,
          defaultKind: 'Group',
          allowArbitraryValues: allowMissing,
        },
        'ui:disabled': disabled,
      },
      rawErrors: [],
      errors: [],
      required: false,
      idSchema: { $id: 'comparison-picker' },
      formData: multiple ? legacyValue : legacyValue[0],
      onChange: (next: string | string[] | undefined) =>
        setLegacyValue(next ? [next].flat() : []),
    }),
    [multiple, filter, allowMissing, disabled, legacyValue],
  );

  return (
    <Box p="6" bg="neutral">
      <Text as="h1" variant="title-large">
        Entity selection playground
      </Text>
      <Text as="p" color="secondary">
        Experimental alternative — not enabled in application fields
      </Text>
      <Text as="p">
        Search is only a filter. Select a row to commit a reference; Escape or
        Done dismisses the search. Try “freben” with virtual references enabled.
      </Text>
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <Select
          label="Scenario"
          value={mode}
          onChange={next => {
            setMode(String(next));
            setValue([]);
            setLegacyValue([]);
          }}
          options={[
            { value: 'owner', label: 'Single owner' },
            { value: 'multiple', label: 'Multiple entities (maximum 3)' },
            { value: 'groups', label: 'My groups' },
          ]}
        />
        <Select
          label="Catalog size"
          value={String(count)}
          onChange={next => setCount(Number(next))}
          options={[
            { value: '100', label: '100' },
            { value: '9000', label: '9,000' },
          ]}
        />
        <Select
          label="Latency"
          value={String(delay)}
          onChange={next => setDelay(Number(next))}
          options={[
            { value: '0', label: 'None' },
            { value: '300', label: '300 ms' },
            { value: '1500', label: '1.5 seconds' },
          ]}
        />
        <Select
          label="Failure"
          value={failure}
          onChange={next => setFailure(String(next))}
          options={[
            { value: 'none', label: 'None' },
            { value: 'catalog', label: 'Catalog queries' },
            { value: 'references', label: 'Exact lookups' },
            { value: 'page', label: 'Next page' },
          ]}
        />
        <Checkbox
          isSelected={itemLayout === 'list'}
          onChange={checked => setItemLayout(checked ? 'list' : 'inline')}
        >
          List selected items
        </Checkbox>
        <Checkbox isSelected={allowMissing} onChange={setAllowMissing}>
          Allow missing references
        </Checkbox>
        <Checkbox isSelected={frebenExists} onChange={setFrebenExists}>
          User freben exists in catalog
        </Checkbox>
        <Checkbox isSelected={disabled} onChange={setDisabled}>
          Disabled
        </Checkbox>
      </div>
      <TestApiProvider apis={apis}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          <Box p="6" bg="neutral">
            <Text as="h2" variant="title-small">
              Selection-first prototype
            </Text>
            <EntitySelectionPicker
              label={mode === 'groups' ? 'My groups' : 'Owners'}
              popupTitle={
                mode === 'groups'
                  ? 'Choose a group for this component'
                  : 'Choose owners for this component'
              }
              itemLayout={itemLayout}
              getItemHref={ref => {
                const { kind, namespace, name } = parseEntityRef(ref);
                return `/catalog/${encodeURIComponent(
                  kind,
                )}/${encodeURIComponent(namespace)}/${encodeURIComponent(
                  name,
                )}`;
              }}
              value={value}
              onChange={setValue}
              catalogFilter={filter}
              defaultKind="Group"
              multiple={multiple}
              maxItems={multiple ? 3 : undefined}
              allowMissingEntities={allowMissing && mode !== 'groups'}
              disabled={disabled}
            />
            <Box mt="4">
              <Text variant="body-x-small" color="secondary">
                Committed references
              </Text>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </Box>
          </Box>
          <Box p="6" bg="neutral">
            <Text as="h2" variant="title-small">
              Current paginated picker
            </Text>
            {mode === 'groups' ? (
              <ComparisonMyGroupsPicker
                {...(oldProps as unknown as ComponentProps<
                  typeof MyGroupsPicker
                >)}
              />
            ) : null}
            {multiple ? (
              <ComparisonMultiEntityPicker
                {...(oldProps as unknown as ComponentProps<
                  typeof MultiEntityPicker
                >)}
              />
            ) : null}
            {mode === 'owner' ? (
              <ComparisonOwnerPicker
                {...(oldProps as unknown as ComponentProps<typeof OwnerPicker>)}
              />
            ) : null}
            <Box mt="4">
              <Text variant="body-x-small" color="secondary">
                Committed references
              </Text>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(legacyValue, null, 2)}
              </pre>
            </Box>
          </Box>
        </div>
      </TestApiProvider>
      <Button
        variant="secondary"
        onPress={() => {
          setValue(['user:default/freben']);
          setLegacyValue(['user:default/freben']);
        }}
      >
        Load a saved freben selection
      </Button>
      <Text as="h2" variant="title-small">
        Recent catalog requests
      </Text>
      <RequestLog calls={calls} />
    </Box>
  );
}

function RequestLog({ calls }: { calls: RefObject<string[]> }) {
  const [snapshot, setSnapshot] = useState(calls.current);
  useEffect(() => {
    const interval = setInterval(() => setSnapshot(calls.current), 500);
    return () => clearInterval(interval);
  }, [calls]);
  return (
    <pre
      style={{ fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
    >
      {snapshot?.join('\n')}
    </pre>
  );
}
