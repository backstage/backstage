import{bR as e}from"./iframe-DogXi1kP.js";import{C as t}from"./CodeSnippet-Cxnl8e6a.js";import{I as o}from"./InfoCard-DFX1mRRw.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CJxb0nPe.js";import"./styled-LVo_tic8.js";import"./CopyTextButton-B4c5NjmN.js";import"./useCopyToClipboard-D2g3QE10.js";import"./useMountedState-38Jpwyxf.js";import"./Tooltip-D0UbP4zj.js";import"./Popper-C6PO9pUv.js";import"./Portal-DKOM2ljc.js";import"./index-DefuoSXt.js";import"./CardContent-CamvdE2V.js";import"./ErrorBoundary-BQPUHMJ9.js";import"./ErrorPanel-g9EGRzWu.js";import"./WarningPanel-D8YKjzYX.js";import"./ExpandMore-8mGuFyUv.js";import"./AccordionDetails-BqX1TRD1.js";import"./index-B9sM2jn7.js";import"./Collapse-CE6sSAsi.js";import"./MarkdownContent-CqaUVnqp.js";import"./makeStyles-Bkm64Dpi.js";import"./Link-WtjewFfs.js";import"./lodash-Bl4KCeDg.js";import"./useAnalytics-DWMKXBU9.js";import"./useApp-C6xgnwsj.js";import"./Grid-D3we3n6C.js";import"./List-DYZA-_Cd.js";import"./ListContext-BOh0ZZsa.js";import"./ListItem-BXUM3Mts.js";import"./ListItemText-BazddgN4.js";import"./LinkButton-eZ5Pb0SU.js";import"./Button-BuZHMRa1.js";import"./CardHeader-Bn0dWdXc.js";import"./Divider-DKbM6I94.js";import"./CardActions-Cvzu_Z4t.js";import"./BottomLink-ClyIcm-O.js";import"./ArrowForward-DIiPbxIi.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
