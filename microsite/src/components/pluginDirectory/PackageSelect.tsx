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
import React from 'react';

import styles from './pluginDirectory.module.scss';

export interface PackageSelectOption {
  value: string;
  label: string;
  group?: string;
}

interface PackageSelectProps {
  value: string;
  options: readonly PackageSelectOption[];
  onChange: (value: string) => void;
}

function renderOption(option: PackageSelectOption) {
  return (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  );
}

// Consecutive options sharing the same `group` collapse into one <optgroup>,
// so callers can group by role without needing to pre-partition the list
// themselves; ungrouped options render as direct children of the <select>.
function renderOptions(options: readonly PackageSelectOption[]) {
  const nodes: React.ReactNode[] = [];
  let index = 0;
  while (index < options.length) {
    const group = options[index].group;
    if (!group) {
      nodes.push(renderOption(options[index]));
      index += 1;
      continue;
    }
    const groupOptions: PackageSelectOption[] = [];
    while (index < options.length && options[index].group === group) {
      groupOptions.push(options[index]);
      index += 1;
    }
    nodes.push(
      <optgroup key={group} label={group}>
        {groupOptions.map(renderOption)}
      </optgroup>,
    );
  }
  return nodes;
}

export function PackageSelect({ value, options, onChange }: PackageSelectProps) {
  return (
    <label className={styles.packageSelectLabel}>
      Package
      <select
        className={styles.packageSelect}
        value={value}
        onChange={event => onChange(event.target.value)}
      >
        {renderOptions(options)}
      </select>
    </label>
  );
}
