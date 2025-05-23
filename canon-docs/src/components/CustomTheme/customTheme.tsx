'use client';

import { useEffect, useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sass } from '@codemirror/lang-sass';
import styles from './styles.module.css';
import { usePlayground } from '@/utils/playground-context';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '../../../../packages/canon';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

const defaultTheme = `:root {
  --canon-bg-accent: #000;
}`;

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: 'var(--canon-bg-surface-1)',
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
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(true);
  const [customTheme, setCustomTheme] = useState<string | undefined>(undefined);
  const { selectedThemeName } = usePlayground();
  const [savedMessage, setSavedMessage] = useState<string>('Save');

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

  useEffect(() => {
    if (selectedThemeName === 'custom') {
      let storedTheme = localStorage.getItem('customThemeCss');
      if (!storedTheme) {
        storedTheme = defaultTheme;
        localStorage.setItem('customThemeCss', storedTheme);
      }
      setCustomTheme(storedTheme);
      updateStyleElement(storedTheme);
    } else {
      const styleElement = document.getElementById(
        'custom-theme-style',
      ) as HTMLStyleElement;
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [selectedThemeName]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                <Icon name={open ? 'chevron-down' : 'chevron-up'} />
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
