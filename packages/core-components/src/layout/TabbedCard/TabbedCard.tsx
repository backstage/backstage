/*
 * Copyright 2020 The Backstage Authors
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

import { Card, CardContent } from '../../components/ui/card';
import { ShadcnTabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../lib/utils';
import {
  ChangeEvent,
  Children,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { BottomLink, BottomLinkProps } from '../BottomLink';
import { ErrorBoundary, ErrorBoundaryProps } from '../ErrorBoundary';

export type TabbedCardClassKey = 'root' | 'indicator';

/** @public */
export type BoldHeaderClassKey = 'root' | 'title' | 'subheader';

/**
 * Internal bold header component replacing MUI CardHeader with withStyles.
 * Renders a card title with bold font weight and consistent padding
 * matching the original MUI spacing: padding(2, 2, 2, 2.5) = 16px 16px 16px 20px.
 */
function BoldHeader({ title }: { title: string }) {
  return (
    <div className={cn('inline-block py-4 px-4 pl-5')}>
      <h3 className="font-bold text-base leading-normal">{title}</h3>
    </div>
  );
}

/**
 * Props for the CardTab component — standalone type replacing MUI TabProps
 * dependency. Includes the essential props consumed by TabbedCard to
 * construct Radix TabsTrigger elements.
 */
type CardTabProps = {
  children: ReactNode;
  label?: ReactNode;
  value?: string | number;
  disabled?: boolean;
  className?: string;
};

type Props = {
  /** @deprecated Use errorBoundaryProps instead */
  slackChannel?: string;
  errorBoundaryProps?: ErrorBoundaryProps;
  children?: ReactElement<CardTabProps>[];
  onChange?: (event: ChangeEvent<{}>, value: number | string) => void;
  title?: string;
  value?: number | string;
  deepLink?: BottomLinkProps;
};

export function TabbedCard(props: PropsWithChildren<Props>) {
  const {
    slackChannel,
    errorBoundaryProps,
    children,
    title,
    deepLink,
    value,
    onChange,
  } = props;
  const [selectedIndex, selectIndex] = useState('0');

  // Determine current tab value (string-based for Radix Tabs)
  const currentValue = value !== undefined ? String(value) : selectedIndex;

  // Bridge between Radix onValueChange and existing onChange API.
  // MUI Tabs used onChange(event, value) while Radix Tabs uses onValueChange(value).
  // We create a synthetic event and attempt to preserve numeric value types.
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        const syntheticEvent = {} as ChangeEvent<{}>;
        // Preserve numeric type when original values were numeric
        const numericValue = Number(newValue);
        const resolvedValue =
          !isNaN(numericValue) && String(numericValue) === newValue
            ? numericValue
            : newValue;
        onChange(syntheticEvent, resolvedValue);
      } else {
        selectIndex(newValue);
      }
    },
    [onChange],
  );

  // Deduplication: Radix TabsTrigger fires onMouseDown and onFocus internally,
  // both of which invoke context.onValueChange. Combined with our onClick
  // handler (needed for fireEvent.click compatibility in tests), a single
  // user-click can trigger handleValueChange 2-3 times. We use a ref guard
  // that suppresses duplicate calls for the same value within the same
  // browser task (cleared via setTimeout(0) after the current event cycle).
  const dedupeValueRef = useRef<string | null>(null);
  const dedupeClearRef = useRef<ReturnType<typeof setTimeout>>();

  const handleValueChangeOnce = useCallback(
    (newValue: string) => {
      if (dedupeValueRef.current === newValue) return;
      dedupeValueRef.current = newValue;
      clearTimeout(dedupeClearRef.current);
      dedupeClearRef.current = setTimeout(() => {
        dedupeValueRef.current = null;
      }, 0);
      handleValueChange(newValue);
    },
    [handleValueChange],
  );

  // Extract selected tab content (preserving existing manual selection behavior —
  // only the selected tab's children are rendered, not hidden/shown via CSS)
  let selectedTabContent: ReactNode;
  if (value === undefined) {
    // Uncontrolled: match by index (converted to string)
    Children.map(children, (child, index) => {
      if (isValidElement(child) && String(index) === selectedIndex) {
        selectedTabContent = child?.props.children;
      }
    });
  } else {
    // Controlled: match by value prop
    Children.map(children, child => {
      if (
        isValidElement<{ children?: ReactNode; value?: unknown }>(child) &&
        String(child?.props.value) === String(value)
      ) {
        selectedTabContent = child?.props.children;
      }
    });
  }

  const errProps: ErrorBoundaryProps =
    errorBoundaryProps || (slackChannel ? { slackChannel } : {});

  return (
    <Card>
      <ErrorBoundary {...errProps}>
        {title && <BoldHeader title={title} />}
        <ShadcnTabs value={currentValue} onValueChange={handleValueChangeOnce}>
          <TabsList
            className={cn(
              'h-auto min-h-[24px] w-full justify-start',
              'rounded-none bg-transparent',
              'px-4 pl-5 py-0',
            )}
          >
            {Children.map(children, (child, index) => {
              if (isValidElement<CardTabProps>(child)) {
                const tabValue =
                  child.props.value !== undefined
                    ? String(child.props.value)
                    : String(index);
                return (
                  <TabsTrigger
                    key={tabValue}
                    value={tabValue}
                    disabled={child.props.disabled}
                    onClick={() => handleValueChangeOnce(tabValue)}
                    className={cn(
                      'min-w-[48px] min-h-[24px] mr-4 py-1 px-0',
                      'text-sm normal-case',
                      'rounded-none border-b-2 border-transparent',
                      'hover:opacity-100 hover:bg-transparent hover:text-foreground',
                      'data-[state=active]:font-bold data-[state=active]:border-b-2',
                      'data-[state=active]:border-[color:var(--info,var(--primary))]',
                      'data-[state=active]:shadow-none',
                      child.props.className,
                    )}
                  >
                    {child.props.label}
                  </TabsTrigger>
                );
              }
              return null;
            })}
          </TabsList>
        </ShadcnTabs>
        <Separator />
        <CardContent>{selectedTabContent}</CardContent>
        {deepLink && <BottomLink {...deepLink} />}
      </ErrorBoundary>
    </Card>
  );
}

/** @public */
export type CardTabClassKey = 'root' | 'selected';

/**
 * Card tab component used in {@link TabbedCard}
 *
 * CardTab is a declarative configuration component — its props (label,
 * value, children, disabled) are read by TabbedCard to construct Radix
 * TabsTrigger elements. CardTab itself does not render any DOM output.
 * This follows the compound component pattern (similar to `<Option>` in
 * custom Select components).
 *
 * @public
 *
 */
export function CardTab(_props: PropsWithChildren<CardTabProps>) {
  return null;
}
