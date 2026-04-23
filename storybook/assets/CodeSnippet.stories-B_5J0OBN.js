import{j as e}from"./iframe-D4ojcRBn.js";import{C as t}from"./CodeSnippet-jM5cvvbc.js";import{I as o}from"./InfoCard-9ELF0fSG.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-laszcGHL.js";import"./styled-DZLwQIlI.js";import"./CopyTextButton-CeIJGoRH.js";import"./useCopyToClipboard-DKzr7rta.js";import"./useMountedState-Dd8_3eVW.js";import"./Tooltip-CrYI3p8-.js";import"./Popper-CS4j-s-3.js";import"./Portal-CTav-3Kk.js";import"./index-DW-rjBCk.js";import"./CardContent-DrqKOu_D.js";import"./ErrorBoundary-tCPMqppq.js";import"./ErrorPanel-CYxdwLAi.js";import"./WarningPanel-DdSVSS0t.js";import"./ExpandMore-VVYq8_kD.js";import"./AccordionDetails-C_SvNiGJ.js";import"./index-B9sM2jn7.js";import"./Collapse-DFs2mBo2.js";import"./MarkdownContent-DKcQcqUM.js";import"./makeStyles-Cl-w1ABh.js";import"./Link-BY--rZrj.js";import"./lodash-B6rdiaVd.js";import"./useAnalytics-09trSmCC.js";import"./useApp-D8s9Wbol.js";import"./Grid-DTyJ7xkb.js";import"./List-F0S5B9Dv.js";import"./ListContext-S6LlGKy0.js";import"./ListItem-B4NcQ-mY.js";import"./ListItemText-DqjEjuKL.js";import"./LinkButton-DnOw0TOq.js";import"./Button-CfkeaZjm.js";import"./CardHeader-fEeRqnlQ.js";import"./Divider-DPJDNd0s.js";import"./CardActions-Bfs51Nwv.js";import"./BottomLink-C_GSRv4m.js";import"./ArrowForward-B7bJrHLO.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
