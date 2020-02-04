import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@material-ui/core';

const Progress = childProps => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setIsVisible(true), 250);
    return () => clearTimeout(handle);
  }, []);

  return isVisible ? (
    <LinearProgress {...childProps} data-testid="progress" />
  ) : (
    <div style={{ display: 'none' }} data-testid="progress" />
  );
};

export default Progress;
