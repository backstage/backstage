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
  filterHiddenStepValues,
  renderDefaultValue,
  resolveParameterSteps,
} from '@backstage/plugin-scaffolder-common/alpha';
import { JsonObject, JsonValue } from '@backstage/types';
import { cloneDeep, isEqual } from 'lodash';
import { type ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function serializeFieldPath(path: readonly string[]): string {
  return JSON.stringify(path);
}

export function getValueAtPath(
  source: Record<string, JsonValue> | undefined,
  path: readonly string[],
): JsonValue | undefined {
  let current: unknown = source;
  for (const segment of path) {
    if (!isJsonObject(current) || !Object.hasOwn(current, segment)) {
      return undefined;
    }
    current = current[segment];
  }
  return current as JsonValue | undefined;
}

export function setValueAtPath(
  target: Record<string, JsonValue>,
  path: readonly string[],
  value: JsonValue,
): void {
  if (path.length === 0) {
    return;
  }
  let current: JsonObject = target;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    const existing = current[segment];
    if (!isJsonObject(existing)) {
      current[segment] = {};
    }
    current = current[segment] as JsonObject;
  }
  current[path[path.length - 1]] = value;
}

export function deleteValueAtPath(
  target: Record<string, JsonValue>,
  path: readonly string[],
): void {
  if (path.length === 0) {
    return;
  }
  const parents: Array<{ obj: JsonObject; key: string }> = [];
  let current: unknown = target;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    if (!isJsonObject(current) || !Object.hasOwn(current, segment)) {
      return;
    }
    parents.push({ obj: current, key: segment });
    current = current[segment];
  }
  if (!isJsonObject(current)) {
    return;
  }
  const leaf = path[path.length - 1];
  if (!Object.hasOwn(current, leaf)) {
    return;
  }
  delete current[leaf];

  for (let i = parents.length - 1; i >= 0; i--) {
    const { obj, key } = parents[i];
    const child = obj[key];
    if (isJsonObject(child) && Object.keys(child).length === 0) {
      delete obj[key];
    } else {
      break;
    }
  }
}

function findSchemaNodeAtPath(
  schema: JsonObject | undefined,
  path: readonly string[],
): JsonObject | undefined {
  if (!schema || path.length === 0) {
    return schema;
  }
  const [head, ...rest] = path;
  if (
    isJsonObject(schema.properties) &&
    isJsonObject(schema.properties[head])
  ) {
    return findSchemaNodeAtPath(schema.properties[head] as JsonObject, rest);
  }
  for (const keyword of ['allOf', 'oneOf', 'anyOf']) {
    const branches = schema[keyword];
    if (Array.isArray(branches)) {
      for (const branch of branches) {
        if (isJsonObject(branch)) {
          const found = findSchemaNodeAtPath(branch, path);
          if (found) {
            return found;
          }
        }
      }
    }
  }
  for (const branch of [
    schema.then,
    schema.else,
    ...Object.values(
      isJsonObject(schema.dependencies) ? schema.dependencies : {},
    ),
  ]) {
    if (isJsonObject(branch)) {
      const found = findSchemaNodeAtPath(branch, path);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export function getSchemaDefaultAtPath(
  schema: JsonObject | undefined,
  path: readonly string[],
): JsonValue | undefined {
  const node = findSchemaNodeAtPath(schema, path);
  if (!node || !Object.hasOwn(node, 'default')) {
    return undefined;
  }
  return node.default;
}

export function collectInitialEditedFields(
  steps: readonly ParsedTemplateSchema[],
  initialState: Record<string, JsonValue>,
): Set<string> {
  const edited = new Set<string>();
  for (const step of steps) {
    for (const { path } of step.defaultExpressions ?? []) {
      if (getValueAtPath(initialState, path) !== undefined) {
        edited.add(serializeFieldPath(path));
      }
    }
  }
  return edited;
}

export function collectChangedDefaultFields(
  steps: readonly ParsedTemplateSchema[],
  prevState: Record<string, JsonValue>,
  nextState: Record<string, JsonValue>,
  activeStepSchema: JsonObject | undefined,
  editedFields: ReadonlySet<string>,
): Set<string> {
  let updated: Set<string> | undefined;
  for (const step of steps) {
    for (const { path } of step.defaultExpressions ?? []) {
      const key = serializeFieldPath(path);
      if (editedFields.has(key) || updated?.has(key)) {
        continue;
      }
      const prevValue = getValueAtPath(prevState, path);
      const nextValue = getValueAtPath(nextState, path);
      if (isEqual(prevValue, nextValue)) {
        continue;
      }
      if (prevValue === undefined) {
        const staticDefault = getSchemaDefaultAtPath(activeStepSchema, path);
        if (staticDefault !== undefined && isEqual(nextValue, staticDefault)) {
          continue;
        }
      }
      if (!updated) {
        updated = new Set(editedFields);
      }
      updated.add(key);
    }
  }
  return updated ?? new Set(editedFields);
}

export function resolveStepsWithDefaults(
  steps: readonly ParsedTemplateSchema[],
  stepsState: Record<string, JsonValue>,
  editedFields: ReadonlySet<string>,
): {
  visible: boolean[];
  visibleSteps: ParsedTemplateSchema[];
  formState: Record<string, JsonValue>;
  filteredFormState: Record<string, JsonValue>;
} {
  const hasDerivedDefaults = steps.some(
    step => step.defaultExpressions && step.defaultExpressions.length > 0,
  );
  if (!hasDerivedDefaults) {
    const resolved = resolveParameterSteps(
      stepsState,
      steps.map(step => ({ schema: step.mergedSchema, when: step.when })),
    );
    return {
      visible: resolved.visible,
      visibleSteps: steps.filter((_, index) => resolved.visible[index]),
      formState: stepsState,
      filteredFormState: resolved.values,
    };
  }

  const workingState: Record<string, JsonValue> = cloneDeep(stepsState);
  const resolvedSteps: Array<{ schema: JsonObject; visible: boolean }> = [];
  let anyHidden = false;

  for (const step of steps) {
    let visible = true;
    if (typeof step.when === 'string' || typeof step.when === 'boolean') {
      const conditionContext: Record<string, JsonValue> = anyHidden
        ? filterHiddenStepValues(workingState, resolvedSteps)
        : workingState;
      visible = resolveParameterSteps(conditionContext, [
        { schema: step.mergedSchema, when: step.when },
      ]).visible[0];
    }

    if (
      visible &&
      step.defaultExpressions &&
      step.defaultExpressions.length > 0
    ) {
      for (const { path } of step.defaultExpressions) {
        if (!editedFields.has(serializeFieldPath(path))) {
          deleteValueAtPath(workingState, path);
        }
      }

      const evalContext: Record<string, JsonValue> = anyHidden
        ? filterHiddenStepValues(workingState, resolvedSteps)
        : workingState;

      for (const { path, expression } of step.defaultExpressions) {
        if (editedFields.has(serializeFieldPath(path))) {
          continue;
        }
        const rendered = renderDefaultValue(expression, evalContext);
        if (rendered !== undefined) {
          setValueAtPath(workingState, path, rendered);
          if (evalContext !== workingState) {
            setValueAtPath(evalContext, path, rendered);
          }
        }
      }
    }

    resolvedSteps.push({ schema: step.mergedSchema, visible });
    anyHidden = anyHidden || !visible;
  }

  const filteredFormState = anyHidden
    ? filterHiddenStepValues(workingState, resolvedSteps)
    : workingState;

  return {
    visible: resolvedSteps.map(step => step.visible),
    visibleSteps: steps.filter((_, index) => resolvedSteps[index].visible),
    formState: workingState,
    filteredFormState,
  };
}
