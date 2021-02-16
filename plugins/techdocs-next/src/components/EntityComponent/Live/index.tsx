import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import styled, { css } from 'styled-components';

const column = css`
  padding: 20px;
  flex-basis: 50%;
  width: 50%;
  max-width: 50%;
  @media (max-width: 600px) {
    flex-basis: auto;
    width: 100%;
    max-width: 100%;
  }
`;

const StyledEditor = styled.div`
  background: #000;
  font-family: 'Source Code Pro', monospace;
  font-size: 20px;
  border-radius: 20px 0 0 0;
  //   height: 350rem;
  //   max-height: 350rem;
  overflow: auto;
  ${column};
  * > textarea:focus {
    outline: none;
  }
`;

const StyledProvider = styled(LiveProvider)`
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.87);
  overflow: hidden;
`;

const LiveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StyledPreview = styled(LivePreview)`
  border-radius: 0 20px 0 0;
  position: relative;
  padding: 0.5rem;
  background: white;
  color: black;
  height: auto;
  overflow: hidden;
  font-size: 40px;
  ${column};
`;

const StyledError = styled(LiveError)`
  border-radius: 0 0 20px 20px;
  display: block;
  padding: 20px;
  background: red;
  color: white;
  white-space: pre-wrap;
  text-align: left;
  font-size: 0.9em;
  font-family: 'Source Code Pro', monospace;
  font-size: 22px;
  margin: 0;
`;

const code = `function Counter () {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCount(count =>  count + 1);
      }, 1000)
    
      return () => clearInterval(this.interval);
    }, [])
  
    return (
      <center>
        <h3>
          {count}
        </h3>
      </center>
    );
  }`;

export function Live() {
  return (
    <StyledProvider code={code} scope={{ useState, useEffect }}>
      <LiveWrapper>
        <StyledEditor>
          <LiveEditor />
        </StyledEditor>
        <StyledPreview />
      </LiveWrapper>
      <StyledError />
    </StyledProvider>
  );
}
