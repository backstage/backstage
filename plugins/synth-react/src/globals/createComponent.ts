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
import { PSValue, PlatformScript } from 'platformscript';
import * as ps from 'platformscript';
import React from 'react';
import { lookup } from '../lookup';

export const createComponent = (interpreter: PlatformScript) =>
  ps.fn(
    function* OutterComponent(c) {
      const $cArg = yield* c.env.eval(c.arg);

      if ($cArg.type !== 'map') {
        throw new TypeError(`Component expects a map argument.`);
      }

      let type: string = '';

      const props: Record<string, unknown> = {};

      for (const [key, value] of $cArg.value.entries()) {
        if (key.type === 'string') {
          if (key.value === 'type') {
            type = value.value;
          } else {
            if (value.type === 'fn') {
              props[key.value] = c.env.call(value, $cArg);
            } else {
              props[key.value] = ps.ps2js(value);
            }
          }
        }
      }

      if (!type) {
        throw new TypeError(`Component: { type: } must not be empty`);
      }

      const defaults = yield* c.env.eval(c.rest);

      return ps.fn(
        function* InnerComponent({ arg, env, rest }) {
          const $arg: PSValue = yield* env.eval(arg);
          if (rest.type === 'map') {
            // add key prop to each item in children array
            const children = lookup('<>', rest);
            if (children && children.type === 'list') {
              injectKeyProps(children);
            }
          }

          const $options = yield* env.eval(rest);

          let children = [];

          switch ($arg.type) {
            case 'map':
              for (const [key, value] of $arg.value.entries()) {
                if (
                  value.type === 'fn' &&
                  key.type === 'string' &&
                  defaults.type === 'map'
                ) {
                  const defaultValue = lookup(key.value, defaults);
                  if (defaultValue) {
                    const result = yield* env.call(value, defaultValue);
                    if (result.type === 'list') {
                      const values = [];

                      for (const item of result.value) {
                        if (item.type === 'fn') {
                          const fn = yield* env.call(item, arg);
                          values.push(ps.ps2js(fn));
                        } else {
                          values.push(ps.ps2js(item));
                        }
                      }
                      props[String(key.value)] = values;
                    }
                  }
                } else {
                  props[String(key.value)] = value.value;
                }
              }
              if ($options.type === 'map') {
                const key = lookup('key', $options);
                if (!!key) {
                  props.key = key.value;
                }
                const _children = lookup('<>', $options);
                if (!!_children) {
                  if (_children.type === 'list') {
                    children = _children.value.map(value => value.value);
                  } else {
                    children = _children.value;
                  }
                }
              }
              break;
            case 'list':
              children = $arg.value.map(value => value.value);
              break;
            default:
              children = $arg.value;
          }

          return ps.external(React.createElement(type, props, children));
        },
        { name: 'props' },
      );
    },
    { name: 'component' },
  );

function injectKeyProps(list: ps.PSList) {
  let index = 0;
  for (const item of list.value) {
    if (item.type === 'map') {
      if (!lookup('key', item)) {
        item.value.set(
          { type: 'string', value: 'key' },
          { type: 'string', value: String(index) },
        );
      }
    }
    index++;
  }
}
