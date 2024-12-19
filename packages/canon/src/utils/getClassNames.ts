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

import type { Breakpoint, UtilityProps } from '../types';

const spaceMap = (type: string) => ({
  none: `${type}-none`,
  '2xs': `${type}-2xs`,
  xs: `${type}-xs`,
  sm: `${type}-sm`,
  md: `${type}-md`,
  lg: `${type}-lg`,
  xl: `${type}-xl`,
  '2xl': `${type}-2xl`,
});

const valueMap: Record<string, Record<string, string>> = {
  alignItems: {
    stretch: 'items-stretch',
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  },
  border: {
    none: 'border-none',
    base: 'border-base',
    error: 'border-error',
    warning: 'border-warning',
    selected: 'border-selected',
  },
  borderRadius: {
    none: 'rounded-none',
    '2xs': 'rounded-2xs',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  },
  colEnd: {
    1: 'col-end-1',
    2: 'col-end-2',
    3: 'col-end-3',
    4: 'col-end-4',
    5: 'col-end-5',
    6: 'col-end-6',
    7: 'col-end-7',
    8: 'col-end-8',
    9: 'col-end-9',
    10: 'col-end-10',
    11: 'col-end-11',
    12: 'col-end-12',
    auto: 'col-end-auto',
  },
  colSpan: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    auto: 'col-span-auto',
  },
  colStart: {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
    auto: 'col-start-auto',
  },
  columns: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
    auto: 'grid-cols-auto',
  },
  display: {
    none: 'hidden',
    flex: 'flex',
    block: 'block',
    inline: 'inline',
  },
  flexDirection: {
    row: 'flex-row',
    column: 'flex-col',
  },
  flexWrap: {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  },
  gap: spaceMap('gap'),
  justifyContent: {
    stretch: 'justify-stretch',
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    around: 'justify-around',
    between: 'justify-between',
  },
  margin: spaceMap('m'),
  marginBottom: spaceMap('mb'),
  marginLeft: spaceMap('ml'),
  marginRight: spaceMap('mr'),
  marginTop: spaceMap('mt'),
  marginX: spaceMap('mx'),
  marginY: spaceMap('my'),
  padding: spaceMap('p'),
  paddingBottom: spaceMap('pb'),
  paddingLeft: spaceMap('pl'),
  paddingRight: spaceMap('pr'),
  paddingTop: spaceMap('pt'),
  paddingX: spaceMap('px'),
  paddingY: spaceMap('py'),
  rowSpan: {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
    7: 'row-span-7',
    8: 'row-span-8',
    9: 'row-span-9',
    10: 'row-span-10',
    11: 'row-span-11',
    12: 'row-span-12',
    full: 'row-span-full',
  },
};

const generateClassNames = (propName: string, propValue: any) => {
  const classNames: string[] = [];

  // If the property name is not in the valueMap, return an empty array
  if (!valueMap.hasOwnProperty(propName)) {
    return classNames;
  }

  if (typeof propValue === 'string' || typeof propValue === 'number') {
    // If the property value is a string, map it to the valueMap
    const value = valueMap[propName]?.[propValue] || propValue;
    classNames.push(`cu-${value}`);
  } else if (typeof propValue === 'object') {
    // If the property value is an object, map each key-value pair
    Object.entries(propValue as Record<Breakpoint, string>).forEach(
      ([breakpoint, value]) => {
        const mappedValue = valueMap[propName]?.[value] || value;

        if (breakpoint === 'xs') {
          classNames.push(`cu-${mappedValue}`);
        } else {
          classNames.push(`cu-${breakpoint}-${mappedValue}`);
        }
      },
    );
  }
  return classNames;
};

export const getClassNames = (props: UtilityProps) => {
  const classNames: string[] = [];

  Object.entries(props).forEach(([propName, propValue]) => {
    classNames.push(...generateClassNames(propName, propValue));
  });

  return classNames.filter(Boolean).join(' ');
};
