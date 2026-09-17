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
import {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
  SubmitButtonProps,
  TranslatableString,
  getSubmitButtonOptions,
} from '@rjsf/utils';
import { Button } from '@backstage/ui';
import {
  RiAddLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiDeleteBinLine,
  RiFileCopyLine,
} from '@remixicon/react';

export function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps = {},
  } = getSubmitButtonOptions<T, S, F>(uiSchema);

  if (norender) {
    return null;
  }

  return (
    <Button type="submit" variant="primary" {...submitButtonProps}>
      {submitText}
    </Button>
  );
}

export function AddButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ registry, disabled, onClick, className }: IconButtonProps<T, S, F>) {
  const { translateString } = registry;

  const handleClick = onClick ? (e: any) => onClick(e) : undefined;

  return (
    <Button
      isDisabled={disabled}
      onClick={handleClick}
      className={className}
      variant="secondary"
      size="small"
      iconStart={<RiAddLine />}
    >
      {translateString(TranslatableString.AddItemButton)}
    </Button>
  );
}

export function IconButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const { icon, registry, disabled, onClick, className } = props;
  const { translateString } = registry;

  let buttonIcon;
  let buttonLabel;

  switch (icon) {
    case 'arrow-up':
      buttonIcon = <RiArrowUpLine />;
      buttonLabel = translateString(TranslatableString.MoveUpButton);
      break;
    case 'arrow-down':
      buttonIcon = <RiArrowDownLine />;
      buttonLabel = translateString(TranslatableString.MoveDownButton);
      break;
    case 'remove':
      buttonIcon = <RiDeleteBinLine />;
      buttonLabel = translateString(TranslatableString.RemoveButton);
      break;
    case 'copy':
      buttonIcon = <RiFileCopyLine />;
      buttonLabel = translateString(TranslatableString.CopyButton);
      break;
    default:
      buttonIcon = null;
      buttonLabel = '';
  }

  const handleClick = onClick ? () => onClick(undefined as any) : undefined;

  return (
    <Button
      isDisabled={disabled}
      onClick={handleClick}
      className={className}
      variant="tertiary"
      size="small"
      iconStart={buttonIcon || undefined}
    >
      {buttonLabel}
    </Button>
  );
}

const ButtonTemplates = {
  SubmitButton,
  AddButton,
  RemoveButton: IconButton,
  MoveDownButton: IconButton,
  MoveUpButton: IconButton,
  CopyButton: IconButton,
};

export default ButtonTemplates;
