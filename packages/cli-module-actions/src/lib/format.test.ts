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

import chalk from 'chalk';
import {
  formatActionList,
  formatActionHelp,
  flagDefsToFlagInfo,
} from './format';

chalk.level = 0;

describe('formatActionList', () => {
  it('renders grouped actions with headers and titles', () => {
    const output = formatActionList([
      {
        pluginId: 'catalog',
        actions: [
          {
            id: 'catalog:refresh',
            name: 'refresh',
            title: 'Refresh Entity',
            description: 'Refreshes an entity',
            schema: { input: {}, output: {} },
          },
          {
            id: 'catalog:delete',
            name: 'delete',
            title: 'Delete Entity',
            schema: { input: {}, output: {} },
          },
        ],
      },
    ]);

    expect(output).toContain('── catalog ');
    expect(output).toContain('catalog:refresh');
    expect(output).toContain('Refresh Entity');
    expect(output).toContain('catalog:delete');
    expect(output).toContain('Delete Entity');
    expect(output).not.toContain('Refreshes an entity');
  });

  it('shows only the id when the action has no title', () => {
    const output = formatActionList([
      {
        pluginId: 'test',
        actions: [
          {
            id: 'test:no-title',
            name: 'no-title',
            schema: { input: {}, output: {} },
          },
        ],
      },
    ]);

    const actionLine = output
      .split('\n')
      .find(l => l.includes('test:no-title'));
    expect(actionLine).toBeDefined();
    expect(actionLine!.trim()).toBe('test:no-title');
  });

  it('renders multiple groups with blank line separators', () => {
    const output = formatActionList([
      {
        pluginId: 'catalog',
        actions: [
          {
            id: 'catalog:refresh',
            name: 'refresh',
            title: 'Refresh',
            schema: { input: {}, output: {} },
          },
        ],
      },
      {
        pluginId: 'scaffolder',
        actions: [
          {
            id: 'scaffolder:run',
            name: 'run',
            title: 'Run',
            schema: { input: {}, output: {} },
          },
        ],
      },
    ]);

    expect(output).toContain('── catalog ');
    expect(output).toContain('── scaffolder ');
  });
});

describe('flagDefsToFlagInfo', () => {
  it('converts cleye flag defs to display-ready flag info', () => {
    const result = flagDefsToFlagInfo({
      name: { type: String, description: 'The name' },
      count: { type: Number, description: 'How many' },
      verbose: { type: Boolean, description: 'Verbose output' },
    });

    expect(result).toEqual([
      { name: 'name', type: 'string', description: 'The name' },
      { name: 'count', type: 'number', description: 'How many' },
      { name: 'verbose', type: '', description: 'Verbose output' },
    ]);
  });
});

describe('formatActionHelp', () => {
  it('renders action id, title, description, usage, and flags', async () => {
    const output = await formatActionHelp({
      action: {
        id: 'catalog:refresh',
        title: 'Refresh Entity',
        description:
          'Refreshes a **catalog** entity from its `source` location.',
      },
      usage: 'backstage-cli actions execute catalog:refresh',
      flags: [
        {
          name: 'entity-ref',
          type: 'string',
          description: 'Entity reference (required)',
        },
        {
          name: 'dry-run',
          type: 'boolean',
          description: 'Preview without making changes',
        },
      ],
    });

    expect(output).toContain('catalog:refresh');
    expect(output).toContain('Refresh Entity');
    expect(output).toContain('catalog');
    expect(output).toContain('source');
    expect(output).toContain('Usage:');
    expect(output).toContain('backstage-cli actions execute catalog:refresh');
    expect(output).toContain('Flags:');
    expect(output).toContain('--entity-ref');
    expect(output).toContain('--dry-run');
  });

  it('renders without description when not provided', async () => {
    const output = await formatActionHelp({
      action: { id: 'catalog:refresh', title: 'Refresh' },
      usage: 'backstage-cli actions execute catalog:refresh',
      flags: [],
    });

    expect(output).toContain('catalog:refresh');
    expect(output).toContain('Refresh');
    expect(output).toContain('Usage:');
    expect(output).not.toContain('Flags:');
  });

  it('renders without title when not provided', async () => {
    const output = await formatActionHelp({
      action: { id: 'catalog:refresh' },
      usage: 'backstage-cli actions execute catalog:refresh',
      flags: [],
    });

    expect(output).toContain('catalog:refresh');
    expect(output).toContain('Usage:');
  });
});
