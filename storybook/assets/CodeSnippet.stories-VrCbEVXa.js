import{j as e}from"./iframe-BZbCHoUM.js";import{C as t}from"./CodeSnippet-TtQaWekH.js";import{I as o}from"./InfoCard-2nvTQZnc.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DY6-eBkT.js";import"./styled-DCK0eGG-.js";import"./CopyTextButton-C5lMDgwt.js";import"./useCopyToClipboard-BynW4vbA.js";import"./useMountedState-DDoOMb-K.js";import"./Tooltip-CdMmLUhb.js";import"./Popper-DDFF7RGu.js";import"./Portal-ByyC8-qY.js";import"./index-CkvjDYOq.js";import"./CardContent-LyXQ4KFr.js";import"./ErrorBoundary-DE_qYcmK.js";import"./ErrorPanel-BO4erbiK.js";import"./WarningPanel-CMI-KGkp.js";import"./ExpandMore-BK4RBO6u.js";import"./AccordionDetails-IcArkn8N.js";import"./index-B9sM2jn7.js";import"./Collapse-O7kbB5jx.js";import"./MarkdownContent-6KVzm0dh.js";import"./makeStyles-CqvbDVNY.js";import"./Link-BTIv8AuK.js";import"./lodash-ztOqvY5v.js";import"./useAnalytics-CRERthYg.js";import"./useApp-gzInJQTH.js";import"./Grid-MM8AuGcB.js";import"./List-CodZ-AVF.js";import"./ListContext-CbM2lO0s.js";import"./ListItem-CUvfBfLi.js";import"./ListItemText-B1g8sngL.js";import"./LinkButton-B_47egYI.js";import"./Button-DVx3XNhs.js";import"./CardHeader-qXdQTB7F.js";import"./Divider-BEwpmjmh.js";import"./CardActions-B-v1uy85.js";import"./BottomLink-iHM85zn3.js";import"./ArrowForward-EBA7ug1C.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
