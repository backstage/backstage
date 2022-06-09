/*
 * Copyright 2022 The Backstage Authors
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

import { ComponentType, RefAttributes } from 'react';

import { BackstagePlugin } from '../plugin';

/** @public */
export type OpaqueComponentProps<Context extends {}> = { value: Context };

/** @public */
export type ComponentRootProviderProps<Props extends {}, Context> = {
  /**
   * An opaque component representing the _inner_ component (or the next
   * adaptation) with the default context value.
   */
  Component: ComponentType<OpaqueComponentProps<Context>>;

  /**
   * Component props
   * @readonly
   */
  props: Readonly<Props>;
};

/** @public */
export type ComponentAdaptationProps<Props extends {}, Context extends {}> = {
  /**
   * The context value
   */
  value: Context;

  /**
   * Component props
   * @readonly
   */
  props: Readonly<Props>;

  /**
   * An opaque component representing the _inner_ component (or the next
   * adaptation).
   *
   * The prop `value` is optional. If set, it'll provide a new context value
   * downstream.
   */
  Component: ComponentType<Partial<OpaqueComponentProps<Context>>>;
};

/** @public */
export type AdaptableComponentProps<Props extends {}, Context extends {}> = {
  /**
   * The component props as provided by the user (potentially modified by props
   * interceptors).
   */
  props: Props;

  /**
   * The context value
   */
  value: Context;
};

/** @public */
export type AdaptableComponentExtraProps<ExtraProps extends {}> = {
  /**
   * Extra props, e.g. `ref` if the component can take a React ref.
   */
  info: ExtraProps;
};

/** @public */
export interface AdaptableComponentConfigSyncProvider<
  Props extends {},
  Context extends {},
> {
  /**
   * The 'Provider' part of an extendable component. This component should build
   * up a context object, and forward this to the inner Component using the
   * provided props `ComponentProvider` and `Component`.
   */
  Provider: ComponentType<ComponentRootProviderProps<Props, Context>>;
  asyncProvider?: never;
}

/** @public */
export interface AdaptableComponentConfigAsyncProvider<
  Props extends {},
  Context extends {},
> {
  /**
   * The 'Provider' part of an extendable component. This component should build
   * up a context object, and forward this to the inner Component using the
   * provided props `ComponentProvider` and `Component`.
   *
   * An `asyncProvider` is a lazy-loaded component, i.e. a function that returns
   * a promise to the Provider component.
   */
  asyncProvider: () => Promise<
    ComponentType<ComponentRootProviderProps<Props, Context>>
  >;
  Provider?: never;
}

/** @public */
export interface AdaptableComponentConfigSyncComponent<
  Props extends {},
  Context extends {},
  ExtraProps extends {},
> {
  /**
   * The inner 'Component' part of an extendable component. This component
   * should render the UI (if any) by using the values of the context, and
   * perhaps also the props.
   */
  Component: ComponentType<
    AdaptableComponentProps<Props, Context> &
      AdaptableComponentExtraProps<ExtraProps>
  >;
  asyncComponent?: never;
}

/** @public */
export interface AdaptableComponentConfigAsyncComponent<
  Props extends {},
  Context extends {},
  ExtraProps extends {},
> {
  /**
   * The inner 'Component' part of an extendable component. This component
   * should render the UI (if any) by using the values of the context, and
   * perhaps also the props.
   *
   * An `asyncComponent` is a lazy-loaded component, i.e. a function that returns
   * a promise to the Component component.
   */
  asyncComponent: () => Promise<
    ComponentType<
      AdaptableComponentProps<Props, Context> &
        AdaptableComponentExtraProps<ExtraProps>
    >
  >;
  Component?: never;
}

/** @public */
export type AdaptableComponentConfig<
  Props extends {},
  Context extends {},
  ExtraProps extends {} = {},
> = (
  | AdaptableComponentConfigSyncProvider<Props, Context>
  | AdaptableComponentConfigAsyncProvider<Props, Context>
) &
  (
    | AdaptableComponentConfigSyncComponent<Props, Context, ExtraProps>
    | AdaptableComponentConfigAsyncComponent<Props, Context, ExtraProps>
  ) & {
    /**
     * A unique id of this component
     */
    id: string;
  };

/** @public */
export type AdaptableComponentRef<
  Props extends {},
  Context extends {},
  ExtraProps extends {} = {},
> = Pick<AdaptableComponentConfig<Props, Context, ExtraProps>, 'id'> &
  AdaptableComponentConfigSyncProvider<Props, Context> &
  AdaptableComponentConfigSyncComponent<Props, Context, ExtraProps> & {
    /**
     * @private
     * @readonly
     */
    forwardable: boolean;
  };

/**
 * The result of createAdaptableComponent(). This object contains a
 * `componentRef` and a `Component` which should both be re-exported with
 * different names.
 *
 * The `componentRef` is used when _extending_ this component, and `Component`
 * is what the users use to render the component.
 *
 * @public
 */
export interface AdaptableComponentDescriptor<
  Props extends {},
  Context extends {},
  ExtraProps extends {} = {},
> {
  componentRef: AdaptableComponentRef<Props, Context, ExtraProps>;
  Component: ComponentType<Props & ExtraProps>;
}

/** @public */
export type RefInfoProps = Pick<RefAttributes<any>, 'ref'>;

/** @public */
export type UnimplementedAdaptableComponentRefConfig = Pick<
  AdaptableComponentConfig<any, any>,
  'id'
>;

/**
 * A props interceptor function. It takes props and returns the same props or a
 * new props object of the same type.
 *
 * @public
 */
export type AdaptableComponentPropsInterceptor<Props extends {}> = (
  props: Props,
) => Props;

/**
 * A props interceptor function. It takes props and returns the same props or a
 * new props object of the same type.
 *
 * @public
 */
export type AdaptableComponentAdaptation<
  Props extends {},
  Context extends {},
> = ComponentType<ComponentAdaptationProps<Props, Context>>;

/** @public */
export type ComponentAdaptationSpec<Props extends {}, Context extends {}> = {
  /**
   * A unique id for the extension.
   */
  id: string;

  /**
   * Intercept the props, to e.g. rewrite some of them
   */
  interceptProps?: AdaptableComponentPropsInterceptor<Props>;

  /**
   * A context provider component to intercept the adaptable component context
   */
  Adaptation?: AdaptableComponentAdaptation<Props, Context>;

  /**
   * A lazy-loaded context provider component to intercept the adaptable
   * component context
   */
  asyncAdaptation?: () => Promise<AdaptableComponentAdaptation<Props, Context>>;
};

/**
 * A component extension, consisting of the component ref, and the extension
 * spec ({@link ComponentAdaptationSpec}).
 *
 * @public
 */
export type ComponentAdaptation<
  Props extends {} = any,
  Context extends {} = any,
> = {
  ref: AdaptableComponentRef<Props, Context>;
  spec: Omit<ComponentAdaptationSpec<Props, Context>, 'asyncAdaptation'>;
  key: string;
  plugin?: BackstagePlugin<any, any>;
};

/**
 * Returns the type of an adaptation component given a component ref
 */
export type ComponentAdaptationOf<
  ComponentRef extends AdaptableComponentRef<any, any>,
> = ComponentRef extends AdaptableComponentRef<infer Props, infer Context>
  ? AdaptableComponentAdaptation<Props, Context>
  : never;
