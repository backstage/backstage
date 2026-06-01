import{bR as e}from"./iframe-CHEWuc0v.js";import{C as t}from"./CodeSnippet-CCvE8kV-.js";import{I as o}from"./InfoCard-CRlMsw9c.js";import"./preload-helper-PPVm8Dsz.js";import"./Box-CA5r6KPw.js";import"./styled-B0xaf2Nd.js";import"./CopyTextButton-C4Na4Oiw.js";import"./useCopyToClipboard-BQ7lxDJ3.js";import"./useMountedState-omtJmy7S.js";import"./Tooltip-D_wlfMrX.js";import"./Popper-DpXbhq_0.js";import"./Portal-CXDFFVA9.js";import"./index-D8aRAqEX.js";import"./CardContent-BYjbmz35.js";import"./ErrorBoundary-CCuPXxBp.js";import"./ErrorPanel-CF_5eQEj.js";import"./WarningPanel-DW4M9vNo.js";import"./ExpandMore-BW4q8rK6.js";import"./AccordionDetails-CO5Ln29w.js";import"./index-B9sM2jn7.js";import"./Collapse--1rIDwXS.js";import"./MarkdownContent-BdSF0F5o.js";import"./makeStyles-CcHkTlxf.js";import"./Link-DiivKN7j.js";import"./lodash-WdvZzfTd.js";import"./useAnalytics-BWLaGjRK.js";import"./useApp-ezEKjyT8.js";import"./Grid-DIzjM6gG.js";import"./List-Htl-iPuO.js";import"./ListContext-Db_fj7kn.js";import"./ListItem-Djh9MDE8.js";import"./ListItemText-CmJpp866.js";import"./LinkButton-CumiTSSk.js";import"./Button-CuEp1VFU.js";import"./CardHeader-CDOwFgV9.js";import"./Divider-DHi8Uy4i.js";import"./CardActions-DQbhJYoR.js";import"./BottomLink-CwOKJ6yQ.js";import"./ArrowForward-BfA2_ANj.js";const Z={title:"Data Display/CodeSnippet",component:t,tags:["!manifest"]},d={width:300},r=`const greeting = "Hello";
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
