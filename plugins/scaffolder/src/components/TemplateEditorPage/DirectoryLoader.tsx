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

import Button from '@material-ui/core/Button';
import React from 'react';
import { useAsync } from '@react-hookz/web';
import {
  TemplateDirectoryAccess,
  WebFileSystemAccess,
} from '../../lib/filesystem';

interface DirectoryLoaderProps {
  onLoad(directory: TemplateDirectoryAccess): void;
}

/** @internal */
export function DirectoryLoader(props: DirectoryLoaderProps): JSX.Element {
  const supportsWebAccess = WebFileSystemAccess.isSupported();

  const [{ status, error }, { execute }] = useAsync(async () => {
    if (!supportsWebAccess) {
      return;
    }
    const directory = await WebFileSystemAccess.get().requestDirectoryAccess();
    props.onLoad(directory);
  });

  if (error) {
    return <div>Fail: {error.message}</div>;
  }

  return (
    <Button
      disabled={!supportsWebAccess || status === 'loading'}
      onClick={execute}
    >
      Load Directory
    </Button>
  );
}
