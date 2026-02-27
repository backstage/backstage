import{j as e}from"./iframe-DBRGxMDW.js";import{C as t}from"./CodeSnippet-CAZt93aq.js";import{I as d}from"./InfoCard-BEKqNjrv.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CntJUP1x.js";import"./styled-BtxC7hTc.js";import"./CopyTextButton-ClL_MRRy.js";import"./useCopyToClipboard-CSzcS2W-.js";import"./useMountedState-B06bP6zn.js";import"./Tooltip-DE5RCm9h.js";import"./Popper-BGeENWN1.js";import"./Portal-DK6syPsc.js";import"./index-DeG_piPF.js";import"./makeStyles-ByaqqE0C.js";import"./CardContent-C7ZMqpeb.js";import"./ErrorBoundary-DM-eguP7.js";import"./ErrorPanel-B6C3U4LZ.js";import"./WarningPanel-BMIQ5GyE.js";import"./ExpandMore-BJVel_cX.js";import"./AccordionDetails-B05jq2YI.js";import"./index-B9sM2jn7.js";import"./Collapse-DdFfCEeX.js";import"./MarkdownContent-CzuJJ67p.js";import"./Grid-DUgNNeQ8.js";import"./List-Dwh_b94U.js";import"./ListContext-GpQvqqGL.js";import"./ListItem-DtNY3IdH.js";import"./ListItemText-5EBnSTxE.js";import"./LinkButton-CVdZCYuT.js";import"./Link-YCp9P7xP.js";import"./lodash-WiBjX-DP.js";import"./index-DxdJ_Qst.js";import"./useAnalytics-D5q7uOOi.js";import"./useApp-CcMjJuGU.js";import"./Button-DpQO2War.js";import"./CardHeader-bEwFoQzb.js";import"./Divider-C3R9iOnK.js";import"./CardActions-BXhlWE4K.js";import"./BottomLink-C5_VtbvD.js";import"./ArrowForward-CdO8vXV_.js";const $={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},c={width:300},p=`const greeting = "Hello";
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
