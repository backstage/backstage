import{j as e}from"./iframe-DXt6I_1q.js";import{C as t}from"./CodeSnippet-CItDkStU.js";import{I as o}from"./InfoCard-CZWzg546.js";import"./preload-helper-D9Z9MdNV.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./CopyTextButton-BSjmWnC0.js";import"./useCopyToClipboard-BoyifASt.js";import"./useMountedState-BEJ2TW9Z.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";import"./Portal-DOTL7Yad.js";import"./CardContent-BwUEUqdM.js";import"./ErrorBoundary-Dn7kNKcq.js";import"./ErrorPanel-B33pLPVR.js";import"./WarningPanel-DQn25WOa.js";import"./ExpandMore-CSLlRCsy.js";import"./AccordionDetails-BnUWlxaJ.js";import"./index-DnL3XN75.js";import"./Collapse-DtNym6qB.js";import"./MarkdownContent-BXxoLhhS.js";import"./Grid-S6xSP1g4.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./ListItem-CNHhXRSS.js";import"./ListItemText-CaGb_JPi.js";import"./LinkButton-rg2HdNk0.js";import"./Button-Bqv3NR6y.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./index-kCs7zF-O.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./CardHeader-Cc8WUsGZ.js";import"./Divider-rqAQKIY3.js";import"./CardActions-DQw2Z0X8.js";import"./BottomLink--V4SW3M9.js";import"./ArrowForward-CdPzQ0qE.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
  </InfoCard>`,...l.parameters?.docs?.source}}};const Z=["Default","MultipleLines","LineNumbers","Overflow","Languages","CopyCode"];export{l as CopyCode,s as Default,p as Languages,i as LineNumbers,a as MultipleLines,n as Overflow,Z as __namedExportsOrder,X as default};
