import{bR as e}from"./iframe-hQz1Bovf.js";import{C as t}from"./CodeSnippet-DZEoL2eY.js";import{I as o}from"./InfoCard-Du4lMEhA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-tlBBGTW_.js";import"./CardContent-BeSrsLxZ.js";import"./ErrorBoundary-CIRZVXR1.js";import"./ErrorPanel-C9NtZi6r.js";import"./WarningPanel-EdrGZVs0.js";import"./ExpandMore-Cxdbkgw6.js";import"./AccordionDetails-B6N32r7a.js";import"./index-B9sM2jn7.js";import"./Collapse-DtRwyC7m.js";import"./MarkdownContent-bRZBSpSh.js";import"./makeStyles-CRkWSsAX.js";import"./Link-Bcq4-4Is.js";import"./lodash-BeTb6-To.js";import"./useAnalytics-1xUyB9Hg.js";import"./useApp-CNSTaFkm.js";import"./Grid-BHtxnF4E.js";import"./List-Czan3J2f.js";import"./ListContext-Dkj8oSFA.js";import"./ListItem-Cj74SqHm.js";import"./ListItemText-DkoBDy6-.js";import"./CopyTextButton-BuvWXcdK.js";import"./useCopyToClipboard-fpXyZL8l.js";import"./useMountedState-C3piaHue.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";import"./Portal-CPzfTq6t.js";import"./LinkButton-ssYwmTn3.js";import"./Button-CfoRjWz_.js";import"./CardHeader-BkkfDLMW.js";import"./Divider-DiKZVb6z.js";import"./CardActions-CbbBY3VU.js";import"./BottomLink-BZCQ8dht.js";import"./ArrowForward-YyAeGU7-.js";import"./Box-CFfSeaSI.js";import"./styled-DjRvED2X.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
