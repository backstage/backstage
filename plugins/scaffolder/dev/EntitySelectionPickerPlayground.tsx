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
import { Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { identityApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, mockApis } from '@backstage/test-utils';
import { Content, Header, Page } from '@backstage/core-components';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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
  const [palette, setPalette] = useState<'mui' | 'bui'>('mui');
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
    <Page themeId="tool">
      <Header
        title="Entity selection playground"
        subtitle="Experimental alternative — not enabled in application fields"
      />
      <Content>
        <Typography paragraph>
          Search is only a filter. Select a row to commit a reference; Escape or
          Done dismisses the search. Try “freben” with virtual references
          enabled.
        </Typography>
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <TextField
            style={{ minWidth: 140 }}
            select
            label="Scenario"
            value={mode}
            onChange={event => {
              setMode(event.target.value);
              setValue([]);
              setLegacyValue([]);
            }}
          >
            <MenuItem value="owner">Single owner</MenuItem>
            <MenuItem value="multiple">Multiple entities (maximum 3)</MenuItem>
            <MenuItem value="groups">My groups</MenuItem>
          </TextField>
          <TextField
            style={{ minWidth: 100 }}
            select
            label="Catalog size"
            value={count}
            onChange={event => setCount(Number(event.target.value))}
          >
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={9000}>9,000</MenuItem>
          </TextField>
          <TextField
            style={{ minWidth: 100 }}
            select
            label="Latency"
            value={delay}
            onChange={event => setDelay(Number(event.target.value))}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={300}>300 ms</MenuItem>
            <MenuItem value={1500}>1.5 seconds</MenuItem>
          </TextField>
          <TextField
            style={{ minWidth: 140 }}
            select
            label="Failure"
            value={failure}
            onChange={event => setFailure(event.target.value)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="catalog">Catalog queries</MenuItem>
            <MenuItem value="references">Exact lookups</MenuItem>
            <MenuItem value="page">Next page</MenuItem>
          </TextField>
          <TextField
            style={{ minWidth: 140 }}
            select
            label="Popover palette"
            value={palette}
            onChange={event => setPalette(event.target.value as 'mui' | 'bui')}
          >
            <MenuItem value="mui">MUI</MenuItem>
            <MenuItem value="bui">BUI tokens</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowMissing}
                onChange={event => setAllowMissing(event.target.checked)}
              />
            }
            label="Allow missing references"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={frebenExists}
                onChange={event => setFrebenExists(event.target.checked)}
              />
            }
            label="User freben exists in catalog"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={disabled}
                onChange={event => setDisabled(event.target.checked)}
              />
            }
            label="Disabled"
          />
        </div>
        <TestApiProvider apis={apis}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            <Paper style={{ padding: 24 }}>
              <Typography variant="h6" gutterBottom>
                Selection-first prototype
              </Typography>
              <EntitySelectionPicker
                label={mode === 'groups' ? 'My groups' : 'Owners'}
                value={value}
                onChange={setValue}
                catalogFilter={filter}
                defaultKind="Group"
                multiple={multiple}
                maxItems={multiple ? 3 : undefined}
                allowMissingEntities={allowMissing && mode !== 'groups'}
                disabled={disabled}
                theme={palette}
              />
              <Typography variant="caption">Committed references</Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </Paper>
            <Paper style={{ padding: 24 }}>
              <Typography variant="h6" gutterBottom>
                Current paginated picker
              </Typography>
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
                  {...(oldProps as unknown as ComponentProps<
                    typeof OwnerPicker
                  >)}
                />
              ) : null}
              <Typography variant="caption">Committed references</Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(legacyValue, null, 2)}
              </pre>
            </Paper>
          </div>
        </TestApiProvider>
        <Button
          onClick={() => {
            setValue(['user:default/freben']);
            setLegacyValue(['user:default/freben']);
          }}
        >
          Load a saved freben selection
        </Button>
        <Typography variant="h6">Recent catalog requests</Typography>
        <RequestLog calls={calls} />
      </Content>
    </Page>
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
