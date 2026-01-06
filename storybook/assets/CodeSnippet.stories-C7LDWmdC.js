import{j as e}from"./iframe-DgkzaRcz.js";import{C as t}from"./CodeSnippet-qrWrlZ1D.js";import{I as o}from"./InfoCard-DroCXsE2.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./useMountedState-C4ChfPSk.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./Portal-DiyW3rHr.js";import"./CardContent-BEcXzYfT.js";import"./ErrorBoundary-BMyytlZG.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./index-B9sM2jn7.js";import"./Collapse-zjOOSLQm.js";import"./MarkdownContent-B2WHC1-q.js";import"./Grid-13HvIHxd.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./ListItemText-BTjp8q3D.js";import"./LinkButton-Cj7uwqzc.js";import"./Button-DputNV-f.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./index-BovWTFKo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./CardHeader-BIR3esA0.js";import"./Divider-BsgTAdRC.js";import"./CardActions-VTkMzbqT.js";import"./BottomLink-DudYzn0u.js";import"./ArrowForward-Df-EQyM5.js";const X={title:"Data Display/CodeSnippet",component:t},d={width:300},r=`const greeting = "Hello";
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
