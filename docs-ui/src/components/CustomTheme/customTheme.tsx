'use client';

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sass } from '@codemirror/lang-sass';
import styles from './styles.module.css';
import { usePlayground } from '@/utils/playground-context';
import { AnimatePresence, motion } from 'motion/react';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { RiArrowDownSLine } from '@remixicon/react';

const defaultTheme = `:root {
  --bui-bg-solid: #000;
}`;

// Stable server snapshots for useSyncExternalStore
const serverIsClient = false;
const serverDefaultTheme = defaultTheme;

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: 'var(--surface-1)',
    backgroundImage: '',
    foreground: '#6182B8',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#6182B8' },
    { tag: t.number, color: '#6182B8' },
    { tag: t.bool, color: '#6182B8' },
    { tag: t.null, color: '#6182B8' },
    { tag: t.keyword, color: '#6182B8' },
    { tag: t.operator, color: '#6182B8' },
    { tag: t.className, color: '#6182B8' },
    { tag: t.definition(t.typeName), color: '#6182B8' },
    { tag: t.typeName, color: '#6182B8' },
    { tag: t.angleBracket, color: '#6182B8' },
    { tag: t.tagName, color: '#6182B8' },
    { tag: t.attributeName, color: '#6182B8' },
  ],
});

export const CustomTheme = () => {
  const [open, setOpen] = useState(true);
  const { selectedThemeName } = usePlayground();
  const [savedMessage, setSavedMessage] = useState<string>('Save');

  // SSR-safe client detection
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => serverIsClient,
  );

  // SSR-safe localStorage access for custom theme
  const customThemeFromStorage = useSyncExternalStore(
    callback => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => {
      const stored = localStorage.getItem('customThemeCss');
      if (!stored) {
        localStorage.setItem('customThemeCss', defaultTheme);
        return defaultTheme;
      }
      return stored;
    },
    () => serverDefaultTheme,
  );

  const [customTheme, setCustomTheme] = useState(customThemeFromStorage);

  // Sync from storage when it changes
  useEffect(() => {
    setCustomTheme(customThemeFromStorage);
  }, [customThemeFromStorage]);

  const updateStyleElement = (theme: string) => {
    let styleElement = document.getElementById(
      'custom-theme-style',
    ) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-theme-style';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = theme;
  };

  // Apply custom theme to DOM
  useEffect(() => {
    if (selectedThemeName === 'custom' && customTheme && isClient) {
      updateStyleElement(customTheme);
    } else if (isClient) {
      const styleElement = document.getElementById(
        'custom-theme-style',
      ) as HTMLStyleElement;
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [selectedThemeName, customTheme, isClient]);

  const handleSave = () => {
    if (customTheme) {
      localStorage.setItem('customThemeCss', customTheme);
      updateStyleElement(customTheme);
      setSavedMessage('Saved!');
      setTimeout(() => setSavedMessage('Save'), 1000);
    }
  };

  const handleChange = useCallback((val: string) => {
    setCustomTheme(val);
  }, []);

  if (isClient === false) return null;

  return (
    <AnimatePresence>
      {selectedThemeName === 'custom' && (
        <motion.div
          className={`${styles.container} ${open ? styles.open : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>Custom Theme</div>
            <div className={styles.headerRight}>
              {open && (
                <button className={styles.buttonSave} onClick={handleSave}>
                  {savedMessage}
                </button>
              )}
              <button
                className={styles.buttonClose}
                onClick={() => setOpen(!open)}
              >
                <RiArrowDownSLine
                  aria-hidden="true"
                  style={{
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            </div>
          </div>
          <div className={styles.editorContainer}>
            <CodeMirror
              value={customTheme}
              height="300px"
              extensions={[sass()]}
              onChange={handleChange}
              className={styles.editor}
              basicSetup={{ foldGutter: false }}
              theme={myTheme}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
