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
import { JsonObject, JsonPrimitive } from '@backstage/types';
import { RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY } from '@backstage/plugin-scaffolder-common/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createConditionAuthorizer } from '@backstage/plugin-permission-node';
import { scaffolderTemplateEntityRules } from './scaffolderTemplateEntityRules';
import {
  TemplateEntityStepV1beta3,
  TemplateEntityV1beta3,
  TemplateParametersV1beta3,
} from '@backstage/plugin-scaffolder-common';

function templateFactory(data: {
  parameters?: TemplateParametersV1beta3 | TemplateParametersV1beta3[];
  steps?: TemplateEntityStepV1beta3[];
}): TemplateEntityV1beta3 {
  return {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'example-template',
    },
    spec: {
      type: 'example',
      parameters: data.parameters || [],
      steps: data.steps || [],
    },
  };
}

describe('hasAction', () => {
  describe('apply', () => {
    it('returns false when actionId is not matched', () => {
      expect(
        scaffolderTemplateEntityRules.hasAction.apply(
          templateFactory({
            steps: [{ action: 'fetch:files' }],
          }),
          {
            actionId: 'not-matched',
          },
        ),
      ).toEqual(false);
    });

    it('returns true when actionId is matched', () => {
      expect(
        scaffolderTemplateEntityRules.hasAction.apply(
          templateFactory({
            steps: [{ action: 'fetch:files' }],
          }),
          {
            actionId: 'fetch:files',
          },
        ),
      ).toEqual(true);
    });
  });
});

const input: JsonObject = {
  propwithstring: '1',
  propwithnumber: 2,
  propwithobject: {},
  propwithnull: null,
  propwithfalse: false,
  propwithtrue: true,
  propwitharray: ['item', 0, true, false],
  nested: { propwithstring: '1', nested: { propwithnumber: 1 } },
};

describe('hasActionWithProperty', () => {
  describe('apply', () => {
    it.each([
      'foo',
      'bar',
      'prop.prop',
      'nested.nonexisting',
      '',
      'propwitharray.100',
    ])(`returns false when a property doesn't exist in the input`, key => {
      expect(
        scaffolderTemplateEntityRules.hasActionWithProperty.apply(
          templateFactory({
            steps: [{ action: 'action', input }],
          }),
          { actionId: 'action', key },
        ),
      ).toEqual(false);
    });

    it.each([
      'propwithstring',
      'propwithnumber',
      'propwithobject',
      'propwithnull',
      'propwithfalse',
      'propwithtrue',
      'propwitharray',
      'propwitharray.1',
      'nested.propwithstring',
      'nested.nested',
      'nested.nested.propwithnumber',
    ])(`returns true when a property exists, property=%s`, key => {
      expect(
        scaffolderTemplateEntityRules.hasActionWithProperty.apply(
          templateFactory({
            steps: [{ action: 'action', input }],
          }),
          { actionId: 'action', key },
        ),
      ).toEqual(true);
    });

    it.each([
      ['propwithstring', 1],
      ['propwithnumber', '2'],
      ['propwithnumber', true],
      ['propwithobject', [{}]],
      ['propwithnull', false],
      ['propwithfalse', true],
      ['propwithtrue', null],
      ['propwitharray', 'nonexistingitem'],
      ['propwitharray.0', 'nonmatchingitem'],
      ['nested.propwithstring', 'x'],
      ['nested.nested', '1'],
      ['nested.nested.propwithnumber', 'ops'],
    ])(
      `returns false when a property exists but the value doesn't match, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value: value as JsonPrimitive },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      ['propwithstring', '1'],
      ['propwithnumber', 2],
      ['propwithnull', null],
      ['propwithfalse', false],
      ['propwithtrue', true],
      ['propwitharray.0', 'item'],
      ['nested.propwithstring', '1'],
      ['nested.nested.propwithnumber', 1],
    ])(
      `returns true when a property exists and the value matches, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value: value as JsonPrimitive },
          ),
        ).toEqual(true);
      },
    );

    it('throws if params are invalid', () => {
      const isActionAuthorized = createConditionAuthorizer([
        scaffolderTemplateEntityRules.hasActionWithProperty,
      ]);

      expect(() =>
        isActionAuthorized(
          {
            resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
            pluginId: 'scaffolder',
            result: AuthorizeResult.CONDITIONAL,
            conditions: {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
              rule: 'HAS_ACTION_WITH_PROPERTY',
              params: {
                actionId: 'action',
                key: 1,
              },
            },
          },
          templateFactory({
            steps: [{ action: 'action', input: {} }],
          }),
        ),
      ).toThrow();

      expect(() =>
        isActionAuthorized(
          {
            resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
            pluginId: 'scaffolder',
            result: AuthorizeResult.CONDITIONAL,
            conditions: {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
              rule: 'HAS_ACTION_WITH_PROPERTY',
              params: {},
            },
          },
          templateFactory({
            steps: [{ action: 'action', input: {} }],
          }),
        ),
      ).toThrow();
    });

    it('does not throw if params are valid', () => {
      const isActionAuthorized = createConditionAuthorizer([
        scaffolderTemplateEntityRules.hasActionWithProperty,
      ]);

      expect(() =>
        isActionAuthorized(
          {
            resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
            pluginId: 'scaffolder',
            result: AuthorizeResult.CONDITIONAL,
            conditions: {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
              rule: 'HAS_ACTION_WITH_PROPERTY',
              params: {
                actionId: 'action',
                key: 'key',
              },
            },
          },
          templateFactory({
            steps: [{ action: 'action', input: {} }],
          }),
        ),
      ).not.toThrow();

      expect(() =>
        isActionAuthorized(
          {
            resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
            pluginId: 'scaffolder',
            result: AuthorizeResult.CONDITIONAL,
            conditions: {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
              rule: 'HAS_ACTION_WITH_PROPERTY',
              params: {
                actionId: 'action',
                key: 'key',
                value: 'value',
              },
            },
          },
          templateFactory({
            steps: [{ action: 'action', input: {} }],
          }),
        ),
      ).not.toThrow();
    });
  });
});

describe('hasActionWithBooleanProperty', () => {
  describe('apply', () => {
    it.each(['foo', 'bar', 'prop.prop', 'nested.nonexisting', ''])(
      `returns false when a property doesn't exist in the input`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithBooleanProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      'propwithstring',
      'propwithnumber',
      'propwithobject',
      'propwithnull',
      'propwitharray',
      'propwitharray.0',
      'nested.propwithstring',
      'nested.nested',
      'nested.nested.propwithnumber',
    ])(
      `returns false when a property exists and is not a boolean, property=%s`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithBooleanProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      'propwithfalse',
      'propwithtrue',
      'propwitharray.2',
      'propwitharray.3',
    ])(`returns true when a property exists, property=%s`, key => {
      expect(
        scaffolderTemplateEntityRules.hasActionWithBooleanProperty.apply(
          templateFactory({
            steps: [{ action: 'action', input }],
          }),
          { actionId: 'action', key },
        ),
      ).toEqual(true);
    });

    it.each([
      ['propwithstring', true],
      ['propwithnumber', true],
      ['propwithnumber', true],
      ['propwithobject', true],
      ['propwithnull', true],
      ['propwithfalse', true],
      ['propwithtrue', false],
      ['propwitharray', true],
      ['propwitharray.2', false],
      ['propwitharray.3', true],
      ['nested.propwithstring', true],
      ['nested.nested', true],
      ['nested.nested.propwithnumber', true],
    ])(
      `returns false when a property exists but the value doesn't match, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithBooleanProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      ['propwithfalse', false],
      ['propwithtrue', true],
      ['propwitharray.2', true],
      ['propwitharray.3', false],
    ])(
      `returns true when a property exists and the value matches, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithBooleanProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(true);
      },
    );
  });
});

describe('hasActionWithNumberProperty', () => {
  describe('apply', () => {
    it.each(['foo', 'bar', 'prop.prop', 'nested.nonexisting', ''])(
      `returns false when a property doesn't exist in the input`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithNumberProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      'propwithstring',
      'propwithobject',
      'propwithnull',
      'propwithfalse',
      'propwithtrue',
      'propwitharray',
      'propwitharray.0',
      'nested.propwithstring',
      'nested.nested',
    ])(
      `returns false when a property exists and is not a number, property=%s`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithNumberProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      'propwithnumber',
      'nested.nested.propwithnumber',
      'propwitharray.1',
    ])(`returns true when a property exists, property=%s`, key => {
      expect(
        scaffolderTemplateEntityRules.hasActionWithNumberProperty.apply(
          templateFactory({
            steps: [{ action: 'action', input }],
          }),
          { actionId: 'action', key },
        ),
      ).toEqual(true);
    });

    it.each([
      ['propwithstring', 1],
      ['propwithnumber', 1000],
      ['propwithnumber', 101],
      ['propwithobject', 1],
      ['propwithnull', 1],
      ['propwithfalse', 1],
      ['propwithtrue', 1],
      ['propwitharray', 1],
      ['propwitharray.2', 1],
      ['propwitharray.3', 1],
      ['nested.propwithstring', 1],
      ['nested.nested', 1],
      ['nested.nested.propwithnumber', 100],
    ])(
      `returns false when a property exists but the value doesn't match, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithNumberProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      ['propwithnumber', 2],
      ['nested.nested.propwithnumber', 1],
      ['propwitharray.1', 0],
    ])(
      `returns true when a property exists and the value matches, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithNumberProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(true);
      },
    );
  });
});

describe('hasActionWithStringProperty', () => {
  describe('apply', () => {
    it.each(['foo', 'bar', 'prop.prop', 'nested.nonexisting', ''])(
      `returns false when a property doesn't exist in the input`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithStringProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      'propwithnumber',
      'propwithobject',
      'propwithnull',
      'propwithfalse',
      'propwithtrue',
      'propwitharray',
      'propwitharray.1',
      'nested.nested.propwithnumber',
      'nested.nested',
    ])(
      `returns false when a property exists and is not a string, property=%s`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithStringProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(false);
      },
    );

    it.each(['propwithstring', 'nested.propwithstring', 'propwitharray.0'])(
      `returns true when a property exists, property=%s`,
      key => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithStringProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key },
          ),
        ).toEqual(true);
      },
    );

    it.each([
      ['propwithstring', 'nonmatchingstring'],
      ['propwithnumber', 's'],
      ['propwithnumber', 's'],
      ['propwithobject', 's'],
      ['propwithnull', 's'],
      ['propwithfalse', 's'],
      ['propwithtrue', 's'],
      ['propwitharray', 's'],
      ['propwitharray.2', 's'],
      ['propwitharray.3', 's'],
      ['nested.nested', 's'],
      ['nested.nested.propwithnumber', 's'],
    ])(
      `returns false when a property exists but the value doesn't match, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithStringProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(false);
      },
    );

    it.each([
      ['propwithstring', '1'],
      ['nested.propwithstring', '1'],
      ['propwitharray.0', 'item'],
    ])(
      `returns true when a property exists and the value matches, key=%s value=%o`,
      (key, value) => {
        expect(
          scaffolderTemplateEntityRules.hasActionWithStringProperty.apply(
            templateFactory({
              steps: [{ action: 'action', input }],
            }),
            { actionId: 'action', key, value },
          ),
        ).toEqual(true);
      },
    );
  });
});
