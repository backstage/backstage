'use client';

import { useEffect, useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sass } from '@codemirror/lang-sass';
import styles from './styles.module.css';
import { usePlayground } from '@/utils/playground-context';
import { AnimatePresence, motion } from 'framer-motion';

export const CustomTheme = () => {
  const [customTheme, setCustomTheme] = useState<string | undefined>(undefined);
  const { selectedThemeName } = usePlayground();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (selectedThemeName === 'custom') {
      const storedTheme = localStorage.getItem('customThemeCss') || '';
      setCustomTheme(storedTheme);

      let styleElement = document.getElementById(
        'custom-theme-style',
      ) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = storedTheme;
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

      let styleElement = document.getElementById(
        'custom-theme-style',
      ) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = customTheme;
    }
  };

  const onChange = useCallback((val: string) => {
    setCustomTheme(val);
  }, []);

  return (
    <AnimatePresence>
      {isClient && selectedThemeName === 'custom' && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>Custom Theme</div>
            <button className={styles.button} onClick={handleSave}>
              Save
            </button>
          </div>
          <CodeMirror
            value={customTheme}
            height="300px"
            extensions={[sass()]}
            onChange={onChange}
            className={styles.editor}
            basicSetup={{ foldGutter: false }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
