import{bR as e}from"./iframe-BoHeIN98.js";import{C as t}from"./CodeSnippet-3xzrq7ws.js";import{I as o}from"./InfoCard-BicUbKVD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DhR05N1l.js";import"./CardContent-DUUBuFfy.js";import"./ErrorBoundary-DJZ-CONr.js";import"./ErrorPanel-BD6ZWBx3.js";import"./WarningPanel-D5gLREAr.js";import"./ExpandMore-DCkKE7p8.js";import"./AccordionDetails-bGXmrZkh.js";import"./index-B9sM2jn7.js";import"./Collapse-h_NMVjtC.js";import"./MarkdownContent-B5s0VngN.js";import"./makeStyles-ChrV0xkl.js";import"./Link-1dowOUr1.js";import"./lodash-BtO-qHMp.js";import"./useAnalytics-Dx-eH7bg.js";import"./useApp-CgoYxTWd.js";import"./Grid-Vi-QfLwX.js";import"./List-2zDM7bk8.js";import"./ListContext-D1hfzYAi.js";import"./ListItem-j6ZpAh7t.js";import"./ListItemText-B8qu921C.js";import"./CopyTextButton-DEIo5_IO.js";import"./useCopyToClipboard-DawLmkoZ.js";import"./useMountedState-B0_hTaNv.js";import"./Tooltip-Bsc8dTPW.js";import"./Popper-F8TWKpZp.js";import"./Portal-HQ-CMin5.js";import"./LinkButton-1Sx4ddZf.js";import"./Button-BDWSdStw.js";import"./CardHeader-Bg6KM4Zr.js";import"./Divider-B9CDCtk4.js";import"./CardActions-B-tPp6be.js";import"./BottomLink-BwOylqku.js";import"./ArrowForward-NzPz-dvf.js";import"./Box-S5ZWPiRH.js";import"./styled-gfsms5P7.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
