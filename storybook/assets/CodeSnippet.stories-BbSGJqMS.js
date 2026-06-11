import{bR as e}from"./iframe-BNSLO1vV.js";import{C as t}from"./CodeSnippet-CVrHcUGI.js";import{I as o}from"./InfoCard-ByKMFe16.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C8wTAkbr.js";import"./CardContent-Ba3pQ689.js";import"./ErrorBoundary-8UVK-f-2.js";import"./ErrorPanel-aHrobAaO.js";import"./WarningPanel-BNZzBLor.js";import"./ExpandMore-CPyaxJI3.js";import"./AccordionDetails-BE2BfFWF.js";import"./index-B9sM2jn7.js";import"./Collapse-CdGjPTi6.js";import"./MarkdownContent-wl8ON4O6.js";import"./makeStyles-CZnQSWDh.js";import"./Link-K3MkQ3D3.js";import"./lodash-CaDdG74r.js";import"./useAnalytics-CeiKLkx8.js";import"./useApp-CMrJz5U2.js";import"./Grid-C9Nu3WVI.js";import"./List-BFUn9Abz.js";import"./ListContext-gUlqcjcC.js";import"./ListItem-D39zADcQ.js";import"./ListItemText-CEe2QXcK.js";import"./CopyTextButton-CXVDPBul.js";import"./useCopyToClipboard-78lqQjz0.js";import"./useMountedState-C8SUUxYo.js";import"./Tooltip-BJEELWEm.js";import"./Popper-hi3NpXOV.js";import"./Portal-CJWU_qpN.js";import"./LinkButton-C_D9f_1i.js";import"./Button-CxhMyqTz.js";import"./CardHeader-D4NHuX2y.js";import"./Divider-BZnZb-VC.js";import"./CardActions-CDloGMEv.js";import"./BottomLink-CXGdLd-2.js";import"./ArrowForward-BWDyI-Yp.js";import"./Box-CUryh8iW.js";import"./styled-X4ZADqyc.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
