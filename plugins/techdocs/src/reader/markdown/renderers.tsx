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

import useAsync from 'react-use/esm/useAsync';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

export function MathContent({
  text,
  display,
}: {
  text: string;
  display: boolean;
}) {
  const state = useAsync(async () => {
    const katex = await import('katex');
    if (text.length > 20000)
      throw new Error('Math exceeds the rendering limit');
    return katex.renderToString(text, {
      displayMode: display,
      trust: false,
      strict: 'error',
      throwOnError: false,
      maxExpand: 1000,
      maxSize: 20,
    });
  }, [text, display]);
  if (state.error) return <code>{text}</code>;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(state.value ?? ''),
      }}
    />
  );
}

export function HighlightedCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const state = useAsync(async () => {
    if (code.length > 50000 || !language) return undefined;
    const { default: hljs } = await import('highlight.js/lib/common');
    if (!hljs.getLanguage(language)) return undefined;
    return DOMPurify.sanitize(
      hljs.highlight(code, { language, ignoreIllegals: true }).value,
      { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] },
    );
  }, [code, language]);
  return (
    <pre>
      {state.value ? (
        <code dangerouslySetInnerHTML={{ __html: state.value }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
}
