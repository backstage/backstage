import{j as e}from"./iframe-BCuiGO18.js";import{C as t}from"./CodeSnippet-BfJZpbWM.js";import{I as o}from"./InfoCard-BgibfPcc.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-DF0subjV.js";import"./styled-n3Xk8m2M.js";import"./CopyTextButton-Cw35R9dI.js";import"./useCopyToClipboard-CwAb5EaD.js";import"./useMountedState-HGb4mU5a.js";import"./Tooltip-C0suzQKt.js";import"./Popper-nJ1Os4sA.js";import"./Portal-Bdh2rISL.js";import"./index-BOxQOO6X.js";import"./CardContent-B16q1N16.js";import"./ErrorBoundary-sZ2Uof5K.js";import"./ErrorPanel-BnBbbale.js";import"./WarningPanel-B696fEmr.js";import"./ExpandMore-Yv_q-kXu.js";import"./AccordionDetails-kOY2jM_p.js";import"./index-B9sM2jn7.js";import"./Collapse-rzCTC0c6.js";import"./MarkdownContent-D8ld7Hxa.js";import"./makeStyles-BiC0-IRq.js";import"./Link-D8nUG02y.js";import"./lodash-LxfdXjj1.js";import"./useAnalytics-CLav7vMM.js";import"./useApp-57KoDWVG.js";import"./Grid-ks1F9Ab_.js";import"./List-DYKyo639.js";import"./ListContext-DefbUR_f.js";import"./ListItem-D5tv8MX2.js";import"./ListItemText-BF4AZnbO.js";import"./LinkButton-DTbOt1uy.js";import"./Button-BPWtWLHv.js";import"./CardHeader-P2reYBqc.js";import"./Divider-DQRcUmcz.js";import"./CardActions-9oBrA6_s.js";import"./BottomLink-CEFHn5TT.js";import"./ArrowForward-Tftkqjq7.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
