import{j as e}from"./iframe-r9k78NKI.js";import{C as t}from"./CodeSnippet-BnayZY1N.js";import{I as d}from"./InfoCard-DZOTHf-V.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CPjilEka.js";import"./styled-Cg4IVtII.js";import"./CopyTextButton-0h5jNQNi.js";import"./useCopyToClipboard-DfNipbZK.js";import"./useMountedState-CrP_-pBR.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";import"./Portal-CW8an0o0.js";import"./index-s9MTga9j.js";import"./makeStyles-CipF_TRV.js";import"./CardContent-CVJPA2mf.js";import"./ErrorBoundary-DjqNfD2g.js";import"./ErrorPanel-BoltPlz9.js";import"./WarningPanel-CP3Uvm3P.js";import"./ExpandMore-B3MsvMOX.js";import"./AccordionDetails-Dq0J3I9r.js";import"./index-B9sM2jn7.js";import"./Collapse-EhUXEIAK.js";import"./MarkdownContent-BdHL4Rvi.js";import"./Grid-Bz9nGms7.js";import"./List-BDEgjW0i.js";import"./ListContext-BzmVZQwf.js";import"./ListItem-DD0_kxo4.js";import"./ListItemText-B4TkGekz.js";import"./LinkButton-VME5XMmd.js";import"./Link-zcGWAEux.js";import"./lodash-B26Sq6Yw.js";import"./index-C1fYClSH.js";import"./useAnalytics-wKKBdz0U.js";import"./useApp-Nm0FtJwT.js";import"./Button-CciA6M2u.js";import"./CardHeader-DMGiAmiI.js";import"./Divider-IUkKH4dH.js";import"./CardActions-DZPpvsSK.js";import"./BottomLink-B-_93yhb.js";import"./ArrowForward-gQYaq-fA.js";const $={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},c={width:300},p=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,l=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,m=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,r=()=>e.jsx(d,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),o=()=>e.jsx(d,{title:"JavaScript multi-line example",children:e.jsx(t,{text:p,language:"javascript"})}),a=()=>e.jsx(d,{title:"Show line numbers",children:e.jsx(t,{text:p,language:"javascript",showLineNumbers:!0})}),s=()=>e.jsxs(d,{title:"Overflow",children:[e.jsx("div",{style:c,children:e.jsx(t,{text:p,language:"javascript"})}),e.jsx("div",{style:c,children:e.jsx(t,{text:p,language:"javascript",showLineNumbers:!0})})]}),n=()=>e.jsxs(d,{title:"Multiple languages",children:[e.jsx(t,{text:p,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:l,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:m,language:"python",showLineNumbers:!0})]}),i=()=>e.jsx(d,{title:"Copy Code",children:e.jsx(t,{text:p,language:"javascript",showCopyCodeButton:!0})});r.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};a.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};s.__docgenInfo={description:"",methods:[],displayName:"Overflow"};n.__docgenInfo={description:"",methods:[],displayName:"Languages"};i.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>
);
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const MultipleLines = () => (
  <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>
);
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const LineNumbers = () => (
  <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>
);
`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Overflow = () => (
  <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>
);
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Languages = () => (
  <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>
);
`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const CopyCode = () => (
  <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>
);
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...i.parameters?.docs?.source}}};const ee=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{i as CopyCode,r as Default,n as Languages,a as LineNumbers,o as MultipleLines,s as Overflow,ee as __namedExportsOrder,$ as default};
