import{j as e}from"./iframe-D7zjeBit.js";import{C as t}from"./CodeSnippet-hV1f9Dn9.js";import{I as o}from"./InfoCard-D-UcqY_Q.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-eqPq7tDA.js";import"./styled-Cto7NXi2.js";import"./CopyTextButton-Z9HYJ3cw.js";import"./useCopyToClipboard-CckL3d_D.js";import"./useMountedState-kWf6Idih.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";import"./Portal-B4c0pg-w.js";import"./index-B9TfV-iv.js";import"./CardContent-DUYLO-L9.js";import"./ErrorBoundary-B18IWFAM.js";import"./ErrorPanel-D3lennx9.js";import"./WarningPanel-CcoG20un.js";import"./ExpandMore-CHCoKjrA.js";import"./AccordionDetails-yQUU3RTP.js";import"./index-B9sM2jn7.js";import"./Collapse-CIrQlr20.js";import"./MarkdownContent-DiO1cZeN.js";import"./makeStyles-BdLugvEp.js";import"./Link-43gYvX88.js";import"./lodash-CaiQO1ZN.js";import"./useAnalytics-CJoDpLKX.js";import"./useApp-CAJtRMT4.js";import"./Grid-BwBMybgh.js";import"./List-_IcS7A5z.js";import"./ListContext-338I8pjt.js";import"./ListItem-PR8H70fv.js";import"./ListItemText-vMMeAjTD.js";import"./LinkButton-BdKY_E5f.js";import"./Button-C2qUSh9P.js";import"./CardHeader-CQK2Zg52.js";import"./Divider-B8mQbTru.js";import"./CardActions-ED_hinHC.js";import"./BottomLink-DaxSbSCF.js";import"./ArrowForward-CiBVcspR.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
