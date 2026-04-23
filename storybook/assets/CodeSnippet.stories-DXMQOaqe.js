import{j as e}from"./iframe-C8vBbMI-.js";import{C as t}from"./CodeSnippet-0NjTet8j.js";import{I as o}from"./InfoCard-DVf_5ol3.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DIT1JwxG.js";import"./styled-BcmF7aJU.js";import"./CopyTextButton-CeNYTrC1.js";import"./useCopyToClipboard-B1eZHJkf.js";import"./useMountedState-L9pPr6Rc.js";import"./Tooltip-j_b-FrAj.js";import"./Popper-BLUE86cB.js";import"./Portal-DsizZWpB.js";import"./index-NluNtBNI.js";import"./CardContent-Hdap4TtO.js";import"./ErrorBoundary-D3GhLMPm.js";import"./ErrorPanel--gZKU3Sg.js";import"./WarningPanel-CSsnlZMV.js";import"./ExpandMore-ByaxlCxC.js";import"./AccordionDetails-BnfLglm0.js";import"./index-B9sM2jn7.js";import"./Collapse-C7FCoWud.js";import"./MarkdownContent-CDHzH2rL.js";import"./makeStyles-DEhzw0UI.js";import"./Link-CaYIfEDR.js";import"./lodash-BfwZDLak.js";import"./useAnalytics-DKfC2Yhe.js";import"./useApp-Cchg7qe1.js";import"./Grid-DduoCecT.js";import"./List-B5861Df-.js";import"./ListContext-BiZJobBt.js";import"./ListItem-BfkYT0su.js";import"./ListItemText-BRoLRp27.js";import"./LinkButton-DbKbjVzE.js";import"./Button-DwUxRaKW.js";import"./CardHeader-OIuTXyuq.js";import"./Divider-C0HO5IHG.js";import"./CardActions-B9b6F_yi.js";import"./BottomLink-DGK41P_q.js";import"./ArrowForward-C4RmmrRl.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
