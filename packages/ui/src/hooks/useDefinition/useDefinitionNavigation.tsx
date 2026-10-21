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

import type { ComponentType, ReactElement } from 'react';
import {
  useAnchorNavigation,
  type AnchorNavigation,
  type NavigationProps,
} from '../../navigation/useNavigation';
import { useRoutingIntegration } from '../../navigation/useRouting';
import type {
  DefinitionNavigationComponent,
  DefinitionNavigationConfig,
} from './types';

type NavigationResolverProps<N, P extends object> = {
  props: NavigationProps;
  view: ComponentType<P & { navigation: N }>;
  viewProps: P;
};

type AnchorNavigationProps<P extends object> = NavigationResolverProps<
  AnchorNavigation,
  P
>;

function NavigationView<N, P extends object>({
  navigation,
  view: View,
  viewProps,
}: Omit<NavigationResolverProps<N, P>, 'props'> & {
  navigation: N;
}): ReactElement {
  const props = { ...viewProps, navigation } as P & { navigation: N };
  return <View {...props} />;
}

function RoutedAnchorNavigation<P extends object>({
  props,
  view,
  viewProps,
}: AnchorNavigationProps<P>): ReactElement {
  const navigation = useAnchorNavigation(props);
  return (
    <NavigationView navigation={navigation} view={view} viewProps={viewProps} />
  );
}

function NativeAnchorNavigation<P extends object>({
  props,
  view,
  viewProps,
}: AnchorNavigationProps<P>): ReactElement {
  let navigation: AnchorNavigation = {
    type: 'none',
    canMatchRoute: false,
  };
  if (props.href) {
    navigation = {
      type: 'native',
      canMatchRoute: false,
      ariaHref: props.href,
      browserHref: props.href,
    };
  }

  return (
    <NavigationView navigation={navigation} view={view} viewProps={viewProps} />
  );
}

/**
 * Selects a resolver component so router-specific hooks only mount when a
 * React Router context is available. The resolver injects the normalized
 * navigation into the component view as an ordinary React prop.
 */
export function useDefinitionNavigation(
  _config: DefinitionNavigationConfig,
): DefinitionNavigationComponent {
  const routing = useRoutingIntegration({ fallback: true });
  const inRouterContext = routing.useInRouterContext();

  if (inRouterContext) {
    return RoutedAnchorNavigation;
  }
  return NativeAnchorNavigation;
}
