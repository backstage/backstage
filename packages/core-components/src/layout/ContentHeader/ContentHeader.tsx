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
import { cn } from '../../lib/utils';
import { PropsWithChildren, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

/**
 * TODO: favoriteable capability
 */

/** @public */
export type ContentHeaderClassKey =
  | 'container'
  | 'leftItemsBox'
  | 'rightItemsBox'
  | 'description'
  | 'title';

type ContentHeaderTitleProps = {
  title?: string;
  className?: string;
};

const ContentHeaderTitle = ({ title, className }: ContentHeaderTitleProps) => (
  <h2
    className={cn('text-xl font-semibold', className)}
    data-testid="header-title"
  >
    {title}
  </h2>
);

type ContentHeaderDescriptionProps = {
  description?: string;
  className?: string;
};

const ContentHeaderDescription = ({
  description,
  className,
}: ContentHeaderDescriptionProps) =>
  description ? (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      data-testid="header-description"
    >
      {description}
    </p>
  ) : null;

type ContentHeaderProps = {
  title?: ContentHeaderTitleProps['title'];
  titleComponent?: ReactNode;
  description?: ContentHeaderDescriptionProps['description'];
  descriptionComponent?: ReactNode;
  textAlign?: 'left' | 'right' | 'center';
};

/**
 *  A header at the top inside a {@link Content}.
 *
 * @public
 *
 */

export function ContentHeader(props: PropsWithChildren<ContentHeaderProps>) {
  const {
    description,
    title,
    titleComponent: TitleComponent = undefined,
    children,
    descriptionComponent: DescriptionComponent = undefined,
    textAlign = 'left',
  } = props;

  const renderedTitle = TitleComponent ? (
    TitleComponent
  ) : (
    <ContentHeaderTitle title={title} className="inline-flex mb-0" />
  );

  const renderedDescription = DescriptionComponent ? (
    DescriptionComponent
  ) : (
    <ContentHeaderDescription description={description} />
  );

  return (
    <>
      <Helmet title={title} />
      <div
        className={cn(
          'w-full flex flex-row flex-wrap justify-end items-center mb-4',
          textAlign === 'left' && 'text-left',
          textAlign === 'center' && 'text-center',
          textAlign === 'right' && 'text-right',
        )}
      >
        <div className="flex-auto min-w-0 overflow-visible">
          {renderedTitle}
          {renderedDescription}
        </div>
        <div className="flex-initial flex flex-row flex-wrap items-center ml-2 min-w-0 overflow-visible">
          {children}
        </div>
      </div>
    </>
  );
}
