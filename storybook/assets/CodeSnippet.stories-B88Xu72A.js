import{j as e}from"./iframe-BplO06yy.js";import{C as t}from"./CodeSnippet-8K-OWRcS.js";import{I as d}from"./InfoCard-DOfYCD2_.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-NknjwhwY.js";import"./styled-BRp8APBl.js";import"./CopyTextButton-BXdH_Mex.js";import"./useCopyToClipboard-DkMn04rE.js";import"./useMountedState-CjXeUMpc.js";import"./Tooltip-jADLXplJ.js";import"./Popper-Bzo90_V1.js";import"./Portal-Ax05yPmo.js";import"./index-BViUYk_j.js";import"./makeStyles-hxoXH1CF.js";import"./CardContent-DwrD-Nu2.js";import"./ErrorBoundary-AbJJh0TC.js";import"./ErrorPanel-O0u1Wz4N.js";import"./WarningPanel-BwTtnGkf.js";import"./ExpandMore-BcJaZxd5.js";import"./AccordionDetails-BKmhvlN_.js";import"./index-B9sM2jn7.js";import"./Collapse-DOaJRWW2.js";import"./MarkdownContent-xJlcnECw.js";import"./Grid-C0SXy4wX.js";import"./List-xC3JEtnt.js";import"./ListContext-TNzuz18n.js";import"./ListItem-CjMmncm8.js";import"./ListItemText-BsX_35MI.js";import"./LinkButton-p7bX8KcW.js";import"./Link-nS41TX38.js";import"./lodash-Bx2jcK7O.js";import"./index-BquTymTZ.js";import"./useAnalytics-yuQdOfMk.js";import"./useApp-Clg36dJH.js";import"./Button-C6usRRIL.js";import"./CardHeader-kLhGdI-q.js";import"./Divider-DQ_NQG7A.js";import"./CardActions-CryBLWkY.js";import"./BottomLink-C2wsCCRY.js";import"./ArrowForward-Bgqks8mi.js";const $={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},c={width:300},p=`const greeting = "Hello";
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
