import{bR as e}from"./iframe-NUkawwzR.js";import{C as t}from"./CodeSnippet-CAX0hgGz.js";import{I as o}from"./InfoCard-BA8NwL9o.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DGio2NzG.js";import"./CardContent-lIDQSBLo.js";import"./ErrorBoundary-36MXOj2J.js";import"./ErrorPanel-BznrtWfF.js";import"./WarningPanel-DpN0Gemn.js";import"./ExpandMore-Dy63TlFt.js";import"./AccordionDetails-0bwbjF9s.js";import"./index-B9sM2jn7.js";import"./Collapse-P9G19jA8.js";import"./MarkdownContent-CKh6xxq9.js";import"./makeStyles-CNV3hMKY.js";import"./Link-B2W3RHwT.js";import"./lodash-BZMNBUXh.js";import"./useAnalytics-D_vtRMir.js";import"./useApp-C-T9q94R.js";import"./Grid-CTlAuf7X.js";import"./List-B-MMhnOL.js";import"./ListContext-MI5-zAg3.js";import"./ListItem-B_oYa0lB.js";import"./ListItemText-Cc9q0K8Y.js";import"./CopyTextButton-Dy069yQl.js";import"./useCopyToClipboard-BhSwuLby.js";import"./useMountedState-C9EMhPTC.js";import"./Tooltip-CdpWTf1d.js";import"./Popper-BHCCzf0k.js";import"./Portal-BgDfH8Z8.js";import"./LinkButton-Csh_gKQe.js";import"./Button-CdpMcnou.js";import"./CardHeader-DMUmDycV.js";import"./Divider-D6wa_gko.js";import"./CardActions-D33PHKcN.js";import"./BottomLink-Bd_Grg1f.js";import"./ArrowForward-De2x7LP0.js";import"./Box-uNF0ND2L.js";import"./styled-CoNMgIxM.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
