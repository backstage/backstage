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
import React, { Children, isValidElement, useState } from 'react';

interface TabItemElementProps {
  value: string;
  label?: string;
  children?: React.ReactNode;
}

interface TabsProps {
  children?: React.ReactNode;
}

// A minimal stand-in for @theme/Tabs: keeps every panel mounted (matching the
// real component's default non-lazy behavior) and toggles visibility with the
// `hidden` attribute so state in an inactive panel survives a tab switch.
export default function Tabs({ children }: TabsProps) {
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabItemElementProps> =>
      isValidElement(child),
  );
  const [selectedValue, setSelectedValue] = useState(
    items[0]?.props.value,
  );

  return (
    <div>
      <ul role="tablist">
        {items.map(item => (
          <li key={item.props.value} role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={selectedValue === item.props.value}
              onClick={() => setSelectedValue(item.props.value)}
            >
              {item.props.label}
            </button>
          </li>
        ))}
      </ul>
      {items.map(item => (
        <div
          key={item.props.value}
          role="tabpanel"
          hidden={selectedValue !== item.props.value}
        >
          {item.props.children}
        </div>
      ))}
    </div>
  );
}
