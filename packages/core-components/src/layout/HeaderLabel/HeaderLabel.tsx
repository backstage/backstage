/*
 * Copyright 2020 The Backstage Authors
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

import { ReactNode, PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';
import { Link } from '../../components/Link';

/** @public */
export type HeaderLabelClassKey = 'root' | 'label' | 'value';

type HeaderLabelContentProps = PropsWithChildren<{
  value: ReactNode;
  className: string;
  typographyRootComponent?: keyof JSX.IntrinsicElements;
}>;

const HeaderLabelContent = ({
  value,
  className,
  typographyRootComponent,
}: HeaderLabelContentProps) => {
  const Component =
    typographyRootComponent ?? (typeof value === 'string' ? 'p' : 'span');
  return <Component className={className}>{value}</Component>;
};

type HeaderLabelProps = {
  label: string;
  value?: HeaderLabelContentProps['value'];
  contentTypograpyRootComponent?: HeaderLabelContentProps['typographyRootComponent'];
  url?: string;
};

/**
 * Additional label to main {@link Header}
 *
 * @public
 *
 */
export function HeaderLabel(props: HeaderLabelProps) {
  const { label, value, url, contentTypograpyRootComponent } = props;
  const content = (
    <HeaderLabelContent
      className={cn('text-sm leading-none text-current opacity-80')}
      value={value || '<Unknown>'}
      typographyRootComponent={contentTypograpyRootComponent}
    />
  );
  return (
    <div>
      <span className={cn('text-left')}>
        <span
          className={cn(
            'block text-sm font-bold tracking-normal leading-none mb-1 text-current',
          )}
        >
          {label}
        </span>
        {url ? <Link to={url}>{content}</Link> : content}
      </span>
    </div>
  );
}
