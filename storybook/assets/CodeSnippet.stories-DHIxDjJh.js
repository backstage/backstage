import{j as e}from"./iframe-UdCk74ed.js";import{C as t}from"./CodeSnippet-XL-2vNKw.js";import{I as o}from"./InfoCard-DI44OEkH.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-sbiym-y5.js";import"./styled-BN87Jrul.js";import"./CopyTextButton-tqLqfB6x.js";import"./useCopyToClipboard-ByNVH3g5.js";import"./useMountedState-7chJbMUP.js";import"./Tooltip-BMMZ8usS.js";import"./Popper-Ds0Kdlca.js";import"./Portal-B_bZnr3n.js";import"./index-BZAuc_Yo.js";import"./CardContent-BGOCWttV.js";import"./ErrorBoundary-DkgJpuoW.js";import"./ErrorPanel-BmaaGwBt.js";import"./WarningPanel-C960RCQm.js";import"./ExpandMore-DwTkoc5e.js";import"./AccordionDetails-DsLxbANW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dq_oeJyM.js";import"./MarkdownContent-ULNUBQMW.js";import"./makeStyles-EOk-SryI.js";import"./Link-DW5yfdOI.js";import"./lodash-BPf5Z96Y.js";import"./useAnalytics-DsUIDtns.js";import"./useApp-CPPq470-.js";import"./Grid-DwqHvQ9E.js";import"./List-CFWP97D4.js";import"./ListContext-C8Zyt_3h.js";import"./ListItem-D0ITxQe3.js";import"./ListItemText-C5Zs7Dtn.js";import"./LinkButton-DHK33X9c.js";import"./Button-CF71Je-k.js";import"./CardHeader-BqGwCv7f.js";import"./Divider-CtW3oCa7.js";import"./CardActions-B3UkR6NV.js";import"./BottomLink-DDwWBdEi.js";import"./ArrowForward-BppNCfBW.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`,m=`const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`,c=`greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`,s=()=>e.jsx(o,{title:"JavaScript example",children:e.jsx(t,{text:"const hello = 'World';",language:"javascript"})}),a=()=>e.jsx(o,{title:"JavaScript multi-line example",children:e.jsx(t,{text:r,language:"javascript"})}),i=()=>e.jsx(o,{title:"Show line numbers",children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})}),n=()=>e.jsxs(o,{title:"Overflow",children:[e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript"})}),e.jsx("div",{style:d,children:e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0})})]}),p=()=>e.jsxs(o,{title:"Multiple languages",children:[e.jsx(t,{text:r,language:"javascript",showLineNumbers:!0}),e.jsx(t,{text:m,language:"typescript",showLineNumbers:!0}),e.jsx(t,{text:c,language:"python",showLineNumbers:!0})]}),l=()=>e.jsx(o,{title:"Copy Code",children:e.jsx(t,{text:r,language:"javascript",showCopyCodeButton:!0})});s.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"MultipleLines"};i.__docgenInfo={description:"",methods:[],displayName:"LineNumbers"};n.__docgenInfo={description:"",methods:[],displayName:"Overflow"};p.__docgenInfo={description:"",methods:[],displayName:"Languages"};l.__docgenInfo={description:"",methods:[],displayName:"CopyCode"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript example">
    <CodeSnippet text="const hello = 'World';" language="javascript" />
  </InfoCard>`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <InfoCard title="JavaScript multi-line example">
    <CodeSnippet text={JAVASCRIPT} language="javascript" />
  </InfoCard>`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => <InfoCard title="Show line numbers">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
  </InfoCard>`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <InfoCard title="Overflow">
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </InfoCard>`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => <InfoCard title="Multiple languages">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </InfoCard>`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => <InfoCard title="Copy Code">
    <CodeSnippet text={JAVASCRIPT} language="javascript" showCopyCodeButton />
  </InfoCard>`,...l.parameters?.docs?.source}}};const $=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,$ as __namedExportsOrder,Z as default};
