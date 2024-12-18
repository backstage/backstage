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
import type { Breakpoints, UtilityProps } from '../types';

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
  display: {
    none: 'hidden',
    flex: 'block',
    block: 'block',
    inline: 'inline',
  },
  flexDirection: {
    row: 'row',
    column: 'column',
  },
  flexWrap: {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
  },
  justifyContent: {
    stretch: 'justify-stretch',
    'flex-start': 'justify-start',
    center: 'justify-center',
    'flex-end': 'justify-end',
    'space-around': 'justify-around',
    'space-between': 'justify-between',
  },
  alignItems: {
    stretch: 'items-stretch',
    'flex-start': 'items-start',
    center: 'items-center',
    'flex-end': 'items-end',
  },
  borderRadius: {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    full: 'rounded-full',
  },
  padding: spaceMap('p'),
  paddingX: spaceMap('px'),
  paddingY: spaceMap('py'),
  paddingLeft: spaceMap('pl'),
  paddingRight: spaceMap('pr'),
  paddingTop: spaceMap('pt'),
  paddingBottom: spaceMap('pb'),
  margin: spaceMap('m'),
  marginX: spaceMap('mx'),
  marginY: spaceMap('my'),
  marginLeft: spaceMap('ml'),
  marginRight: spaceMap('mr'),
  marginTop: spaceMap('mt'),
  marginBottom: spaceMap('mb'),
  gap: spaceMap('gap'),
};

const generateClassNames = (propName: string, propValue: any) => {
  const classNames: string[] = [];

  // If the property name is not in the valueMap, return an empty array
  if (!valueMap.hasOwnProperty(propName)) {
    return classNames;
  }

  if (typeof propValue === 'string') {
    // If the property value is a string, map it to the valueMap
    const value = valueMap[propName]?.[propValue] || propValue;
    classNames.push(`cu-${value}`);
  } else if (typeof propValue === 'object') {
    // If the property value is an object, map each key-value pair
    Object.entries(propValue as Record<keyof Breakpoints, string>).forEach(
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
