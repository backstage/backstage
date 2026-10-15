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
    kind: 'Component',
  } as Entity,
  componentWithType: {
    kind: 'Component',
    spec: {
      type: 'service',
    },
  } as unknown as Entity,
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
      expect(enforcer.isAllowed(entity.componentWithType, location.z)).toBe(
        true,
      );
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

  it('should only allow components with a specific type', () => {
    const enforcer = DefaultCatalogRulesEnforcer.fromConfig(
      new ConfigReader({
        catalog: {
          rules: [
            {
              allow: [{ kind: 'Component', 'spec.type': 'service' }],
              locations: [{ type: 'url', pattern: 'https://github.com/b/**' }],
            },
          ],
        },
      }),
    );

    expect(enforcer.isAllowed(entity.component, location.w)).toBe(false);
    expect(enforcer.isAllowed(entity.component, location.y)).toBe(false);
    expect(enforcer.isAllowed(entity.component, location.z)).toBe(false);

    expect(enforcer.isAllowed(entity.componentWithType, location.w)).toBe(true);
    expect(enforcer.isAllowed(entity.componentWithType, location.y)).toBe(
      false,
    );
    expect(enforcer.isAllowed(entity.componentWithType, location.z)).toBe(
      false,
    );
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

  describe('canonical URL matching', () => {
    const template = { kind: 'Template' } as Entity;
    const enforcer = new DefaultCatalogRulesEnforcer([
      {
        allow: [{ kind: 'Template' }],
        locations: [
          { type: 'url', pattern: 'https://ghe.example.com/trusted/**' },
        ],
      },
    ]);

    it('should deny URL targets that use percent-encoded dot segments to escape the pattern scope', () => {
      const attack = {
        type: 'url',
        target:
          'https://ghe.example.com/trusted/%2e%2e/attacker/repo/blob/main/catalog-info.yaml',
      } as LocationSpec;
      expect(enforcer.isAllowed(template, attack)).toBe(false);
    });

    it('should deny URL targets that use multi-encoded dot segments', () => {
      const multiEncoded = {
        type: 'url',
        target:
          'https://ghe.example.com/trusted/%252e%252e/attacker/repo/blob/main/catalog-info.yaml',
      } as LocationSpec;
      expect(enforcer.isAllowed(template, multiEncoded)).toBe(false);
    });

    it('should deny URL targets that use encoded path separators for traversal', () => {
      const separated = [
        'https://ghe.example.com/trusted/a%2f%2e%2e%2fattacker/repo/blob/main/catalog-info.yaml',
        'https://ghe.example.com/trusted/x%2f..%2fattacker/repo/blob/main/catalog-info.yaml',
      ];
      for (const target of separated) {
        expect(enforcer.isAllowed(template, { type: 'url', target })).toBe(
          false,
        );
      }
    });

    it('should deny URL targets that use encoded separators or userinfo to forge a trusted prefix', () => {
      const spoofed = [
        // userinfo materialized into a fake trusted-looking path prefix
        'https://ghe.example.com%2Ftrusted%2F@ghe.example.com/attacker/repo/blob/main/catalog-info.yaml',
      ];
      for (const target of spoofed) {
        expect(enforcer.isAllowed(template, { type: 'url', target })).toBe(
          false,
        );
      }
    });

    it('should deny multi-encoded traversal even when another path segment has an invalid escape', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/trusted/%252e%252e/blob/attacker/repo/main/x%E9.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should deny multi-encoded traversal joined by an encoded separator in the same segment as an invalid escape', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/trusted/x%E9%2f%252e%252e%2f/attacker/repo/blob/main/x.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should still allow targets with escapes that are not valid UTF-8', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target: 'https://ghe.example.com/trusted/repo/blob/caf%E9/x.yaml',
        } as LocationSpec),
      ).toBe(true);
    });

    it('should deny URL targets that use encoded backslashes for traversal', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/trusted/..%5Cattacker%5Crepo/blob/main/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should match patterns with literal spaces in the query string', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/trusted/org/proj/_git/repo?path=/my%20docs/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(true);
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/attacker/org/proj/_git/repo?trusted=1',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should match targets with a username against the host and path only', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://org@ghe.example.com/trusted/repo/blob/main/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(true);
    });

    it('should still allow targets whose refs contain encoded slashes', () => {
      expect(
        enforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/trusted/repo/blob/feature%2Fx/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(true);
    });

    it('should still match patterns written with literal spaces against encoded targets', () => {
      const spacedEnforcer = new DefaultCatalogRulesEnforcer([
        {
          allow: [{ kind: 'Template' }],
          locations: [
            { type: 'url', pattern: 'https://ghe.example.com/my project/**' },
          ],
        },
      ]);
      expect(
        spacedEnforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/my%20project/repo/blob/main/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(true);
      expect(
        spacedEnforcer.isAllowed(template, {
          type: 'url',
          target:
            'https://ghe.example.com/my%20project/%2e%2e/attacker/repo/blob/main/catalog-info.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should keep file exact matchers in catalog.rules unresolved', () => {
      const fileEnforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [
              {
                allow: ['Template'],
                locations: [{ type: 'file', exact: 'z.yaml' }],
              },
            ],
          },
        }),
      );
      expect(
        fileEnforcer.isAllowed(template, {
          type: 'file',
          target: 'z.yaml',
        } as LocationSpec),
      ).toBe(true);
      expect(
        fileEnforcer.isAllowed(template, {
          type: 'file',
          target: '/root/z.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should deny URL targets that use uppercase percent-encoded dot segments', () => {
      const attack = {
        type: 'url',
        target:
          'https://ghe.example.com/trusted/%2E%2E/attacker/repo/blob/main/catalog-info.yaml',
      } as LocationSpec;
      expect(enforcer.isAllowed(template, attack)).toBe(false);
    });

    it('should deny URL targets that use literal dot segments', () => {
      const attack = {
        type: 'url',
        target:
          'https://ghe.example.com/trusted/../attacker/repo/blob/main/catalog-info.yaml',
      } as LocationSpec;
      expect(enforcer.isAllowed(template, attack)).toBe(false);
    });

    it('should still allow targets within the pattern scope', () => {
      const ok = {
        type: 'url',
        target:
          'https://ghe.example.com/trusted/repo/blob/main/catalog-info.yaml',
      } as LocationSpec;
      expect(enforcer.isAllowed(template, ok)).toBe(true);
    });

    it('should deny unparseable URL targets when the rule has URL location matchers', () => {
      const bad = { type: 'url', target: 'not a url' } as LocationSpec;
      expect(enforcer.isAllowed(template, bad)).toBe(false);
    });

    it('should still allow unparseable URL targets for rules without location matchers', () => {
      const plainEnforcer = new DefaultCatalogRulesEnforcer([
        { allow: [{ kind: 'Template' }] },
      ]);
      const bad = { type: 'url', target: 'not a url' } as LocationSpec;
      expect(plainEnforcer.isAllowed(template, bad)).toBe(true);
    });

    it('should not apply URL canonicalization to other location types', () => {
      const customEnforcer = new DefaultCatalogRulesEnforcer([
        {
          allow: [{ kind: 'Template' }],
          locations: [{ type: 'custom', pattern: 'custom://trusted/**' }],
        },
      ]);
      expect(
        customEnforcer.isAllowed(template, {
          type: 'custom',
          target: 'custom://trusted/%2e%2e/other',
        } as LocationSpec),
      ).toBe(true);
    });

    it('should compare exact URL matches in canonical form on both sides', () => {
      const exactEnforcer = new DefaultCatalogRulesEnforcer([
        {
          allow: [{ kind: 'Template' }],
          locations: [
            { type: 'url', exact: 'https://ghe.example.com/trusted/t.yaml' },
          ],
        },
      ]);
      expect(
        exactEnforcer.isAllowed(template, {
          type: 'url',
          target: 'https://GHE.EXAMPLE.COM/trusted/t.yaml',
        } as LocationSpec),
      ).toBe(true);
      expect(
        exactEnforcer.isAllowed(template, {
          type: 'url',
          target: 'https://ghe.example.com/trusted/%2e%2e/attacker.yaml',
        } as LocationSpec),
      ).toBe(false);
    });

    it('should canonicalize configured exact URL targets from catalog.locations', () => {
      const locationEnforcer = DefaultCatalogRulesEnforcer.fromConfig(
        new ConfigReader({
          catalog: {
            rules: [{ allow: ['Component'] }],
            locations: [
              {
                type: 'url',
                target: 'https://GHE.example.com/trusted/t.yaml',
                rules: [{ allow: ['Template'] }],
              },
            ],
          },
        }),
      );
      expect(
        locationEnforcer.isAllowed(template, {
          type: 'url',
          target: 'https://ghe.example.com/trusted/t.yaml',
        } as LocationSpec),
      ).toBe(true);
    });
  });
});
