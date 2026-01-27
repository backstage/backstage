import{j as e}from"./iframe-DEXNC9RX.js";import{C as t}from"./CodeSnippet-D4GvPAYc.js";import{I as d}from"./InfoCard-BW4VKxa5.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./CopyTextButton-DdSDl_l7.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./useMountedState-DIp_Aeij.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./Portal-O6zOHTQ9.js";import"./CardContent-Dv0KIfNv.js";import"./ErrorBoundary-BM8aEPeZ.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./ExpandMore-Df24YjII.js";import"./AccordionDetails-K4eNqGeL.js";import"./index-B9sM2jn7.js";import"./Collapse-DklbiL-j.js";import"./MarkdownContent-yMYvzVpl.js";import"./Grid-DwntcsAr.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./ListItem-BsFeXcoa.js";import"./ListItemText-SZBW9x2i.js";import"./LinkButton-CVg2ID4w.js";import"./Button-F3mebnqD.js";import"./Link-7jnzHmir.js";import"./lodash-Czox7iJy.js";import"./index-BlCxWptt.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./CardHeader-D25g89XU.js";import"./Divider-DNnZbvf9.js";import"./CardActions-BRmKXnBD.js";import"./BottomLink-Bps-KGLO.js";import"./ArrowForward-epoaBmEz.js";const X={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},c={width:300},p=`const greeting = "Hello";
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
  </InfoCard>`,...i.parameters?.docs?.source}}};const Z=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{i as CopyCode,r as Default,n as Languages,a as LineNumbers,o as MultipleLines,s as Overflow,Z as __namedExportsOrder,X as default};
