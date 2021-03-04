/*
 * Copyright 2021 Spotify AB
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

import React, { useContext, PropsWithChildren } from 'react';
import { Context } from './old-context';
// import { Context as NewContext } from './context';

// export function ConsumerB() {
//   return (
//     <Context.Provider value={{ silly: 'thing' }}>
//       <InternalConsumerB />
//     </Context.Provider>
//   );
// }

// function InternalConsumerB() {
//   const value = useContext(Context);

//   return <h1>ConsumerB {JSON.stringify(value)}</h1>;
// }

function transformationFrom2To1(state) {
  return { b: state.a };
}

function useBackwardsCompatibleContext(Context) {
  console.log(
    'I have to change version from ',
    window.ourContext.v,
    ' to ',
    Context.v,
  );

  const value = useContext(window.ourContext);

  // value.versions = [{
  //   version: 1,
  //   value: {a: 'asdasd'},
  // }, {
  //   version: 2,
  //   value: {b: 'asdasd'},
  // }]

  return transformationFrom2To1(value);
}

function useDerp() {
  return useBackwardsCompatibleContext(Context);
}

export function ConsumerB() {
  const value = useDerp();

  return (
    <h1>
      ConsumerB {value.b} {JSON.stringify(value)}
    </h1>
  );
}
