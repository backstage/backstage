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

import { forwardRef, useState } from 'react';
import type { ElementType } from 'react';
import type { TextProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TextDefinition } from './definition';

function TextComponent<T extends ElementType = 'span'>(
  props: TextProps<T>,
  ref: React.Ref<any>,
) {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    TextDefinition,
    props,
  );
  const { classes, as, disabled, copyable, children } = ownProps;
  const Component = as;
  const [copied, setCopied] = useState(false);

  // Only pass 'disabled' prop to elements that support it
  const disabledProps: Record<string, any> = {};
  if (
    disabled &&
    [
      'button',
      'input',
      'textarea',
      'select',
      'fieldset',
      'optgroup',
      'option',
    ].includes(Component)
  ) {
    disabledProps.disabled = true;
  }

  const handleCopy = () => {
    if (typeof children === 'string') {
      window.navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <Component
        ref={ref}
        className={
          disabled ? `${classes.root} bui-Text--disabled` : classes.root
        }
        {...dataAttributes}
        {...restProps}
        {...disabledProps}
      >
        {children}
      </Component>
      {copyable && typeof children === 'string' && (
        <button
          type="button"
          aria-label="Copy text"
          onClick={handleCopy}
          style={{ marginLeft: 4, cursor: 'pointer' }}
        >
          📋
        </button>
      )}
      {copied && (
        <span style={{ marginLeft: 4, color: 'green', fontSize: '0.9em' }}>
          Copied!
        </span>
      )}
    </>
  );
}

TextComponent.displayName = 'Text';

/** @public */
export const Text = forwardRef(TextComponent) as {
  <T extends ElementType = 'p'>(
    props: TextProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] },
  ): React.ReactElement<TextProps<T>, T>;
  displayName: string;
};

Text.displayName = 'Text';
