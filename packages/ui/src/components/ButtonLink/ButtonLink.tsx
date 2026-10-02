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

import { forwardRef, Ref } from 'react';
import { Link as RALink } from 'react-aria-components';
import type { ButtonLinkProps } from './types';
import {
  useDefinition,
  type UseDefinitionResult,
} from '../../hooks/useDefinition';
import { ButtonLinkDefinition } from './definition';
import { getNodeText } from '../../analytics/getNodeText';
import {
  getReactAriaAnchorProps,
  type AnchorNavigation,
} from '../../navigation/useNavigation';

type ButtonLinkViewProps = {
  definitionResult: UseDefinitionResult<
    typeof ButtonLinkDefinition,
    ButtonLinkProps
  >;
  navigation: AnchorNavigation;
  forwardedRef: Ref<HTMLAnchorElement>;
};

function ButtonLinkView({
  definitionResult,
  navigation,
  forwardedRef,
}: ButtonLinkViewProps) {
  const { ownProps, restProps, dataAttributes, analytics } = definitionResult;
  const { classes, iconStart, iconEnd, children } = ownProps;
  const navigationProps = restProps.isDisabled
    ? { href: undefined, routerOptions: undefined, render: undefined }
    : getReactAriaAnchorProps(navigation, restProps);

  const handlePress: typeof restProps.onPress = e => {
    restProps.onPress?.(e);
    const text =
      restProps['aria-label'] ??
      getNodeText(children) ??
      String(restProps.href ?? '');
    analytics.captureEvent('click', text, {
      attributes: { to: String(restProps.href ?? '') },
    });
  };

  return (
    <RALink
      className={classes.root}
      ref={forwardedRef}
      {...dataAttributes}
      {...restProps}
      {...navigationProps}
      onPress={handlePress}
    >
      <span className={classes.content}>
        {iconStart}
        {children}
        {iconEnd}
      </span>
    </RALink>
  );
}

/**
 * A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.
 *
 * @public
 */
export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => {
    const definitionResult = useDefinition(ButtonLinkDefinition, props);
    const Navigation = definitionResult.navigation;

    return (
      <Navigation
        props={definitionResult.restProps}
        view={ButtonLinkView}
        viewProps={{ definitionResult, forwardedRef: ref }}
      />
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
