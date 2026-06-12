import{bR as e}from"./iframe-DHsLdmE0.js";import{C as t}from"./CodeSnippet-ePBAhbqp.js";import{I as o}from"./InfoCard-Dy-xLs8V.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BNHqqOoN.js";import"./CardContent-C-fcc4bB.js";import"./ErrorBoundary-COMONFQ9.js";import"./ErrorPanel-C2_EagHd.js";import"./WarningPanel-BBn2Uzyn.js";import"./ExpandMore-sKTXOyK1.js";import"./AccordionDetails-TXK-pMhz.js";import"./index-B9sM2jn7.js";import"./Collapse-PCg3OWJV.js";import"./MarkdownContent-6SmyqThE.js";import"./makeStyles-Dzpfwqkv.js";import"./Link-KwMtLRIs.js";import"./lodash-C10OX6Vn.js";import"./useAnalytics-D5-Jfhzg.js";import"./useApp-CQ9I6Gkh.js";import"./Grid-DxJtb9e-.js";import"./List-DBJidFSb.js";import"./ListContext-Hnsssjg3.js";import"./ListItem-DFCYyHsM.js";import"./ListItemText-gNBvMhel.js";import"./CopyTextButton-yQ2bxetq.js";import"./useCopyToClipboard-CfXsIPBL.js";import"./useMountedState-BgzSvwJR.js";import"./Tooltip-enjgkI7H.js";import"./Popper-C2XBrDYl.js";import"./Portal-DByf1mCb.js";import"./LinkButton-BAQOl9iY.js";import"./Button-7Jcw9qqA.js";import"./CardHeader-DurgkIyf.js";import"./Divider-DR7epxNF.js";import"./CardActions-CLA7W5AN.js";import"./BottomLink-pkUjoHiS.js";import"./ArrowForward-DNCAhdwE.js";import"./Box-ynx69IFE.js";import"./styled-CT8k9EBB.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
