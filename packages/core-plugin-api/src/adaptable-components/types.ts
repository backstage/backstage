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

import { ComponentClass, RefAttributes } from 'react';

import { ComponentType } from '@backstage/types';

import { BackstagePlugin } from '../plugin';

type OptionalKeys<T> = Exclude<
  {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
  }[keyof T],
  symbol | number
>;

/** @public */
export type OpaqueComponentProps<TAdaptableProps extends {}> = {
  /**
   * Set particular props (those that are adaptable)
   */
  set?: Partial<TAdaptableProps>;

  /**
   * Unset props (or a single prop) that are adaptable and optional.
   *
   * This is specified by the _name_ of the prop(s).
   */
  unset?: OptionalKeys<TAdaptableProps> | OptionalKeys<TAdaptableProps>[];
};

/** @public */
export type ComponentRootProviderProps<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = {
  /**
   * An opaque component representing the _inner_ component (or the next
   * adaptation).
   */
  Component: ComponentType<OpaqueComponentProps<Pick<TProps, TAdaptableKeys>>>;

  /**
   * Component props
   * @readonly
   */
  props: Readonly<TProps>;
};

/** @public */
export type ComponentAdaptationProps<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = {
  /**
   * The adaptable props
   */
  origProps: Readonly<TProps>;

  /**
   * Component props
   * @readonly
   */
  props: Readonly<TProps>;

  /**
   * An opaque component representing the _inner_ component (or the next
   * adaptation).
   *
   * The prop `value` is optional. If set, it'll provide a new context value
   * downstream.
   */
  Component: ComponentType<
    Partial<OpaqueComponentProps<Pick<TProps, TAdaptableKeys>>>
  >;
};

/**
 * The props of the final _inner_ component.
 *
 * The `props` prop is the merged final version of the props, after adapatations
 * has adapted the adaptable props. This is the most useful way of reading
 * props.
 *
 * If neessary, the original (untouched) props provided by the user of the
 * component can be read from `origProps`, and the sole adaptable props are
 * provided in `adaptableProps`.
 *
 * @public
 */
export type AdaptableComponentProps<TProps extends {}> = {
  /**
   * The component props as provided by the user (potentially modified by props
   * interceptors).
   */
  origProps: Readonly<TProps>;

  /**
   * The merged props, i.e. the original props provided by the user of the
   * component, merged with the adaptations.
   */
  props: Readonly<TProps>;
};

/** @public */
export type AdaptableComponentExtraProps<ExtraProps extends {}> = {
  /**
   * Extra props, e.g. `ref` if the component can take a React ref.
   */
  info: ExtraProps;
};

/** @public */
export interface AdaptableComponentConfigSyncPrepare<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> {
  /**
   * The 'Provider' part of an extendable component. This component should build
   * up a context object, and forward this to the inner Component using the
   * provided props `ComponentProvider` and `Component`.
   */
  Prepare?: ComponentType<ComponentRootProviderProps<TProps, TAdaptableKeys>>;
  asyncPrepare?: never;
}

/** @public */
export interface AdaptableComponentConfigAsyncPrepare<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> {
  /**
   * The 'Provider' part of an extendable component. This component should build
   * up a context object, and forward this to the inner Component using the
   * provided props `ComponentProvider` and `Component`.
   *
   * An `asyncProvider` is a lazy-loaded component, i.e. a function that returns
   * a promise to the Provider component.
   */
  asyncPrepare: () => Promise<
    ComponentType<ComponentRootProviderProps<TProps, TAdaptableKeys>>
  >;
  Prepare?: never;
}

/** @public */
export interface AdaptableComponentConfigSyncComponent<
  TProps extends {},
  TExtraProps extends {},
> {
  /**
   * The inner 'Component' part of an extendable component. This component
   * should render the UI (if any) by using the values of the context, and
   * perhaps also the props.
   */
  Component: ComponentType<
    AdaptableComponentProps<TProps> & AdaptableComponentExtraProps<TExtraProps>
  >;
  asyncComponent?: never;
}

/** @public */
export interface AdaptableComponentConfigAsyncComponent<
  TProps extends {},
  TExtraProps extends {},
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
      AdaptableComponentProps<TProps> &
        AdaptableComponentExtraProps<TExtraProps>
    >
  >;
  Component?: never;
}

/** @public */
export type AdaptableComponentConfig<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {} = {},
> = (
  | AdaptableComponentConfigSyncPrepare<TProps, TAdaptableKeys>
  | AdaptableComponentConfigAsyncPrepare<TProps, TAdaptableKeys>
) &
  (
    | AdaptableComponentConfigSyncComponent<TProps, TExtraProps>
    | AdaptableComponentConfigAsyncComponent<TProps, TExtraProps>
  ) & {
    /**
     * A unique id of this component
     */
    id: string;
  };

/** @public */
export type AdaptableComponentRef<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {} = {},
  Forwardable extends boolean = boolean,
> = Pick<AdaptableComponentConfig<TProps, TAdaptableKeys, TExtraProps>, 'id'> &
  Pick<
    Required<AdaptableComponentConfigSyncPrepare<TProps, TAdaptableKeys>>,
    'Prepare'
  > &
  AdaptableComponentConfigSyncComponent<TProps, TExtraProps> & {
    /**
     * @private
     * @readonly
     */
    forwardable: Forwardable;
  } & {
    TAdaptation: AdaptableComponentAdaptation<TProps, TAdaptableKeys>;
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
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {} = {},
> {
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys, TExtraProps>;
  Component: ComponentType<TProps & TExtraProps>;
}

/**
 * The result of createAdaptableForwardableComponent(). This object contains a
 * `componentRef` and a `Component` which should both be re-exported with
 * different names.
 *
 * The `componentRef` is used when _extending_ this component, and `Component`
 * is what the users use to render the component.
 *
 * @public
 */
export interface AdaptableForwardableComponentDescriptor<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
  TExtraProps extends {} = {},
> {
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys, TExtraProps>;
  Component: ComponentClass<TProps & TExtraProps>;
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
export type AdaptableComponentPropsInterceptor<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = (props: TProps) => Pick<TProps, TAdaptableKeys> & {
  [P in Exclude<keyof TProps, TAdaptableKeys>]?: never;
};

/**
 * An adaptation component.
 *
 * @public
 */
export type AdaptableComponentAdaptation<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = ComponentType<ComponentAdaptationProps<TProps, TAdaptableKeys>>;

/** @public */
export type ComponentAdaptationSpec<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = {
  /**
   * A unique id for the extension.
   */
  id: string;

  /**
   * Intercept the props, to e.g. rewrite some of them
   */
  interceptProps?: AdaptableComponentPropsInterceptor<TProps, TAdaptableKeys>;

  /**
   * A context provider component to intercept the adaptable component context
   */
  Adaptation?: AdaptableComponentAdaptation<TProps, TAdaptableKeys>;

  /**
   * A lazy-loaded context provider component to intercept the adaptable
   * component context
   */
  asyncAdaptation?: () => Promise<
    AdaptableComponentAdaptation<TProps, TAdaptableKeys>
  >;
};

/**
 * A component extension, consisting of the component ref, and the extension
 * spec ({@link ComponentAdaptationSpec}).
 *
 * @public
 */
export type ComponentAdaptation<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
> = {
  ref: AdaptableComponentRef<TProps, TAdaptableKeys>;
  spec: Omit<
    ComponentAdaptationSpec<TProps, TAdaptableKeys>,
    'asyncAdaptation'
  >;
  key: string;
  plugin?: BackstagePlugin<any, any>;
};

/**
 * Returns the type of an adaptation component given a component ref
 */
export type ComponentAdaptationOf<
  ComponentRef extends AdaptableComponentRef<any, any>,
> = ComponentRef extends AdaptableComponentRef<
  infer TProps,
  infer TAdaptableKeys
>
  ? AdaptableComponentAdaptation<TProps, TAdaptableKeys>
  : never;
