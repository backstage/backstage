/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { DefaultCatalogRulesEnforcer } from './CatalogRules';
import { LocationSpec } from '@backstage/plugin-catalog-common';

const entity = {
  user: {
    kind: 'User',
  } as Entity,
  group: {
    kind: 'Group',
  } as Entity,
  component: {
    kind: 'component',
  } as Entity,
  location: {
    kind: 'Location',
  } as Entity,
};

const location: Record<string, LocationSpec> = {
  v: {
    type: 'url',
    target: 'https://github.com/b/c/blob/master/.folder/v.yaml',
  },
  w: {
    type: 'url',
    target: 'https://github.com/b/c/blob/master/w.yaml',
  },
  x: {
    type: 'url',
    target: 'https://github.com/a/b/blob/master/x.yaml',
  },
  y: {
    type: 'url',
    target: 'https://github.com/a/b/blob/master/y.yaml',
  },
  z: {
    type: 'file',
    target: '/root/z.yaml',
  },
};

describe('DefaultCatalogRulesEnforcer', () => {
  it('should throw an error if both pattern and exact are used', () => {
    expect(() =>
      DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [
              {
                allow: ['Component'],
                locations: [
                  {
                    type: 'url',
                    pattern: 'https://github.com/b/**',
                    exact: 'https://github.com/a/b/blob/master/w.yaml',
                  },
                ],
              },
            ],
          },
        }),
      ),
    ).toThrow(/cannot have both exact and pattern values/i);
  });
  it('should deny by default', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
    expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
  });

  it('should deny all', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([{ allow: [] }]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
    expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
  });

  it('should allow all', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([
      {
        allow: ['User', 'Group', 'Component', 'Location'].map(kind => ({
          kind,
        })),
      },
    ]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(true);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
    expect(enforcer.isAllowed(entity.location, location.z)).toBe(true);
  });

  it('should deny groups', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([
      { allow: [{ kind: 'User' }, { kind: 'Component' }] },
    ]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
    expect(enforcer.isAllowed(entity.group, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.z)).toBe(false);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
  });

  it('should deny groups from github', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([
      { allow: [{ kind: 'User' }, { kind: 'Component' }] },
      { allow: [{ kind: 'Group' }], locations: [{ type: 'file' }] },
    ]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
    expect(enforcer.isAllowed(entity.group, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.z)).toBe(true);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
  });

  it('should allow groups from files', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([
      { allow: [{ kind: 'Group' }], locations: [{ type: 'file' }] },
    ]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.z)).toBe(true);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
  });

  it('should not be sensitive to kind case', () => {
    const enforcer = new DefaultCatalogRulesEnforcer([
      { allow: [{ kind: 'group' }] },
      { allow: [{ kind: 'Component' }] },
    ]);
    expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
    expect(enforcer.isAllowed(entity.group, location.x)).toBe(true);
    expect(enforcer.isAllowed(entity.group, location.y)).toBe(true);
    expect(enforcer.isAllowed(entity.group, location.z)).toBe(true);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
  });

  describe('fromConfig', () => {
    it('should allow components by default', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({}),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
      expect(enforcer.isAllowed(entity.location, location.z)).toBe(true);
    });

    it('should deny all', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({ catalog: { rules: [] } }),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
      expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
    });

    it('should allow all', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [{ allow: ['User', 'Group'] }, { allow: ['Component'] }],
          },
        }),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(true);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
    });

    it('should deny groups', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: { rules: [{ allow: ['User'] }, { allow: ['Component'] }] },
        }),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.x)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.z)).toBe(false);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(true);
      expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
    });

    it('should allow groups from a specific github location', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [{ allow: ['user'] }],
            locations: [
              {
                type: 'url',
                target: 'https://github.com/a/b/blob/master/x.yaml',
                rules: [
                  {
                    allow: ['Group'],
                  },
                ],
              },
            ],
          },
        }),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.x)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.z)).toBe(false);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
      expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
    });

    it('should not care about location configuration in catalog.rules', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [{ allow: ['Group'] }],
          },
        }),
      );
      expect(enforcer.isAllowed(entity.user, location.x)).toBe(false);
      expect(enforcer.isAllowed(entity.group, location.x)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.y)).toBe(true);
      expect(enforcer.isAllowed(entity.group, location.z)).toBe(true);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
      expect(enforcer.isAllowed(entity.location, location.z)).toBe(false);
    });

    it('should only allow locations that match a given pattern', () => {
      const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [
              {
                allow: ['Component'],
                locations: [
                  { type: 'url', pattern: 'https://github.com/b/**' },
                ],
              },
            ],
          },
        }),
      );
      expect(enforcer.isAllowed(entity.component, location.w)).toBe(true);
      expect(enforcer.isAllowed(entity.component, location.y)).toBe(false);
      expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);
    });
  });

  it('should allow locations with a hidden folder', () => {
    const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
      new ConfigReader({
        catalog: {
          rules: [
            {
              allow: ['Component'],
              locations: [{ type: 'url', pattern: 'https://github.com/b/**' }],
            },
          ],
        },
      }),
    );
    expect(enforcer.isAllowed(entity.component, location.v)).toBe(true);
  });
});
