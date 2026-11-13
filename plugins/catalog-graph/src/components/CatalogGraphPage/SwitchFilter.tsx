/*
 * Copyright 2021 The Backstage Authors
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
import { Switch } from '@backstage/ui';

export type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/**
 * @public
 * @deprecated The filter is styled with CSS modules and no longer reads theme
 * overrides, so this type has no effect and will be removed.
 */
export type SwitchFilterClassKey = 'root';

export const SwitchFilter = ({ label, value, onChange }: Props) => (
  <Switch label={label} isSelected={value} onChange={onChange} />
);
