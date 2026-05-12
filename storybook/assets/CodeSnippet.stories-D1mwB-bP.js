import{j as e}from"./iframe-nLmXqEf7.js";import{C as t}from"./CodeSnippet-mo9ifJNj.js";import{I as o}from"./InfoCard-BJnglrpB.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CyQmjUfD.js";import"./styled-Wwm-Ry3k.js";import"./CopyTextButton-qfi-W9IP.js";import"./useCopyToClipboard-D1QusNC-.js";import"./useMountedState--VHycxnE.js";import"./Tooltip-B2Qas7pH.js";import"./Popper-Cxd_FbSD.js";import"./Portal-v2HYj7Sb.js";import"./index-BfzHIfnW.js";import"./CardContent-r2vXP33n.js";import"./ErrorBoundary-E0Ht3AeM.js";import"./ErrorPanel-ChwmzaN1.js";import"./WarningPanel-DOLTTqM1.js";import"./ExpandMore-B5zrSqHS.js";import"./AccordionDetails-BgO_FMaB.js";import"./index-B9sM2jn7.js";import"./Collapse-ZnPRc3O1.js";import"./MarkdownContent-tMO6J2Hk.js";import"./makeStyles-CuMWFimH.js";import"./Link-CmMZkdgv.js";import"./lodash-BuFazukY.js";import"./useAnalytics-BnxG_la1.js";import"./useApp-CRwfijY3.js";import"./Grid-DKuUeREw.js";import"./List-BIXTwaa6.js";import"./ListContext-C3nHO3D2.js";import"./ListItem-CNdv-BZq.js";import"./ListItemText-BG6mPEbD.js";import"./LinkButton-8k1O4g5o.js";import"./Button-BiqvEuEh.js";import"./CardHeader-UrYOK84q.js";import"./Divider-tRVzH__u.js";import"./CardActions-CN3l0Qkb.js";import"./BottomLink-CVlnAgNW.js";import"./ArrowForward-DcRQcpHM.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
