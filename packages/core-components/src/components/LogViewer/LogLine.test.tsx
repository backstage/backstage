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

import { ChunkModifiers } from './AnsiProcessor';
import { getModifierClasses } from './LogLine';

describe('getModifierClasses', () => {
  const classes = {
    modifierBold: 'bold',
    modifierItalic: 'italic',
    modifierUnderline: 'underline',
    modifierForegroundBlack: 'black',
    modifierForegroundRed: 'red',
    modifierForegroundGreen: 'green',
    modifierForegroundYellow: 'yellow',
    modifierForegroundBlue: 'blue',
    modifierForegroundMagenta: 'magenta',
    modifierForegroundCyan: 'cyan',
    modifierForegroundWhite: 'white',
    modifierForegroundGrey: 'grey',
    modifierBackgroundBlack: 'bg-black',
    modifierBackgroundRed: 'bg-red',
    modifierBackgroundGreen: 'bg-green',
    modifierBackgroundYellow: 'bg-yellow',
    modifierBackgroundBlue: 'bg-blue',
    modifierBackgroundMagenta: 'bg-magenta',
    modifierBackgroundCyan: 'bg-cyan',
    modifierBackgroundWhite: 'bg-white',
    modifierBackgroundGrey: 'bg-grey',
  };
  const curried = (modifiers: ChunkModifiers) =>
    getModifierClasses(
      classes as Parameters<typeof getModifierClasses>[0],
      modifiers,
    );

  it('should transform modifiers to classes', () => {
    expect(curried({})).toEqual(undefined);
    expect(curried({ bold: true })).toEqual('bold');
    expect(curried({ italic: true })).toEqual('italic');
    expect(curried({ underline: true })).toEqual('underline');
    expect(curried({ foreground: 'black' })).toEqual('black');
    expect(curried({ background: 'black' })).toEqual('bg-black');
    expect(
      curried({
        bold: true,
        italic: true,
        underline: true,
        foreground: 'red',
        background: 'red',
      }),
    ).toEqual('bold italic underline red bg-red');
  });
});
