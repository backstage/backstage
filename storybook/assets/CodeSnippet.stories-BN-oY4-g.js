import{j as e}from"./iframe-V0mCSmm6.js";import{C as t}from"./CodeSnippet-DND1j3mO.js";import{I as o}from"./InfoCard-Bax6Bk1e.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-BQ6A2zHk.js";import"./styled-jbaTKMHC.js";import"./CopyTextButton-DU42pp83.js";import"./useCopyToClipboard-C2Z7cgqI.js";import"./useMountedState-C0Jd0rHY.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";import"./Portal-CVJVAyEW.js";import"./index-BftmwaLS.js";import"./CardContent-DiPjkq-q.js";import"./ErrorBoundary-focw1xVI.js";import"./ErrorPanel-DKqsc9IJ.js";import"./WarningPanel-Ccz4x3xp.js";import"./ExpandMore-CbnyxO-3.js";import"./AccordionDetails-I2vjSAo4.js";import"./index-B9sM2jn7.js";import"./Collapse-B0zJCXOI.js";import"./MarkdownContent-BpLNTF6C.js";import"./makeStyles-C-ZAQBJP.js";import"./Link-C8jjCA1D.js";import"./lodash-DiH-Fmp9.js";import"./useAnalytics-DfdyZRyp.js";import"./useApp-BhakDC8j.js";import"./Grid-B05O9SBT.js";import"./List-DoUtMqL3.js";import"./ListContext-B-_4E_oo.js";import"./ListItem-UEfIFqBO.js";import"./ListItemText-DAqxhx2l.js";import"./LinkButton-CxYLbWoR.js";import"./Button-eipEU8xc.js";import"./CardHeader-H3axCj22.js";import"./Divider-CiNTCJQO.js";import"./CardActions-CpK5l8CS.js";import"./BottomLink-ChFwcdj9.js";import"./ArrowForward-9xMh-p1h.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
