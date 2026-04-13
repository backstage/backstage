import{j as e}from"./iframe-v7Qh39PS.js";import{C as t}from"./CodeSnippet-D0HCGu2u.js";import{I as o}from"./InfoCard-D2FDE8XK.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DXZBhROx.js";import"./styled-BwMArDgT.js";import"./CopyTextButton-BS4z7_Ar.js";import"./useCopyToClipboard-BGXliAh_.js";import"./useMountedState-B1L7ZtKY.js";import"./Tooltip-DfWrtCLA.js";import"./Popper-DLRR1cRg.js";import"./Portal-GMu86kgZ.js";import"./index-B0lXpw7A.js";import"./CardContent-BSgEmeON.js";import"./ErrorBoundary-D__HOV0m.js";import"./ErrorPanel-BUErKsp_.js";import"./WarningPanel-BpTsYYgl.js";import"./ExpandMore-CojGXmQl.js";import"./AccordionDetails-BRINvrzF.js";import"./index-B9sM2jn7.js";import"./Collapse-DHnL6Jrd.js";import"./MarkdownContent-C8vaRnvo.js";import"./makeStyles-DymchkiN.js";import"./Link-C_cLMUQT.js";import"./lodash-Djj2Rbh9.js";import"./useAnalytics-C6qawMj-.js";import"./useApp-BPx4QKeD.js";import"./Grid-CVRWW0PN.js";import"./List-xof-D_2B.js";import"./ListContext-DDzxA-kC.js";import"./ListItem-Dah0XUNP.js";import"./ListItemText-wNXBjsZ9.js";import"./LinkButton-yBHYGYwt.js";import"./Button-BsIYWZbj.js";import"./CardHeader-Cl63UQwV.js";import"./Divider-Bo3do-UZ.js";import"./CardActions-BaD8b8Ti.js";import"./BottomLink-Dlby3lSZ.js";import"./ArrowForward-eDGe6SHn.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
