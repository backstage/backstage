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
import { renderHook } from '@testing-library/react';
import { useDefinition } from './useDefinition';
import type { ComponentConfig } from './types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const basicDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    variant: { dataAttribute: true } as const,
    size: { dataAttribute: true, default: 'medium' } as const,
    className: {},
  },
} as ComponentConfig<any, any>;

const multiSlotDef = {
  styles: { root: 'css-root', content: 'css-content' },
  classNames: { root: 'root', content: 'content' },
  propDefs: {
    variant: { dataAttribute: true } as const,
    className: {},
  },
  utilityProps: ['m'] as const,
} as ComponentConfig<any, any>;

const utilityDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    variant: {},
    className: {},
  },
  utilityProps: ['m', 'p', 'width'] as const,
} as ComponentConfig<any, any>;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useDefinition', () => {
  describe('prop resolution', () => {
    it('returns resolved own props from propDefs', () => {
      const { result } = renderHook(() =>
        useDefinition(basicDef, { variant: 'primary' }),
      );

      expect(result.current.ownProps.variant).toBe('primary');
    });

    it('applies default values for missing own props', () => {
      const { result } = renderHook(() =>
        useDefinition(basicDef, { variant: 'primary' }),
      );

      expect(result.current.ownProps.size).toBe('medium');
    });

    it('returns rest props for props not in propDefs or utilityProps', () => {
      const { result } = renderHook(() =>
        useDefinition(basicDef, {
          variant: 'primary',
          'aria-label': 'test',
        }),
      );

      expect(result.current.restProps).toEqual({ 'aria-label': 'test' });
    });

    it('excludes utility props from both ownProps and restProps', () => {
      const { result } = renderHook(() =>
        useDefinition(utilityDef, {
          variant: 'primary',
          m: '2',
          'aria-label': 'test',
        }),
      );

      expect(result.current.ownProps).not.toHaveProperty('m');
      expect(result.current.restProps).not.toHaveProperty('m');
      expect(result.current.restProps).toEqual({ 'aria-label': 'test' });
    });
  });

  describe('classes', () => {
    it('builds a classes object with keys matching definition.classNames', () => {
      const { result } = renderHook(() =>
        useDefinition(multiSlotDef, { variant: 'primary' }),
      );

      expect(result.current.ownProps.classes).toHaveProperty('root');
      expect(result.current.ownProps.classes).toHaveProperty('content');
    });

    it('includes the base CSS class from definition.styles', () => {
      const { result } = renderHook(() =>
        useDefinition(basicDef, { variant: 'primary' }),
      );

      expect(result.current.ownProps.classes.root).toContain('css-root');
    });

    it('appends user className to the root slot by default', () => {
      const { result } = renderHook(() =>
        useDefinition(basicDef, {
          variant: 'primary',
          className: 'custom',
        }),
      );

      expect(result.current.ownProps.classes.root).toContain('custom');
    });

    it('appends utility classes to the root slot by default', () => {
      const { result } = renderHook(() =>
        useDefinition(utilityDef, { variant: 'primary', m: '2' }),
      );

      expect(result.current.ownProps.classes.root).toContain('bui-m-2');
    });

    it('appends user className to a custom classNameTarget slot', () => {
      const { result } = renderHook(() =>
        useDefinition(
          multiSlotDef,
          { variant: 'primary', className: 'custom' },
          {
            classNameTarget: 'content',
          },
        ),
      );

      expect(result.current.ownProps.classes.content).toContain('custom');
      expect(result.current.ownProps.classes.root).not.toContain('custom');
    });

    it('appends utility classes to a custom utilityTarget slot', () => {
      const { result } = renderHook(() =>
        useDefinition(
          multiSlotDef,
          { variant: 'primary', m: '2' },
          {
            utilityTarget: 'content',
          },
        ),
      );

      expect(result.current.ownProps.classes.content).toContain('bui-m-2');
      expect(result.current.ownProps.classes.root).not.toContain('bui-m-2');
    });

    it('does not append user className when classNameTarget is null', () => {
      const { result } = renderHook(() =>
        useDefinition(
          basicDef,
          { variant: 'primary', className: 'custom' },
          {
            classNameTarget: null,
          },
        ),
      );

      expect(result.current.ownProps.classes.root).not.toContain('custom');
    });

    it('does not append utility classes when utilityTarget is null', () => {
      const { result } = renderHook(() =>
        useDefinition(
          utilityDef,
          { variant: 'primary', m: '2' },
          {
            utilityTarget: null,
          },
        ),
      );

      expect(result.current.ownProps.classes.root).not.toContain('bui-m-2');
    });

    it('keeps non-targeted slots free of utility classes and user className', () => {
      const { result } = renderHook(() =>
        useDefinition(multiSlotDef, {
          variant: 'primary',
          m: '2',
          className: 'custom',
        }),
      );

      // Defaults target root — content should be clean
      expect(result.current.ownProps.classes.content).not.toContain('bui-m-2');
      expect(result.current.ownProps.classes.content).not.toContain('custom');
    });
  });
});
