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
import { useContext, useMemo, useState } from 'react';
import * as ps from 'platformscript';
import { useAsync } from 'react-use';
import { createPlatformScript, PSValue } from 'platformscript';
import { PlatformScriptGlobalsContext } from '../contexts/PlatformScriptGlobalsContext';

export function usePlatformScript(yaml: string) {
  const globals = useContext(PlatformScriptGlobalsContext);

  const platformscript = useMemo(() => {
    return createPlatformScript(globals);
  }, [globals]);

  const [lastSuccessfulResult, setLastSuccessfulResult] = useState<
    ps.PSValue | undefined
  >();

  const program = useMemo(() => {
    try {
      const result = ps.parse(yaml as string);
      return result;
    } catch (e) {
      return e;
    }
  }, [yaml]);

  const result = useAsync(async (): Promise<PSValue> => {
    if (program instanceof Error || program.name === 'YAMLException') {
      throw program;
    }

    const mod = await platformscript.moduleEval(
      program,
      new URL('/dynamic.yaml', window.location.href),
    );

    setLastSuccessfulResult(mod.value);

    return mod.value;
  }, [program]);

  if (!!result.error) {
    return {
      ...result,
      value: lastSuccessfulResult,
    };
  }

  return result;
}
