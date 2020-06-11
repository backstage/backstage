/*
 * Copyright 2020 Spotify AB
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
export function useHotEffect(
  _module: NodeModule,
  effectFactory: () => () => void,
) {
  const cancelEffect = effectFactory();
  if (_module.hot) {
    _module.hot.addDisposeHandler(() => {
      cancelEffect();
    });
  }
}

export function useHotMemoize<T>(
  _module: NodeModule,
  valueFactory: () => T,
): T {
  if (!_module.hot) {
    return valueFactory();
  }
  const index = (useHotMemoize as any).index ?? 0;
  (useHotMemoize as any).index += 1;
  const prevValue = _module.hot?.data?.[index];
  if (prevValue) {
    _module.hot!.addDisposeHandler(data => {
      data[index] = prevValue;
    });
    return prevValue;
  }
  const newValue = valueFactory();
  if (_module.hot) {
    _module.hot.addDisposeHandler(data => {
      data[index] = newValue;
    });
  }
  return newValue;
}
