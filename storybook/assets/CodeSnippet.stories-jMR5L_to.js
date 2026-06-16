import{bR as e}from"./iframe-Dv_LOz74.js";import{C as t}from"./CodeSnippet-Dl7CwFPd.js";import{I as o}from"./InfoCard-CsF7Mm-W.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9AQLwBR.js";import"./CardContent-BmLBcbHK.js";import"./ErrorBoundary-Qlxeyel8.js";import"./ErrorPanel-CnSjInV_.js";import"./WarningPanel-BVXmVAtH.js";import"./ExpandMore-CiaCt4V2.js";import"./AccordionDetails-CsUP2nBW.js";import"./index-B9sM2jn7.js";import"./Collapse-DktYeogF.js";import"./MarkdownContent-zVZhZPhZ.js";import"./makeStyles-Balw57Mg.js";import"./Link-Dhqn3FRD.js";import"./lodash-D8r4FPUQ.js";import"./useAnalytics-BQ1Ntni6.js";import"./useApp-Cy2_bCrQ.js";import"./Grid-CVdaifsV.js";import"./List-DO7BjG3n.js";import"./ListContext-BQeOYvd4.js";import"./ListItem-CPDhSI3E.js";import"./ListItemText-BOUqpeRS.js";import"./CopyTextButton-B8CGcUAq.js";import"./useCopyToClipboard-Dv2aJji5.js";import"./useMountedState-DpKKYMpO.js";import"./Tooltip-DaQ1ZG1o.js";import"./Popper-BKKCXmHB.js";import"./Portal-BH6-A2cn.js";import"./LinkButton-UOTqZ424.js";import"./Button-oAoRdfUS.js";import"./CardHeader-DmOOAeuM.js";import"./Divider-CP9mJEzQ.js";import"./CardActions-Ceji7yKz.js";import"./BottomLink-DoONu6Zl.js";import"./ArrowForward-ChcfiygG.js";import"./Box-CKs0ezee.js";import"./styled-DwgY9p9o.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
