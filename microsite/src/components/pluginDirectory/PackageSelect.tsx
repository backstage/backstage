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
}

interface PackageSelectProps {
  value: string;
  options: readonly PackageSelectOption[];
  onChange: (value: string) => void;
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
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
