import{j as e}from"./iframe-CsCfxPn_.js";import{C as t}from"./CodeSnippet-D-7-vDxV.js";import{I as o}from"./InfoCard-CjqqZxrQ.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-B59PrcF8.js";import"./styled-BhaEuEq4.js";import"./CopyTextButton-Dz_soge8.js";import"./useCopyToClipboard-Cqod-UND.js";import"./useMountedState-BfmURTRU.js";import"./Tooltip-DGsNX3s4.js";import"./Popper-CCu5RvlF.js";import"./Portal-Mjfg2QfE.js";import"./index-BnA6fLC5.js";import"./CardContent-qTrC9ggm.js";import"./ErrorBoundary-NtJNc7yi.js";import"./ErrorPanel-DytSTv92.js";import"./WarningPanel-DOkLgdmd.js";import"./ExpandMore-B9sgAbKb.js";import"./AccordionDetails-BQZ4KF5G.js";import"./index-B9sM2jn7.js";import"./Collapse-C8jxEJfU.js";import"./MarkdownContent-Cr-4rCA9.js";import"./makeStyles-Cyq7q47K.js";import"./Link-BZkyGUYJ.js";import"./lodash-CbHAjvV7.js";import"./useAnalytics-w4gYjMWf.js";import"./useApp-C_ncuDBH.js";import"./Grid-BYa8idma.js";import"./List-BOkqMN_K.js";import"./ListContext-COVYUNkn.js";import"./ListItem-DLLda7RJ.js";import"./ListItemText-Bb_WjaoQ.js";import"./LinkButton-BGSMmaws.js";import"./Button-Cne4OJP9.js";import"./CardHeader-BH5__z6p.js";import"./Divider-ENESGlaF.js";import"./CardActions-eQioCrlD.js";import"./BottomLink-CTthGQJK.js";import"./ArrowForward-DSCf3QB5.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
