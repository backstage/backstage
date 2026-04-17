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

import {
  ChangeEvent,
  MouseEvent,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const settings = {
  key: 'techdocs.addons.settings.textsize',
  defaultValue: 100,
};

const marks = [
  { value: 90 },
  { value: 100 },
  { value: 115 },
  { value: 130 },
  { value: 150 },
];

export const TextSizeAddon = () => {
  const [body] = useShadowRootElements(['body']);

  const [value, setValue] = useState<number>(() => {
    const initialValue = localStorage?.getItem(settings.key);
    return initialValue ? parseInt(initialValue, 10) : settings.defaultValue;
  });

  const values = useMemo(() => marks.map(mark => mark.value), []);
  const index = useMemo(() => values.indexOf(value), [values, value]);
  const min = useMemo(() => values[0], [values]);
  const max = useMemo(() => values[values.length - 1], [values]);

  const handleChangeCommitted = useCallback(
    (_event: ChangeEvent<HTMLInputElement> | MouseEvent, newValue: number) => {
      setValue(newValue);
      localStorage?.setItem(settings.key, String(newValue));
    },
    [setValue],
  );

  const handleSliderChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(event.target.value);
      // Snap to nearest mark
      const closest = values.reduce((prev, curr) =>
        Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev,
      );
      handleChangeCommitted(event, closest);
    },
    [values, handleChangeCommitted],
  );

  const handleDecreaseClick = useCallback(
    (event: MouseEvent) => {
      if (index > 0) {
        handleChangeCommitted(event, values[index - 1]);
      }
    },
    [index, values, handleChangeCommitted],
  );

  const handleIncreaseClick = useCallback(
    (event: MouseEvent) => {
      if (index < values.length - 1) {
        handleChangeCommitted(event, values[index + 1]);
      }
    },
    [index, values, handleChangeCommitted],
  );

  useEffect(() => {
    if (!body) return;
    const htmlFontSize = 16;
    body.style.setProperty(
      '--md-typeset-font-size',
      `${htmlFontSize * (value / 100)}px`,
    );
  }, [body, value]);

  return (
    <div role="menuitem" style={{ padding: '6px 16px', cursor: 'default' }}>
      <span
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--foreground, inherit)',
          marginBottom: '8px',
        }}
      >
        Text size
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: 200,
          color: 'var(--muted-foreground, #666)',
        }}
      >
        <button
          type="button"
          onClick={handleDecreaseClick}
          disabled={value === min}
          aria-label="Decrease text size"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '6px',
            border: '1px solid var(--border, #e5e5e5)',
            background: 'var(--background, #fff)',
            cursor: value === min ? 'not-allowed' : 'pointer',
            opacity: value === min ? 0.5 : 1,
            color: 'inherit',
            fontSize: '16px',
            lineHeight: 1,
          }}
        >
          −
        </button>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleSliderChange}
            aria-label="Text size"
            aria-valuetext={`${value}%`}
            style={{
              width: '100%',
              height: '4px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'var(--border, #e5e5e5)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--primary, #5B39F3)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground, #666)',
            }}
          >
            {value}%
          </span>
        </div>
        <button
          type="button"
          onClick={handleIncreaseClick}
          disabled={value === max}
          aria-label="Increase text size"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '6px',
            border: '1px solid var(--border, #e5e5e5)',
            background: 'var(--background, #fff)',
            cursor: value === max ? 'not-allowed' : 'pointer',
            opacity: value === max ? 0.5 : 1,
            color: 'inherit',
            fontSize: '16px',
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};
