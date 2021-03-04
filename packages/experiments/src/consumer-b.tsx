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

  value.versions = [
    {
      version: 1,
      value: { a: 'asdasd' },
    },
    {
      version: 2,
      value: { b: 'asdasd' },
    },
  ];

  return transformationFrom2To1(value);
}

function useTheThing() {
  return useBackwardsCompatibleContext(Context);
}

export function ConsumerB() {
  const value = useTheThing();

  return (
    <h1>
      ConsumerB {value.b} {JSON.stringify(value)}
    </h1>
  );
}

// Single Version Context

// NameContext_1 and NameContext_2 are the same context from two different versions of a package
// provided by @namestage/provide-name@1.0.0
const NameContext_1 = createVersionedContext(1, '<name>');
// provided by @namestage/provide-name@2.0.0
const NameContext_2 = createVersionedContext(2, { name: '<name>' });

// useName_1 and useName_2 are the same function from two different versions of a package

// @namestage/use-name@1.0.0 peer dep @namestage/provide-name@^1.0.0
function useName_1(): string {
  // This version breaks when NameContext v2 is introduced, which is why we need the major bump of @namestage/provide-name
  const { version, value } = useVersionedContext(NameContext);
  if (version === 1) {
    return value;
  }
  throw new Error('bleh');
}

// @namestage/use-name@1.1.0 peer dep @namestage/provide-name@^2.0.0
function useName_2(): string {
  const { version, value } = useVersionedContext(NameContext);
  if (version === 1) {
    return value;
  } else if (version === 2) {
    return value.name;
  }
  throw new Error('bleh');
}

// Multi Version Context

// Again these context are the same but from different package versions
// provided by @namestage/provide-name@1.0.0
const NameContext_1 = createMultiVersionContext([
  { version: 1, value: '<name>' },
]);
// provided by @namestage/provide-name@1.1.0
const NameContext_2 = createMultiVersionContext([
  { version: 1, value: '<name>' },
  { version: 2, value: { name: '<name>', fullName: '<fullName>' } },
]);

// @namestage/use-name@1.0.0 peer dep @namestage/provide-name@^1.0.0
function useName_1() {
  // As both versions are being provided we can evolve the context without breaking
  const version = useMultiVersionContext(NameContext).getVersion(1);
  if (!version) {
    throw new Error('bleh');
  }
  return version.value;
}

// @namestage/use-name@1.1.0 peer dep @namestage/provide-name@^1.0.0 (kinda)
function useName_2() {
  const version = useMultiVersionContext(NameContext).getVersion(2);
  if (!version) {
    // We have the option to provide a backwards compatibility for old providers as well.
    // If we put useName and useFullName in the same package it's perhaps a bit useless
    // as we'd need to bump the peer dep, but with separate packages it can be more useful.
    const oldVersion = useMultiVersionContext(NameContext).getVersion(1);
    if (oldVersion) {
      return version.value;
    }
    throw new Error('bleh');
  }
  return version.value.name;
}

// In newer versions we can now use this new hook to also get the full name, but without a breaking change at runtime
// There are still issues with bumping the peer dep version without a major bump, but form a runtime point of view it's a safe bump.
// @namestage/use-name@1.1.0 peer dep @namestage/provide-name@^1.1.0
function useFullName_2() {
  const version = useMultiVersionContext(NameContext).getVersion(2);
  if (!version) {
    throw new Error('bleh');
  }
  return version.value.fullName;
}

/*

// App

<ProviderThing value={{value: {a: 'foo'}, version: 1}}/>


// Plugin

function useThing() {
  const {version, value} = useContext(ThingContext)

  if (version === 1) {
    return {b: value.a}
  } else if (version === 2) {
    return value
  }
}

function useVersionedContext(Context, v){
    window.realOwnerOfTheContextStuffPleaseGiveMeDataForVersion(v)
}

// v1 number
function useThing() { // is in @backstage/core@1.0.0
  return useVersionedContext(Context, 1)
}

// v2 string
function useThing() { // is in @backstage/core@1.2.0
  const a = useVersionedContext(Context, 2)
  return foo(a)
}


// plugin-foo USES @backstage/core@^1.0.0 -> 1.0, 1.2, 1.6
function usage() {
    const thing = useThing();
    thing.b + 4
}


const thing = useThing();
thing.b.toLowerCase()





*/
